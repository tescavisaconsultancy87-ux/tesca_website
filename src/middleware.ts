import { defineMiddleware } from "astro:middleware";
import { setRuntimeEnv } from "./utils/env";

// CSP sources reflect what the site actually loads:
// - scripts: Google Tag Manager / Analytics (+ inline gtag bootstrap)
// - styles/fonts: Fontshare (General Sans) + Google Fonts (Plus Jakarta Sans)
// - images: flagcdn, Supabase storage, GA
// - connect (XHR/fetch): Supabase, Google Apps Script, Web3Forms, EmailJS, GA
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
  "font-src 'self' data: https://api.fontshare.com https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://flagcdn.com https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
  "connect-src 'self' https://*.supabase.co https://script.google.com https://api.web3forms.com https://api.emailjs.com https://www.google-analytics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://script.google.com",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const { env } = await import("cloudflare:workers");
    if (env) setRuntimeEnv(env);
  } catch (e) {
    // Fallback/ignore during local development or build time
  }

  const response = await next();
  const { pathname } = context.url;
  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  // --- Security headers (all responses) ---
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), geolocation=(), payment=(), usb=(), microphone=(), browsing-topics=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  // HSTS: force HTTPS for 1 year. includeSubDomains/preload omitted until every
  // subdomain (incl. www) is verified HTTPS-only.
  response.headers.set("Strict-Transport-Security", "max-age=31536000");
  // Rolled out as Report-Only first so we can confirm nothing breaks before
  // promoting to the enforcing `Content-Security-Policy` header.
  response.headers.set("Content-Security-Policy-Report-Only", CSP);

  // --- Keep the admin panel out of search engines (more reliable than robots.txt) ---
  if (isAdmin) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // --- Edge caching for public HTML pages ---
  // Only cache safe, anonymous GET HTML on public routes. Never cache admin/api,
  // anything that sets a cookie, or non-GET requests. s-maxage lets Cloudflare
  // serve from the edge for 5 min; stale-while-revalidate keeps it instant while
  // refreshing in the background, so admin content updates appear within ~5 min.
  const isGet = context.request.method === "GET";
  const contentType = response.headers.get("content-type") || "";
  const isHtml = contentType.includes("text/html");
  const setsCookie = response.headers.has("set-cookie");

  if (isGet && isHtml && !isAdmin && !isApi && !setsCookie && response.status === 200) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
    );
  }

  return response;
});
