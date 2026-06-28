import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { genericApiError, getClientIP, checkRateLimit, jsonResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

export const POST: APIRoute = async ({ request }) => {
  const oversized = rejectOversizedJson(request, 16 * 1024);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`forgot-password:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    // Return the same generic message to avoid leaking rate limit info
    return jsonResponse({
        success: true,
        message: "If an administrator account exists with that email, a password reset link has been sent.",
    });
  }

  try {
    const body = await request.json();
    const email = body.email?.toString().trim().toLowerCase();

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, message: "Please enter a valid email address." }, 400);
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
    return genericApiError();
  }
};
