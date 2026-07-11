import { jsonResponse } from "./security";

const CSRF_COOKIE = "admin_csrf_token";
const CSRF_FIELD = "csrf_token";

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function ensureCsrfToken(cookies: any): string {
  let token = cookies.get(CSRF_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    token = randomToken();
    cookies.set(CSRF_COOKIE, token, {
      path: "/admin",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 12,
    });
  }
  return token;
}

export async function validateAdminCsrf(request: Request, cookies: any): Promise<Response | null> {
  const expected = cookies.get(CSRF_COOKIE)?.value;
  if (!expected || !/^[a-f0-9]{64}$/.test(expected)) {
    return jsonResponse({ error: "Invalid security token." }, 403);
  }

  let provided = request.headers.get("x-csrf-token") || "";
  if (!provided) {
    try {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
        const formData = await request.clone().formData();
        provided = formData.get(CSRF_FIELD)?.toString() || "";
      } else if (contentType.includes("application/json")) {
        const body = await request.clone().json().catch(() => ({}));
        provided = body?.[CSRF_FIELD]?.toString?.() || "";
      }
    } catch {
      provided = "";
    }
  }

  if (provided !== expected) {
    return jsonResponse({ error: "Invalid security token." }, 403);
  }

  return null;
}
