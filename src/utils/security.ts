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

    if (error) {
      console.warn(
        `[RateLimiter] Supabase RPC check_rate_limit returned an error (code: ${error.code}). ` +
        `If the function is missing, please deploy it using the SQL migration at db/rate_limit_setup.sql. ` +
        `Falling back to per-isolate in-memory limiter. Error details:`,
        error.message
      );
    } else if (typeof data === "boolean") {
      return data;
    }
  } catch (err) {
    console.error(
      "[RateLimiter] Supabase RPC request failed with exception. " +
      "If the function has not been set up, please execute db/rate_limit_setup.sql. " +
      "Falling back to per-isolate in-memory limiter. Exception:",
      err
    );

    if (getEnv("STRICT_RATE_LIMITS") === "true") {
      return true;
    }
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

function generateCorrelationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).substring(2, 10);
}

export function genericApiError(customId?: string): Response {
  const correlationId = customId || generateCorrelationId();
  return jsonResponse({
    error: "Unable to process request. Please try again later.",
    correlationId,
  }, 500);
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
  _request?: Request,
  _locals?: unknown
): Promise<Response> {
  const correlationId = generateCorrelationId();
  // Sanitized diagnostics: mask PII and credentials from server logs alongside correlationId.
  console.error(`[${apiName}] [CorrelationId: ${correlationId}] Server Error:`, error, "Payload:", redactPayload(requestPayload));

  return jsonResponse({
    error: "Unable to process request. Please try again later.",
    correlationId,
  }, 500);
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
