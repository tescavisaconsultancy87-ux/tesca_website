import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';

// In-memory rate limiting store (per-process; resets on deploy/restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // max 3 attempts per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// Periodically clean stale entries to prevent memory leaks (every 100 requests)
let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter++;
  if (cleanupCounter >= 100) {
    cleanupCounter = 0;
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  maybeCleanup();

  // Extract client IP for rate limiting
  const clientIP =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Rate limit check
  if (isRateLimited(clientIP)) {
    // Return the same generic message to avoid leaking rate limit info
    return new Response(
      JSON.stringify({
        success: true,
        message: "If an administrator account exists with that email, a password reset link has been sent.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const email = body.email?.toString().trim().toLowerCase();

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Security: Only send reset if email is in the admins allowlist table
    const { data: adminRecord, error: dbError } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (!dbError && adminRecord) {
      // Email IS an allowlisted admin — trigger Supabase password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/admin`,
      });

      if (resetError) {
        console.error("Supabase password reset error:", resetError.message);
        // Don't expose internal errors to client
      }
    } else {
      // Email is NOT in the admins table — silently do nothing
      // This prevents attackers from enumerating valid admin emails
      console.log(`Password reset attempted for non-admin email: ${email.substring(0, 3)}***`);
    }

    // Always return the same generic success response (prevents email enumeration)
    return new Response(
      JSON.stringify({
        success: true,
        message: "If an administrator account exists with that email, a password reset link has been sent.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "An unexpected error occurred. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
