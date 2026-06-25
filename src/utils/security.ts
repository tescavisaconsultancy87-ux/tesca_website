import { getEnv } from "./env";

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

export async function reportServerError(
  apiName: string,
  error: any,
  requestPayload: any,
  request: Request
): Promise<Response> {
  console.error(`[${apiName}] Server Error:`, error);

  // Send email notification to admin via Web3Forms in the background
  const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || (globalThis as any).process?.env?.WEB3FORMS_ACCESS_KEY;
  
  if (web3formsAccessKey) {
    const clientIP = getClientIP(request);
    const time = new Date().toISOString();
    
    const detailedMessage = `🚨 A server-side error occurred in the ${apiName} API route.

[Basic Details]
- API Route: ${apiName}
- Time: ${time}
- Client IP: ${clientIP}

[Error Details]
- Message: ${error?.message || String(error)}
- Code: ${error?.code || "N/A"}
- Stack Trace: ${error?.stack || "No stack trace available"}

[Request Payload]
${JSON.stringify(requestPayload, null, 2)}`;

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
