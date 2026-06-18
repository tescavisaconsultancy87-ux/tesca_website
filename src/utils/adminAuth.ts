import { supabase } from "./supabase";

// Cryptographic hash token helper for legacy session fallback
export async function hashToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_tesca_admin_salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Authenticate session cookie
export async function checkAdminAuth(cookies: any): Promise<boolean> {
  // 1. Try Supabase Auth session first
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;
  
  if (accessToken && refreshToken) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (!error && user) {
        return true;
      }
    } catch (err) {
      console.error("Supabase getUser failed:", err);
    }
  }

  // 2. Fallback to legacy session cookie check
  const expectedPassword = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || "admin1234";
  const sessionCookie = cookies.get("admin_session")?.value;
  const expectedHash = await hashToken(expectedPassword);
  return sessionCookie === expectedHash;
}

