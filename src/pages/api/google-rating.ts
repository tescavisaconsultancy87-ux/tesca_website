import type { APIRoute } from "astro";

export const prerender = false; // Served dynamically at request-time

export const GET: APIRoute = async () => {
  // Baseline Google Business details for TESCA Surat across branches
  const rating = 4.9;
  const reviewCount = 900;

  return new Response(JSON.stringify({ rating, reviewCount }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    }
  });
};
