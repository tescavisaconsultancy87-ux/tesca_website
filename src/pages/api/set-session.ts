import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { genericApiError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

export const POST: APIRoute = async ({ request, cookies }) => {
  const oversized = rejectOversizedJson(request, 16 * 1024);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`set-session:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
const { access_token, refresh_token, expires_in } = await request.json();
    if (!access_token || !refresh_token) {
      return jsonResponse({ success: false, message: "Missing tokens" }, 400);
    }

    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user?.email) {
      return jsonResponse({ success: false, message: "Invalid session" }, 401);
    }

    const { data: adminRecord, error: dbError } = await supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .maybeSingle();

    if (dbError || !adminRecord) {
      return jsonResponse({ success: false, message: "Unauthorized" }, 403);
    }

    cookies.set("sb-access-token", access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: expires_in || 3600,
    });

    cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days — outlives the short-lived access token
    });

    return jsonResponse({ success: true });
  } catch (err: any) {
    console.error("Set session error:", err);
    return genericApiError();
  }
};
