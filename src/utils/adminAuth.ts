import { getSupabaseAdmin } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Authenticate an admin session from cookies.
 *
 * Flow:
 *  1. Validate the access token via Supabase getUser().
 *  2. If the access token is expired/invalid, attempt a transparent refresh
 *     using the refresh token cookie.
 *  3. On successful refresh, update both cookies with the new tokens so the
 *     browser receives a fresh session without requiring re-login.
 *  4. In all cases, verify the user's email is in the admins allowlist.
 *
 * Cookie security attributes (httpOnly, secure, sameSite=strict) are preserved
 * on every cookie write.
 */
export async function checkAdminAuth(cookies: any): Promise<boolean> {
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  // No tokens at all — definitely not authenticated
  if (!accessToken && !refreshToken) return false;

  const sb = getSupabaseAdmin();

  // ── 1. Try the current access token ──────────────────────────────────
  if (accessToken) {
    try {
      const { data: { user }, error } = await sb.auth.getUser(accessToken);
      if (!error && user?.email) {
        if (await isAllowlistedAdmin(sb, user.email)) {
          return true;
        }
      }
    } catch (err) {
      // Access token invalid/expired — fall through to refresh
    }
  }

  // ── 2. Access token failed — attempt transparent refresh ─────────────
  if (refreshToken) {
    try {
      const { data, error } = await sb.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (!error && data.session && data.user?.email) {
        if (await isAllowlistedAdmin(sb, data.user.email)) {
          // Persist refreshed tokens with the same security attributes
          cookies.set("sb-access-token", data.session.access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: data.session.expires_in || 3600,
          });
          cookies.set("sb-refresh-token", data.session.refresh_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          return true;
        }
      }
    } catch (err) {
      console.error("Supabase session refresh failed:", err);
    }
  }

  // ── 3. Both verification and refresh failed ──────────────────────────
  // Clear stale cookies so subsequent requests don't repeatedly attempt and fail refresh.
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return false;
}

/** Check whether an email is present in the admins allowlist table. */
async function isAllowlistedAdmin(sb: SupabaseClient, email: string): Promise<boolean> {
  try {
    const { data, error } = await sb
      .from("admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    return !error && !!data;
  } catch {
    return false;
  }
}
