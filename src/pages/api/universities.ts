import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { genericApiError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 120;

export const GET: APIRoute = async ({ request }) => {
  const clientIP = getClientIP(request);
  if (await checkRateLimit(`universities:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  const url = new URL(request.url);
  const countryCode = url.searchParams.get("country")?.trim().toLowerCase();

  try {
    let query = supabase.from('universities').select('*');
    
    if (countryCode && countryCode !== "all") {
      query = query.eq('code', countryCode);
    }
    
    const { data: universities, error } = await query.order('name', { ascending: true });
      
    if (error) {
      throw error;
    }

    const list = (universities || []).map((u: any) => ({
      ...u,
      image_url: (u.image_url || u.photo || "").replace(/\.(png|jpg|jpeg)$/i, '.webp'),
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

    return jsonResponse(list, 200, {
        "Cache-Control": "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400"
    });
  } catch (err: any) {
    console.error("Failed to query universities:", err);
    return genericApiError();
  }
};
