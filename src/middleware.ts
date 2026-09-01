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
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://static.cloudflareinsights.com https://us.i.posthog.com https://*.posthog.com",
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
  "font-src 'self' data: https://*.fontshare.com https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data: blob: https://flagcdn.com https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://*.google.com https://www.google.co.in https://*.google.co.in https://stats.g.doubleclick.net https://*.doubleclick.net",
  "connect-src 'self' https://*.supabase.co https://script.google.com https://api.web3forms.com https://api.emailjs.com https://www.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.google-analytics.com https://www.google.com https://*.google.com https://stats.g.doubleclick.net https://*.doubleclick.net https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://us.i.posthog.com https://*.posthog.com https://app.posthog.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://script.google.com",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const onRequest = defineMiddleware(async (context, next) => {
  // Populate the runtime env store used by getEnv(). On Astro v6 +
  // @astrojs/cloudflare v13, `Astro.locals.runtime.env` was removed; the
  // canonical source for the Worker env is now `import { env } from
  // "cloudflare:workers"`. This module is externalized in astro.config.mjs,
  // so the dynamic import resolves to the live Worker env at runtime and
  // rejects in Node/build contexts (caught here). Idempotent per request.
  try {
    const workerEnv = await import("cloudflare:workers").catch(() => null as any);
    if (workerEnv?.env) setRuntimeEnv(workerEnv.env);
  } catch (e) {
    // Non-worker context (local Node / build) — getEnv() falls back to
    // process.env / import.meta.env in that case, so this is a no-op.
  }

  // --- 1. Block requests with empty / missing User-Agent (bot spam protection) ---
  const userAgent = context.request.headers.get("user-agent");
  if (!userAgent || userAgent.trim() === "") {
    return new Response("Bad Request: Missing User-Agent header", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { hostname, pathname: reqPath, search } = context.url;
  const lowerPath = reqPath.toLowerCase();

  // --- 2. Fast-path reject automated bot vulnerability probes ---
  // Blocks common PHP/CMS probes (.php, wp-login, xmlrpc, .env files, git/ci configs, etc.)
  // with a lightweight text 404 before triggering Astro SSR rendering overhead.
  const isProbePath =
    lowerPath.endsWith(".php") ||
    lowerPath.endsWith(".env") ||
    lowerPath.includes(".env.") ||
    lowerPath.endsWith(".yml") ||
    lowerPath.endsWith(".yaml") ||
    lowerPath.endsWith(".sql") ||
    lowerPath.endsWith(".bak") ||
    lowerPath.endsWith(".config") ||
    lowerPath.endsWith(".ini") ||
    lowerPath.includes("wp-login") ||
    lowerPath.includes("xmlrpc") ||
    lowerPath.includes("wp-admin") ||
    lowerPath.includes("wp-content") ||
    lowerPath.includes("wp-json") ||
    lowerPath.includes("wordpress") ||
    lowerPath.includes("phpmyadmin") ||
    lowerPath.includes("pma") ||
    lowerPath.includes("/.git") ||
    lowerPath.includes("/.gitlab") ||
    lowerPath.includes("/.env") ||
    lowerPath === "/settings.json" ||
    lowerPath === "/api/config" ||
    lowerPath === "/api/env" ||
    lowerPath === "/fetch" ||
    lowerPath === "/proxy";

  if (isProbePath) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  const isPreviewHost = hostname.endsWith(".pages.dev") || hostname.endsWith(".workers.dev");
  const isPublicHost = hostname === "tescavisa.com" || hostname === "www.tescavisa.com";
  const isAdminHost = hostname === "admin.tescavisa.com";

  // --- 3. Handle stray / probed subdomains cleanly ---
  // Cloudflare analytics showed heavy scanner traffic against arbitrary subdomains
  // (e.g. itrustvisa.tescavisa.com, admin-console.tescavisa.com). Returning a direct 404
  // stops redirect loops and prevents inflating 3xx redirect analytics.
  if (!isPublicHost && !isAdminHost && !isLocalHost && !isPreviewHost) {
    return new Response("Host Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // --- Canonicalize www to apex domain ---
  if (hostname === "www.tescavisa.com") {
    return Response.redirect(`https://tescavisa.com${reqPath}${search}`, 301);
  }

  // --- Redirect legacy apex admin URLs to the dedicated admin subdomain ---
  // The admin panel now lives on admin.tescavisa.com. Permanently (301) redirect
  // tescavisa.com/admin and /admin/* — preserving the full path and query string —
  // so existing URLs keep working unchanged (e.g. /admin/dashboard ->
  // admin.tescavisa.com/admin/dashboard). Scoped to the production apex host only:
  // the admin subdomain itself (no loop), local dev (localhost), and preview hosts
  // (*.pages.dev) are intentionally left alone so admin development still works there.
  const isApexHost = isPublicHost;
  const isAdminPath = reqPath === "/admin" || reqPath.startsWith("/admin/");

  // Apex-host admin URLs must redirect to the dedicated admin subdomain BEFORE
  // any CSRF mint/validate runs. CSRF cookies are host-scoped, so minting on
  // the apex host and then redirecting to admin.tescavisa.com desyncs the token
  // in the DOM from the cookie on the new host, causing a silent 403 on submit.
  if (isApexHost && isAdminPath) {
    return Response.redirect(`https://admin.tescavisa.com${reqPath}${search}`, 301);
  }

  // Only the canonical admin subdomain (and local/preview hosts) do CSRF from
  // here on — the apex host never touches CSRF, it just redirects.
  if (isAdminPath) {
    ensureCsrfToken(context.cookies);
    if (context.request.method === "POST") {
      const csrfError = await validateAdminCsrf(context.request, context.cookies);
      if (csrfError) return csrfError;
    }
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
  const isApiRoute = reqPath.startsWith("/api/");
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
  const isAllowedOnAdminHost = isAdminPath || isApiRoute || isStaticAsset;
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
  // Cache safe, anonymous GET HTML on public routes. s-maxage=3600 lets Cloudflare
  // serve from edge for 1h; stale-while-revalidate keeps it instant while refreshing.
  const isGet = context.request.method === "GET";
  const contentType = response.headers.get("content-type") || "";
  const isHtml = contentType.includes("text/html");
  const setsCookie = response.headers.has("set-cookie");

  if (isGet && isHtml && !isAdmin && !isApi && !setsCookie && response.status === 200) {
    const isDynamicPage =
      pathname === "/" ||
      pathname === "/blog" ||
      pathname.startsWith("/blog/") ||
      pathname === "/updates" ||
      pathname === "/gallery";

    if (isDynamicPage) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=0, s-maxage=10, stale-while-revalidate=30"
      );
    } else {
      response.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
      );
    }
  }

  return response;
});
