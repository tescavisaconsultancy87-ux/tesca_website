import { supabase } from "./supabase";

// Cryptographic hash token helper for legacy session fallback (deprecated, kept for compatibility if needed)
export async function hashToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_tesca_admin_salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Helper to sign dynamic sessions using HMAC-SHA256 keyed on the admin password secret
export async function signSessionToken(email: string, expiresAt: number, secret: string): Promise<string> {
  const message = `${email}:${expiresAt}`;
  const encoder = new TextEncoder();
  // Add a salt to the key to enforce password complexity
  const keyData = encoder.encode(secret + "_tesca_session_key_salt");
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return `${message}:${signatureHex}`;
}

// Helper to verify dynamic sessions using HMAC-SHA256
export async function verifySessionToken(token: string | null | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [email, expiresAtStr, signatureHex] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);

  if (isNaN(expiresAt) || expiresAt < Date.now()) {
    return false; // Token is invalid or has expired
  }

  const expectedToken = await signSessionToken(email, expiresAt, secret);
  return token === expectedToken;
}

// Authenticate session cookie — uses Supabase Auth + admins table only
export async function checkAdminAuth(cookies: any): Promise<boolean> {
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;
  
  if (accessToken && refreshToken) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (!error && user && user.email) {
        // Query database to see if user is allowlisted as admin
        const { data: adminRecord, error: dbError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();

        if (!dbError && adminRecord) {
          return true;
        }
      }
    } catch (err) {
      console.error("Supabase getUser failed:", err);
    }
  }

  return false;
}

