import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { genericApiError, jsonResponse } from '../../utils/security';

export const GET: APIRoute = async () => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('popup_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return jsonResponse(data || { is_active: false });
  } catch (err: any) {
    console.error("Failed to query popup settings:", err);
    return genericApiError();
  }
};
