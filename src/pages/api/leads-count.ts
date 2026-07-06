import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { checkAdminAuth } from "../../utils/adminAuth";
import { genericApiError, jsonResponse } from '../../utils/security';

export const GET: APIRoute = async ({ cookies }) => {
  const isAuthenticated = await checkAdminAuth(cookies);
  if (!isAuthenticated) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .neq('lead_type', 'partner');

    if (error) {
      throw error;
    }

    return jsonResponse({ count: count || 0 });
  } catch (err: any) {
    console.error("Failed to query leads count:", err);
    return genericApiError();
  }
};
