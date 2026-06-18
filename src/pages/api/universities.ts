import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const countryCode = url.searchParams.get("country")?.trim().toLowerCase();

  const db = env?.tesca_db || env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not available" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    let res;
    if (countryCode && countryCode !== "all") {
      res = await db
        .prepare("SELECT * FROM universities WHERE code = ? ORDER BY name ASC")
        .bind(countryCode)
        .all();
    } else {
      res = await db
        .prepare("SELECT * FROM universities ORDER BY name ASC")
        .all();
    }
      
    const list = (res.results || []).map((u: any) => ({
      ...u,
      image_url: u.image_url || u.photo || "",
      ug_tuition_fees: u.ug_tuition_fees || u.ug_fees || u.tuition_fees || "",
      ug_intakes: u.ug_intakes || u.ug_intake || u.intake || "",
      ug_ielts_pte: u.ug_ielts_pte || u.ug_ielts_pte_req || u.ielts_pte_req || "",
      ug_moi: u.ug_moi || u.ug_moi_accepted || u.moi_accepted || "",
      ug_courses: u.ug_courses || u.courses || "",
      pg_tuition_fees: u.pg_tuition_fees || u.pg_fees || "",
      pg_intakes: u.pg_intakes || u.pg_intake || "",
      pg_ielts_pte: u.pg_ielts_pte || u.pg_ielts_pte_req || "",
      pg_moi: u.pg_moi || u.pg_moi_accepted || "",
      pg_courses: u.pg_courses || ""
    }));
    return new Response(JSON.stringify(list), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch (err: any) {
    console.error("Failed to query universities:", err);
    return new Response(JSON.stringify({ error: err.message || "Database query failed" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
