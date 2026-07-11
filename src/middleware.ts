import { defineMiddleware } from "astro:middleware";
import { setRuntimeEnv } from "./utils/env";
import { ensureCsrfToken, validateAdminCsrf } from "./utils/csrf";

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

  // --- Redirect legacy apex admin URLs to the dedicated admin subdomain ---
  // The admin panel now lives on admin.tescavisa.com. Permanently (301) redirect
  // tescavisa.com/admin and /admin/* — preserving the full path and query string —
  // so existing URLs keep working unchanged (e.g. /admin/dashboard ->
  // admin.tescavisa.com/admin/dashboard). Scoped to the production apex host only:
  // the admin subdomain itself (no loop), local dev (localhost), and preview hosts
  // (*.pages.dev) are intentionally left alone so admin development still works there.
  const { hostname, pathname: reqPath, search } = context.url;
  const isApexHost = hostname === "tescavisa.com" || hostname === "www.tescavisa.com";
  const isAdminPath = reqPath === "/admin" || reqPath.startsWith("/admin/");
  if (isAdminPath) {
    ensureCsrfToken(context.cookies);
    if (context.request.method === "POST") {
      const csrfError = await validateAdminCsrf(context.request, context.cookies);
      if (csrfError) return csrfError;
    }
  }
  if (isApexHost && isAdminPath) {
    return Response.redirect(`https://admin.tescavisa.com${reqPath}${search}`, 301);
  }

  // --- Harden the admin subdomain: serve ONLY admin pages + required admin APIs ---
  // admin.tescavisa.com must not expose public content. Allowed surface:
  //   - /admin and /admin/*            (the admin pages)
  //   - /api/set-session               (recovery flow establishes session cookies)
  //   - /api/forgot-password           (login page "forgot password")
  //   - /api/leads-count               (AdminHeader unread-leads badge)
  // The bare root is sent to the admin entry point; any other on-demand route is
  // permanently redirected to the same path on the public apex host.
  // NOTE: this governs SSR/on-demand routes only. Prerendered pages and static
  // assets are served by Cloudflare's asset layer *before* this middleware runs,
  // so a Cloudflare Redirect Rule (see Phase 5 notes) is required to fully fence
  // those off the admin subdomain.
  const isAdminHost = hostname === "admin.tescavisa.com";
  const ADMIN_APIS = new Set(["/api/set-session", "/api/forgot-password", "/api/leads-count", "/api/announcements"]);
  // Static assets must ALWAYS be served (never redirected) so the admin UI loads:
  // hashed build output (/_astro/*), images, fonts, and any file with an extension
  // (favicon.ico, robots.txt, manifest.*, sitemap.xml, *.css, *.js, ...). Real pages
  // are extensionless, so the extension test only ever matches assets.
  const isStaticAsset =
    reqPath.startsWith("/_astro/") ||
    reqPath.startsWith("/images/") ||
    reqPath.startsWith("/fonts/") ||
    reqPath.startsWith("/bank/") ||
    reqPath.startsWith("/material/") ||
    /\.[a-zA-Z0-9]+$/.test(reqPath);
  const isAllowedOnAdminHost = isAdminPath || ADMIN_APIS.has(reqPath) || isStaticAsset;
  if (isAdminHost && !isAllowedOnAdminHost) {
    if (reqPath === "/") {
      return Response.redirect("https://admin.tescavisa.com/admin", 301);
    }
    return Response.redirect(`https://tescavisa.com${reqPath}${search}`, 301);
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
  // HSTS: force HTTPS for 1 year incl. subdomains (www now redirects over HTTPS).
  // `preload` intentionally omitted — it's a hard-to-reverse public commitment.
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set("Content-Security-Policy", CSP);

  // --- Keep the admin panel out of search engines (more reliable than robots.txt) ---
  if (isAdmin) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // --- Edge caching for public HTML pages ---
  // Only cache safe, anonymous GET HTML on public routes. Never cache admin/api,
  // anything that sets a cookie, or non-GET requests. s-maxage lets Cloudflare
  // serve from the edge for 30 min; stale-while-revalidate keeps it instant while
  // refreshing in the background, so public content updates appear within ~30 min.
  const isGet = context.request.method === "GET";
  const contentType = response.headers.get("content-type") || "";
  const isHtml = contentType.includes("text/html");
  const setsCookie = response.headers.has("set-cookie");

  if (isGet && isHtml && !isAdmin && !isApi && !setsCookie && response.status === 200) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=1800, stale-while-revalidate=86400"
    );
  }

  return response;
});
