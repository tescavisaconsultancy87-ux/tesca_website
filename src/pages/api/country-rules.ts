import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { DEFAULT_COUNTRY_RULES, type CountryRule } from '../../utils/countryRules';
import { jsonResponse, genericApiError } from '../../utils/security';
import { checkAdminAuth } from '../../utils/adminAuth';

export const GET: APIRoute = async () => {
  try {
    const supabase = getSupabaseAdmin();
    const { data: dbRules, error } = await supabase
      .from('country_settings')
      .select('*');

    const rulesMap = { ...DEFAULT_COUNTRY_RULES };

    if (!error && dbRules && dbRules.length > 0) {
      dbRules.forEach((row: any) => {
        const code = row.code?.toLowerCase();
        if (code) {
          rulesMap[code] = {
            code,
            country_name: row.country_name || rulesMap[code]?.country_name || code.toUpperCase(),
            allowed_tests: Array.isArray(row.allowed_tests)
              ? row.allowed_tests
              : (row.allowed_tests ? String(row.allowed_tests).split(',').map((s: string) => s.trim()) : (rulesMap[code]?.allowed_tests || ["IELTS", "PTE"])),
            moi_status: row.moi_status || rulesMap[code]?.moi_status || 'conditional',
            moi_policy_note: row.moi_policy_note || rulesMap[code]?.moi_policy_note || '',
            min_ug_ielts: parseFloat(row.min_ug_ielts) || rulesMap[code]?.min_ug_ielts || 6.0,
            min_pg_ielts: parseFloat(row.min_pg_ielts) || rulesMap[code]?.min_pg_ielts || 6.5,
            transparency_note: row.transparency_note || rulesMap[code]?.transparency_note || ''
          };
        }
      });
    }

    return jsonResponse({ success: true, rules: rulesMap }, 200, {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600"
    });
  } catch (err) {
    console.error("Failed to load country rules:", err);
    return jsonResponse({ success: true, rules: DEFAULT_COUNTRY_RULES });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const isAdmin = await checkAdminAuth(cookies);
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { code, country_name, allowed_tests, moi_status, moi_policy_note, transparency_note, min_ug_ielts, min_pg_ielts } = body;

    if (!code) {
      return new Response(JSON.stringify({ error: "Country code is required" }), { status: 400 });
    }

    const cleanCode = code.toLowerCase();
    const testsArr = Array.isArray(allowed_tests) ? allowed_tests : String(allowed_tests || "").split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      code: cleanCode,
      country_name: country_name || DEFAULT_COUNTRY_RULES[cleanCode]?.country_name || cleanCode.toUpperCase(),
      allowed_tests: JSON.stringify(testsArr),
      moi_status: moi_status || "conditional",
      moi_policy_note: moi_policy_note || "",
      transparency_note: transparency_note || "",
      min_ug_ielts: parseFloat(min_ug_ielts) || 6.0,
      min_pg_ielts: parseFloat(min_pg_ielts) || 6.5
    };

    const { error } = await supabase
      .from('country_settings')
      .upsert(payload, { onConflict: 'code' });

    if (error) {
      console.error("Failed to update country settings in Supabase:", error);
      throw error;
    }

    return jsonResponse({ success: true, message: `Country rules for ${cleanCode} updated successfully.` });
  } catch (err: any) {
    console.error("Country settings update error:", err);
    return genericApiError();
  }
};
