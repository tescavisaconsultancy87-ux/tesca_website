import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { sanitizeReviewInput } from '../../utils/validation';
import { getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 12;

const FALLBACK_TEMPLATES = [
  "Had an amazing experience with TESCA Visa Consultancy for my {visaPhrase}. The team is professional, supportive, and guided me through the entire process {countryPhrase}.",
  "Highly recommend TESCA for {visaPhrase} guidance. They provided clear assistance with all my documentation {countryPhrase}, and their communication was always prompt.",
  "Great service and professional approach. TESCA helped me secure my {visaPhrase} {countryPhrase} on time. The counselor was very supportive throughout.",
  "TESCA Visa Consultancy is highly reliable. Their expert team made my {visaPhrase} {countryPhrase} stress-free with their professional guidance and constant support.",
  "Very smooth and clear process. The team at TESCA was highly supportive, and their professional guidance helped me secure my {visaPhrase} {countryPhrase} without issues."
];

function getFallbackReview(country: string, visaType: string): string {
  const countryPhrase = country ? `for ${country}` : "abroad";
  const visaPhrase = visaType ? `${visaType} application` : "visa application";

  const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
  return template
    .replace("{visaPhrase}", visaPhrase)
    .replace("{countryPhrase}", countryPhrase);
}

export const POST: APIRoute = async ({ request }) => {
  const oversized = rejectOversizedJson(request, 8 * 1024);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`generate-review:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let country = "";
  let visaType = "";
  try {
    const body = await request.json().catch(() => ({}));
    country = sanitizeReviewInput(body.country, 50);
    visaType = sanitizeReviewInput(body.visaType, 50);

    const apiKey = getEnv("GROQ_API_KEY") || import.meta.env.GROQ_API_KEY;

    if (!apiKey) {
      return jsonResponse({ review: getFallbackReview(country, visaType) });
    }

    // Prepare custom prompt details
    let details = "";
    if (country) details += `- Target Country: ${country}\n`;
    if (body.countryCode) details += `- Country Code: ${body.countryCode}\n`;
    if (visaType) details += `- Visa Type: ${visaType}\n`;

    const systemPrompt = `You are a Google Review writer. Write a natural, genuine Google review for "TESCA Visa Consultancy".

Strict Requirements:
- Length: exactly around 30 words (25 to 35 words).
- Sound human and authentic, not robotic or overly formal. Avoid cliché marketing speak or repetitive buzzwords.
- Mention professionalism, guidance, communication, or support naturally.
- Do not exaggerate, keep it positive but realistic.
- Do not mention AI, bots, or generators.
- Vary the sentence structures.
- Output ONLY the raw review text. Do not include quotes, intro, outro, title, or any helper text. Only output the review itself in English.`;

    const userPrompt = `Generate a review based on these details (if empty, generate a realistic general review):
${details || "Write a general positive and authentic student visa consultancy review."}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.85,
        max_tokens: 150
      })
    });

    if (!res.ok) {
      throw new Error(`Groq API error`);
    }

    const data = await res.json();
    const reviewText = data.choices?.[0]?.message?.content?.trim() || "";

    return jsonResponse({ review: reviewText });

  } catch (err: any) {
    console.warn("Failed to generate review with API, using static backup:", err);
    return jsonResponse({ review: getFallbackReview(country, visaType) });
  }
};
