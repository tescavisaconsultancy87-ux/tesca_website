import type { APIRoute } from "astro";
import { getSupabase } from "../utils/supabase";

export const prerender = false;

const SITE = "https://tescavisa.com";

/**
 * Static pages and their sitemap metadata.
 * Ordered by priority (homepage first).  Only public, crawlable pages —
 * /admin, /api, /review-generator are intentionally excluded.
 */
const STATIC_PAGES: { url: string; changefreq: string; priority: string }[] = [
  // Core pages
  { url: "/", changefreq: "daily", priority: "1.0" },
  { url: "/countries", changefreq: "weekly", priority: "0.9" },
  { url: "/services", changefreq: "weekly", priority: "0.9" },
  { url: "/universities", changefreq: "weekly", priority: "0.8" },
  { url: "/eligibility", changefreq: "weekly", priority: "0.8" },
  { url: "/gallery", changefreq: "weekly", priority: "0.7" },
  { url: "/updates", changefreq: "weekly", priority: "0.7" },
  { url: "/partner-with-us", changefreq: "monthly", priority: "0.7" },
  { url: "/inquiry", changefreq: "monthly", priority: "0.5" },

  // Service sub-pages
  { url: "/services/testprep", changefreq: "weekly", priority: "0.7" },
  { url: "/services/counselling", changefreq: "monthly", priority: "0.6" },
  { url: "/services/admission", changefreq: "monthly", priority: "0.6" },
  { url: "/services/sop", changefreq: "monthly", priority: "0.6" },
  { url: "/services/scholarships", changefreq: "monthly", priority: "0.6" },
  { url: "/services/visa", changefreq: "monthly", priority: "0.6" },
  { url: "/services/insurance", changefreq: "monthly", priority: "0.6" },
  { url: "/services/financial", changefreq: "monthly", priority: "0.6" },
  { url: "/services/accommodation", changefreq: "monthly", priority: "0.6" },
  { url: "/services/departure", changefreq: "monthly", priority: "0.6" },
  { url: "/services/passport", changefreq: "monthly", priority: "0.6" },
  { url: "/services/tickets", changefreq: "monthly", priority: "0.6" },

  // Study-abroad country pages
  { url: "/study-abroad/canada", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/uk", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/australia", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/germany", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/usa", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/new-zealand", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/ireland", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/europe", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/singapore", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/dubai", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/malaysia", changefreq: "monthly", priority: "0.7" },
  { url: "/study-abroad/switzerland", changefreq: "monthly", priority: "0.7" },

  // Visa-specific landing pages
  { url: "/visitor-visa", changefreq: "monthly", priority: "0.6" },
  { url: "/dependent-visa", changefreq: "monthly", priority: "0.6" },
  { url: "/work-permit", changefreq: "monthly", priority: "0.6" },
  { url: "/tourist-visa-schengen", changefreq: "monthly", priority: "0.6" },
  { url: "/uk-visitor-visa", changefreq: "monthly", priority: "0.6" },
  { url: "/usa-visitor-visa", changefreq: "monthly", priority: "0.6" },
  { url: "/uk-graduate-route", changefreq: "monthly", priority: "0.6" },
  { url: "/visa-refusal-help", changefreq: "monthly", priority: "0.6" },
  { url: "/canada-pr", changefreq: "monthly", priority: "0.6" },
  { url: "/canada-express-entry", changefreq: "monthly", priority: "0.6" },
  { url: "/australia-pr", changefreq: "monthly", priority: "0.6" },
  { url: "/germany-opportunity-card", changefreq: "monthly", priority: "0.6" },

  // SEO local landing pages
  { url: "/visa-consultant-in-surat", changefreq: "monthly", priority: "0.6" },
  { url: "/ielts-classes-in-surat", changefreq: "monthly", priority: "0.6" },

  // Trust & legal pages
  { url: "/visa-success-sla", changefreq: "monthly", priority: "0.5" },
  { url: "/security-audit", changefreq: "monthly", priority: "0.4" },
  { url: "/privacy-policy", changefreq: "monthly", priority: "0.4" },
  { url: "/terms-of-service", changefreq: "monthly", priority: "0.4" },
];

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const GET: APIRoute = async () => {
  // ── Fetch published blog posts from Supabase ────────────────────────
  let blogEntries: { slug: string; lastmod?: string }[] = [];
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      blogEntries = data.map((post: any) => ({
        slug: post.slug,
        lastmod: post.created_at
          ? new Date(post.created_at).toISOString().split("T")[0]
          : undefined,
      }));
    }
  } catch (err) {
    // Supabase unavailable — generate sitemap without blog posts
    console.error("[Sitemap] Failed to fetch blog posts:", err);
  }

  // ── Build XML ───────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const page of STATIC_PAGES) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE}${escapeXml(page.url)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blog index page
  xml += `  <url>\n`;
  xml += `    <loc>${SITE}/blog</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;

  // Individual blog posts
  for (const post of blogEntries) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE}/blog/${escapeXml(post.slug)}</loc>\n`;
    if (post.lastmod) {
      xml += `    <lastmod>${post.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
