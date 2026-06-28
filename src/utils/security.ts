import { getEnv } from "./env";
import { getSupabaseAdmin } from "./supabase";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
let cleanupCounter = 0;

export function getClientIP(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  cleanupCounter++;
  if (cleanupCounter >= 100) {
    cleanupCounter = 0;
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (now > storedEntry.resetAt) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > max;
}

/**
 * Shared, cross-isolate rate limiter. Returns true when the caller is OVER the
 * limit. Backed by the Supabase `check_rate_limit` RPC (see
 * db/rate_limit_setup.sql) so counts hold across all Cloudflare Workers isolates
 * and edge locations — unlike the in-memory `isRateLimited` above.
 *
 * Falls back to the per-isolate in-memory limiter when the Supabase service-role
 * key is unavailable (e.g. local dev) or the RPC errors, so requests are never
 * blocked by limiter infrastructure problems and local development still works.
 */
export async function checkRateLimit(key: string, max: number, windowMs: number): Promise<boolean> {
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: Math.max(1, Math.ceil(windowMs / 1000)),
    });

    if (!error && typeof data === "boolean") {
      return data;
    }
  } catch (err) {
    console.error("checkRateLimit: Supabase RPC failed, using in-memory fallback:", err);
  }

  // Fallback: per-isolate in-memory limiter (best-effort).
  return isRateLimited(key, max, windowMs);
}

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function genericApiError(): Response {
  return jsonResponse({ error: "Unable to process request. Please try again later." }, 500);
}

// Field names whose values are considered PII / sensitive and must not leave
// our infrastructure in error notifications routed through third parties.
const SENSITIVE_KEYS = new Set([
  "email", "phone", "mobile", "mobilenumber", "name", "fullname",
  "firstname", "lastname", "password", "comments", "message", "city",
]);

// Shallow-redact a request payload: mask values of sensitive keys, keep the
// structure/keys so the alert remains useful for debugging.
function redactPayload(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(redactPayload);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[redacted]" : redactPayload(v);
    }
    return out;
  }
  return value;
}

export async function reportServerError(
  apiName: string,
  error: any,
  requestPayload: any,
  request: Request
): Promise<Response> {
  // Full diagnostics (stack trace + raw payload) stay in Cloudflare server logs only.
  console.error(`[${apiName}] Server Error:`, error, "Payload:", requestPayload);

  // Send email notification to admin via Web3Forms in the background
  const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || (globalThis as any).process?.env?.WEB3FORMS_ACCESS_KEY;

  if (web3formsAccessKey) {
    const clientIP = getClientIP(request);
    const time = new Date().toISOString();

    // Notification is intentionally PII-free: no stack trace, no raw user data.
    // Use the timestamp + API route to correlate with full Cloudflare logs.
    const detailedMessage = `🚨 A server-side error occurred in the ${apiName} API route.

[Basic Details]
- API Route: ${apiName}
- Time: ${time}
- Client IP: ${clientIP}

[Error Details]
- Message: ${error?.message || String(error)}
- Code: ${error?.code || "N/A"}

[Request Fields (PII redacted)]
${JSON.stringify(redactPayload(requestPayload), null, 2)}

Full stack trace and unredacted payload are available in the Cloudflare Workers logs for this timestamp.`;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: web3formsAccessKey,
        name: "TESCA Error Notification System",
        email: "system-error@tescavisa.com",
        subject: `⚠️ Server Error in ${apiName} API`,
        message: detailedMessage,
        source: "System Error Monitor",
      })
    }).catch(err => console.error("Failed to send error notification email via Web3Forms:", err));
  }

  return jsonResponse({ error: "Unable to process request. Please try again later." }, 500);
}

export function rejectOversizedJson(request: Request, maxBytes = 64 * 1024): Response | null {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }
  return null;
}

export function rateLimitResponse(): Response {
  return jsonResponse({ error: "Too many requests. Please try again later." }, 429, {
    "Retry-After": "60",
  });
}
