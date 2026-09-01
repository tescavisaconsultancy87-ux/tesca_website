import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { genericApiError, jsonResponse } from '../../utils/security';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('popup_settings')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache"
      }
    });
  } catch (err: any) {
    console.error("Failed to query popup settings:", err);
    return genericApiError();
  }
};
