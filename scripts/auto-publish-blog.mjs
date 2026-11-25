#!/usr/bin/env node
/**
 * Zero-AI-API-Key Daily Auto-Blog Publisher for TESCA Visa Consultancy.
 *
 * Strategy:
 *   1. Checks Supabase `blog_posts` (and static `src/data/blog.ts`) to prevent
 *      repeating any slug, topic_key, source_url, or high-overlap title.
 *   2. Fetches public Google News RSS feeds across rotated study-abroad & visa
 *      topics (no API key required). Scores and filters relevant stories.
 *   3. Synthesizes a clean, domain-expert HTML article + FAQs from verified
 *      country/visa knowledge bases without calling any external LLM API.
 *   4. Falls back to the non-repeating evergreen study-abroad topic bank if no
 *      unseen trending RSS story qualifies today.
 *
 * Usage:
 *   node scripts/auto-publish-blog.mjs             # Live insert into Supabase
 *   node scripts/auto-publish-blog.mjs --dry-run   # Print generated post only
 *   node scripts/auto-publish-blog.mjs --force     # Allow publishing even if one auto post ran today
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  COUNTRY_PROFILES,
  EVERGREEN_TOPICS,
  RSS_TOPICS,
  TAG_COLORS,
} from "./auto-blog-bank.mjs";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const FORCE = args.has("--force");

const SUPABASE_URL =
  process.env.PUBLIC_SUPABASE_URL ||
  "https://zlsauoosumpnbyouhdfk.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have",
  "how", "in", "into", "is", "it", "its", "new", "not", "of", "on", "or", "out",
  "rules", "says", "student", "students", "study", "that", "the", "their", "this",
  "to", "under", "update", "updates", "visa", "visas", "what", "when", "why", "will",
  "with", "you", "your", "indian", "india", "abroad", "2025", "2026", "2027",
]);

const RELEVANT_KEYWORDS = [
  "visa", "student", "study", "university", "universities", "college",
  "immigration", "ielts", "pte", "tuition", "scholarship", "permit",
  "graduate route", "pgwp", "chancenkarte", "opportunity card", "f1", "f-1",
  "subclass 500", "blocked account", "sperrkonto", "gic", "cas", "pal", "intake",
  "post-study", "work rights", "pr ", "permanent residency",
];

const NOISE_KEYWORDS = [
  "murder", "arrested", "crime", "cricket", "ipl", "bollywood", "movie",
  "stock market", "sensex", "nifty", "horoscope", "astrology", "weather",
];

const TOPIC_MATCHERS = {
  uk: /\b(uk|united kingdom|britain|british|ukvi|graduate route|cas|england|scotland)\b/i,
  canada: /\b(canada|canadian|ircc|pgwp|study permit|dli|pal|ontario|toronto|vancouver)\b/i,
  australia: /\b(australia|australian|subclass 500|cricos|oshc|melbourne|sydney)\b/i,
  germany: /\b(germany|german|aps|sperrkonto|blocked account|chancenkarte|opportunity card|uni-assist)\b/i,
  usa: /\b(usa|u\.s\.|united states|america|american|f-1|f1|sevis|i-20|opt|stem opt)\b/i,
  ielts: /\b(ielts|pte|duolingo|toefl|english test|band score)\b/i,
  ireland: /\b(ireland|irish|dublin|stamp 2|third level graduate)\b/i,
  "new-zealand": /\b(new zealand|nz|nzqa|auckland|fts)\b/i,
  europe: /\b(europe|european|schengen|france|italy|finland|poland|netherlands|hungary|ireland|germany)\b/i,
  dubai: /\b(dubai|uae|united arab emirates|abu dhabi|khda)\b/i,
};

function trimAtWord(str, maxLen) {
  const clean = String(str ?? "").trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.5 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeXmlEntities(str) {
  return String(str ?? "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .replace(/-$/, "");
}

function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function getTodayIsoIST(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function jaccardSimilarity(aTokens, bTokens) {
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  const setA = new Set(aTokens);
  const setB = new Set(bTokens);
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function makeTopicKey(prefix, text) {
  const tokens = tokenize(text).sort().slice(0, 8).join("-");
  const hash = crypto
    .createHash("sha256")
    .update(`${prefix}:${tokens || text}`)
    .digest("hex")
    .slice(0, 12);
  return `${prefix}-${hash}`;
}

function parseRssItems(xmlText) {
  const items = [];
  const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];
  for (const raw of itemMatches) {
    const titleRaw = (raw.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "";
    const linkRaw = (raw.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "";
    const pubDateRaw = (raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "";
    const descRaw = (raw.match(/<description>([\s\S]*?)<\/description>/i) || [])[1] || "";
    const sourceRaw = (raw.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1] || "";

    let title = decodeXmlEntities(titleRaw);
    const sourceName = decodeXmlEntities(sourceRaw);
    if (sourceName && title.endsWith(` - ${sourceName}`)) {
      title = title.slice(0, -(` - ${sourceName}`.length)).trim();
    } else {
      title = title.replace(/\s+-\s+[^-]{2,40}$/, "").trim();
    }

    const link = decodeXmlEntities(linkRaw);
    const desc = decodeXmlEntities(descRaw);
    const pubDate = pubDateRaw ? new Date(pubDateRaw) : new Date();

    if (title && link) {
      items.push({
        title,
        link,
        desc,
        sourceName: sourceName || "International Education News",
        pubDate: Number.isNaN(pubDate.getTime()) ? new Date() : pubDate,
      });
    }
  }
  return items;
}

function scoreHeadline(item, topicCfg) {
  const lower = `${item.title} ${item.desc}`.toLowerCase();
  if (NOISE_KEYWORDS.some((n) => lower.includes(n))) return -1;
  const matcher = TOPIC_MATCHERS[topicCfg.key];
  if (matcher && !matcher.test(`${item.title} ${item.desc}`)) return -1;
  let score = 0;
  for (const kw of RELEVANT_KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }
  if (lower.includes("india") || lower.includes("indian")) score += 2;
  const ageDays = Math.max(0, (Date.now() - item.pubDate.getTime()) / 86400000);
  if (ageDays <= 3) score += 3;
  else if (ageDays <= 7) score += 2;
  else if (ageDays > 21) score -= 2;
  return score;
}

function detectAngle(title) {
  const lower = title.toLowerCase();
  if (/(fee|cost|fund|gic|blocked|sperrkonto|bank|loan|tuition|scholarship|financial)/.test(lower)) {
    return "finance";
  }
  if (/(refus|reject|delay|backlog|slot|interview|wait|scrutiny)/.test(lower)) {
    return "processing";
  }
  if (/(work|psw|pgwp|graduate route|job|career|chancenkarte|pr |residency)/.test(lower)) {
    return "work";
  }
  if (/(rule|policy|cap|limit|change|reform|new |ban|restrict|allow)/.test(lower)) {
    return "policy";
  }
  return "intake";
}

function getAngleGuidance(angle, countryName) {
  const map = {
    policy: {
      heading: "What Changed & Why Timing Matters",
      bullets: [
        `Policy updates in ${countryName} typically apply immediately to new visa lodgements rather than already-issued permits.`,
        "Applicants preparing files for upcoming intakes should double-check transition cut-off dates before paying non-refundable deposits.",
        "Always verify university CAS/LOA/CoE validity windows alongside updated embassy checklist notes.",
      ],
    },
    finance: {
      heading: "Financial Planning & Documentation Safeguards",
      bullets: [
        `Maintain clean, seasoned liquid funds or an official bank sanction letter well above the minimum ${countryName} threshold.`,
        "Avoid sudden unexplained large cash deposits right before generating your visa bank statements.",
        "Pair sponsor savings with 2–3 years of ITRs, income proofs, and clear relationship affidavits.",
      ],
    },
    processing: {
      heading: "How to Prevent Delays & Visa Refusals",
      bullets: [
        "Submit a complete, decision-ready file upfront so visa officers do not pause your application for missing verification.",
        "Address any study gaps, course switches, or past visa refusals directly inside your Statement of Purpose.",
        "Start biometrics and medicals as soon as your offer letter and financial proofs are locked.",
      ],
    },
    work: {
      heading: "Protecting Your Post-Study Work & Career ROI",
      bullets: [
        `Confirm whether your shortlisted course and institution qualify for full ${countryName} post-study work rights.`,
        "Target skill-shortage domains and accredited universities rather than unranked short-term diplomas.",
        "Plan internship and language milestones early so you graduate job-ready.",
      ],
    },
    intake: {
      heading: "Smart Intake & Application Strategy",
      bullets: [
        `Apply early for ${countryName} admissions to secure priority offer letters, scholarship consideration, and comfortable visa lead time.`,
        "Keep academic transcripts, MOI/IELTS scorecards, and passport renewals ready before portals open.",
        "Shortlist 3–4 balanced universities covering target, safe, and scholarship-friendly options.",
      ],
    },
  };
  return map[angle] || map.intake;
}

function buildTrendingArticle(item, topicCfg, displayDate) {
  const profile = COUNTRY_PROFILES[topicCfg.key] || COUNTRY_PROFILES.uk;
  const angle = detectAngle(item.title);
  const angleGuide = getAngleGuidance(angle, profile.country);
  const safeHeadline = escapeHtml(item.title);
  const safeSource = escapeHtml(item.sourceName);
  const safeUrl = escapeHtml(item.link);
  const dateIso = getTodayIsoIST();

  const suffix = /indian students/i.test(item.title)
    ? " — Visa & Admission Guide"
    : " — Key Takeaways for Indian Students";
  const title =
    item.title.length + suffix.length <= 110
      ? `${item.title}${suffix}`
      : trimAtWord(item.title, 110);
  const baseSlug = slugify(`${topicCfg.key}-${item.title}-${dateIso.slice(5)}`);
  const desc = trimAtWord(
    `Trending ${profile.country} update: ${item.title}. Key visa rules, financial requirements, and next steps for Indian applicants.`,
    190
  );

  const checklistHtml = profile.checklist
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join("\n        ");
  const angleBulletsHtml = angleGuide.bullets
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join("\n        ");

  const content = `
      <h2>Latest ${escapeHtml(profile.country)} Study &amp; Visa Spotlight</h2>
      <p><strong>Trending Update (${escapeHtml(displayDate)}):</strong> Recent coverage by <em>${safeSource}</em> highlighted: <strong>&ldquo;${safeHeadline}&rdquo;</strong>. For Indian students planning upcoming intakes, staying ahead of regulatory and admission shifts in ${escapeHtml(profile.country)} is essential before locking university deposits or visa slots.</p>
      <p>Reference report: <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeHeadline} (${safeSource})</a>.</p>

      <h2>${escapeHtml(angleGuide.heading)}</h2>
      <ul>
        ${angleBulletsHtml}
      </ul>

      <h2>Core ${escapeHtml(profile.visaName)} Requirements</h2>
      <p>Regardless of weekly headlines, approvals for ${escapeHtml(profile.country)} consistently depend on getting four fundamentals right:</p>
      <ul>
        <li><strong>Financial Proof:</strong> ${escapeHtml(profile.financialRule)}.</li>
        <li><strong>English Proficiency:</strong> ${escapeHtml(profile.englishRule)}.</li>
        <li><strong>Work &amp; Post-Study Pathway:</strong> ${escapeHtml(profile.workRule)}.</li>
      </ul>

      <h3>Mandatory Document Checklist</h3>
      <ol>
        ${checklistHtml}
      </ol>

      <h2>Next Steps with TESCA Visa Consultancy</h2>
      <p>Need a file review tailored to your academic profile, budget, or past refusal history? Explore our <a href="${topicCfg.guidePath}">${escapeHtml(profile.country)} Study Abroad Guide</a>, review <a href="/visa-refusal-help">Visa Refusal Support</a>, or <a href="/inquiry">book a free counselling session</a> with our Surat team.</p>
  `.trim();

  const faq = [
    {
      q: `How does this ${profile.country} update affect upcoming Indian applicants?`,
      a: `Applicants filing for ${profile.country} in upcoming intakes should verify financial seasoning, university offer conditions, and document deadlines early using our updated checklist.`,
    },
    ...profile.faqs,
  ];

  return {
    slug: baseSlug,
    title,
    description: desc,
    date: displayDate,
    tag: topicCfg.tag,
    tag_bg: TAG_COLORS[topicCfg.color] || TAG_COLORS.blue,
    content,
    faq,
    source: "auto",
    topic_key: makeTopicKey(topicCfg.key, item.title),
    source_url: item.link,
    is_published: true,
  };
}

function buildEvergreenArticle(topic, displayDate) {
  const profile = COUNTRY_PROFILES[topic.countryKey] || COUNTRY_PROFILES.uk;
  const guidePath =
    (RSS_TOPICS.find((t) => t.key === topic.countryKey) || {}).guidePath ||
    "/countries";
  const checklistHtml = profile.checklist
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join("\n        ");

  const content = `
      <h2>${escapeHtml(topic.title)}</h2>
      <p>${escapeHtml(topic.desc)} At TESCA Visa Consultancy, our counsellors audit hundreds of Indian student files every intake and see the same avoidable errors slow down otherwise strong applications.</p>

      <h2>Key ${escapeHtml(profile.country)} Benchmarks to Verify Early</h2>
      <ul>
        <li><strong>Primary Visa Route:</strong> ${escapeHtml(profile.visaName)}.</li>
        <li><strong>Financial Sufficiency:</strong> ${escapeHtml(profile.financialRule)}.</li>
        <li><strong>Language Benchmark:</strong> ${escapeHtml(profile.englishRule)}.</li>
        <li><strong>Work &amp; Post-Study Rights:</strong> ${escapeHtml(profile.workRule)}.</li>
      </ul>

      <h2>Step-by-Step Filing Checklist</h2>
      <ol>
        ${checklistHtml}
      </ol>

      <h2>Practical Guidance for Indian &amp; Gujarat Applicants</h2>
      <p>Start preparing your documents at least 4 to 6 months before your target intake. Clean bank seasoning, an authentic Statement of Purpose, and verified academic transcripts dramatically improve first-attempt approval rates.</p>
      <p>Read our complete <a href="${guidePath}">${escapeHtml(profile.country)} Country Guide</a> or <a href="/inquiry">schedule a 1-on-1 profile evaluation</a> at our Surat branches.</p>
  `.trim();

  return {
    slug: slugify(topic.title),
    title: topic.title,
    description: topic.desc,
    date: displayDate,
    tag: topic.tag,
    tag_bg: TAG_COLORS[topic.color] || TAG_COLORS.blue,
    content,
    faq: profile.faqs,
    source: "auto",
    topic_key: topic.key,
    source_url: null,
    is_published: true,
  };
}

function loadStaticSlugs() {
  try {
    const blogTsPath = path.join(process.cwd(), "src", "data", "blog.ts");
    const raw = fs.readFileSync(blogTsPath, "utf8");
    const matches = [...raw.matchAll(/slug:\s*["']([^"']+)["']/g)];
    return new Set(matches.map((m) => m[1]));
  } catch {
    return new Set();
  }
}

async function fetchRssFeed(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "TESCA-AutoBlog-Bot/1.0 (+https://tescavisa.com/blog)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssItems(xml);
  } catch (err) {
    console.warn(`[AutoBlog] RSS fetch failed for "${query}":`, err.message);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const displayDate = formatDisplayDate(new Date());
  const todayIso = getTodayIsoIST(new Date());
  const staticSlugs = loadStaticSlugs();

  let supabase = null;
  let existingPosts = [];

  if (SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, date, tag, created_at, topic_key, source_url, source")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(400);

    if (error) {
      // Graceful retry without new columns if migration hasn't run yet
      console.warn("[AutoBlog] Extended column select failed, retrying core columns:", error.message);
      const fallback = await supabase
        .from("blog_posts")
        .select("id, slug, title, date, tag, created_at")
        .is("deleted_at", null)
        .order("id", { ascending: false })
        .limit(400);
      if (fallback.error) {
        throw new Error(`Supabase query failed: ${fallback.error.message}`);
      }
      existingPosts = fallback.data || [];
    } else {
      existingPosts = data || [];
    }
  } else if (!DRY_RUN) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
  } else {
    console.warn("[AutoBlog] Running --dry-run without SUPABASE_SERVICE_ROLE_KEY (DB check skipped).");
  }

  // Prevent accidental duplicate run on the same IST calendar date
  if (!FORCE && !DRY_RUN) {
    const alreadyPostedToday = existingPosts.some((p) => {
      const createdIso = p.created_at ? getTodayIsoIST(new Date(p.created_at)) : "";
      return (p.source === "auto" || p.date === displayDate) && createdIso === todayIso;
    });
    if (alreadyPostedToday) {
      console.log(`[AutoBlog] Auto post already published today (${todayIso} / ${displayDate}). Skipping.`);
      return;
    }
  }

  const existingSlugs = new Set([...staticSlugs, ...existingPosts.map((p) => p.slug)]);
  const existingTopicKeys = new Set(existingPosts.map((p) => p.topic_key).filter(Boolean));
  const existingUrls = new Set(existingPosts.map((p) => p.source_url).filter(Boolean));
  const existingTitleTokens = existingPosts.map((p) => tokenize(p.title));
  const lastTag = existingPosts[0]?.tag || "";

  const isDuplicate = (candidateSlug, candidateTitle, topicKey, sourceUrl) => {
    if (existingSlugs.has(candidateSlug)) return true;
    if (topicKey && existingTopicKeys.has(topicKey)) return true;
    if (sourceUrl && existingUrls.has(sourceUrl)) return true;
    const tokens = tokenize(candidateTitle);
    return existingTitleTokens.some((prev) => jaccardSimilarity(tokens, prev) >= 0.45);
  };

  // Rotate RSS topic order by day-of-year and avoid repeating yesterday's tag
  const startIdx = getDayOfYear(new Date()) % RSS_TOPICS.length;
  const orderedTopics = [
    ...RSS_TOPICS.slice(startIdx),
    ...RSS_TOPICS.slice(0, startIdx),
  ].sort((a, b) => (a.tag === lastTag ? 1 : b.tag === lastTag ? -1 : 0));

  let generatedPost = null;

  for (const topicCfg of orderedTopics) {
    const items = await fetchRssFeed(topicCfg.query);
    const ranked = items
      .map((item) => ({ item, score: scoreHeadline(item, topicCfg) }))
      .filter((entry) => entry.score >= 3)
      .sort((a, b) => b.score - a.score);

    for (const { item } of ranked) {
      const candidate = buildTrendingArticle(item, topicCfg, displayDate);
      if (!isDuplicate(candidate.slug, candidate.title, candidate.topic_key, candidate.source_url)) {
        generatedPost = candidate;
        console.log(`[AutoBlog] Selected trending RSS topic (${topicCfg.tag}): "${candidate.title}"`);
        break;
      }
    }
    if (generatedPost) break;
  }

  // Fallback to non-repeating evergreen study-abroad bank
  if (!generatedPost) {
    const evergreenOrdered = [...EVERGREEN_TOPICS].sort((a, b) =>
      a.tag === lastTag ? 1 : b.tag === lastTag ? -1 : 0
    );
    for (const topic of evergreenOrdered) {
      const candidate = buildEvergreenArticle(topic, displayDate);
      if (!isDuplicate(candidate.slug, candidate.title, candidate.topic_key, null)) {
        generatedPost = candidate;
        console.log(`[AutoBlog] Selected evergreen fallback topic: "${candidate.title}"`);
        break;
      }
    }
  }

  if (!generatedPost) {
    console.log("[AutoBlog] All trending and evergreen topics already covered. Nothing to publish today.");
    return;
  }

  if (DRY_RUN) {
    console.log("\n=== DRY RUN GENERATED POST ===");
    console.log(JSON.stringify({ ...generatedPost, contentPreview: generatedPost.content.slice(0, 350) + "..." }, null, 2));
    return;
  }

  // Insert into Supabase (with graceful fallback if extended columns aren't migrated yet)
  let { error: insertError } = await supabase.from("blog_posts").insert(generatedPost);

  if (insertError && /column .* does not exist/i.test(insertError.message)) {
    console.warn("[AutoBlog] Extended columns not yet migrated; inserting core columns only.");
    const { source, topic_key, source_url, ...corePost } = generatedPost;
    const retry = await supabase.from("blog_posts").insert(corePost);
    insertError = retry.error;
  }

  if (insertError) {
    throw new Error(`Failed to insert auto-generated blog post: ${insertError.message}`);
  }

  console.log(`[AutoBlog] Successfully published: /blog/${generatedPost.slug}`);
}

main().catch((err) => {
  console.error("[AutoBlog] Fatal error:", err);
  process.exit(1);
});
