import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { checkAdminAuth } from "../../utils/adminAuth";

export const GET: APIRoute = async ({ cookies }) => {
  const isAuthenticated = await checkAdminAuth(cookies);
  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ count: count || 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Failed to query leads count:", err);
    return new Response(JSON.stringify({ error: err.message || "Database query failed" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

