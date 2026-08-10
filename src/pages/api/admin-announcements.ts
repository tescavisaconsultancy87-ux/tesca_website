import type { APIRoute } from "astro";
import { checkAdminAuth } from "../../utils/adminAuth";
import { getSupabaseAdmin } from "../../utils/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const isAuth = await checkAdminAuth(cookies);
  if (!isAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to fetch announcements" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const isAuth = await checkAdminAuth(cookies);
  if (!isAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const text = (body.text || "").toString().trim();

    if (!text) {
      return new Response(JSON.stringify({ error: "Announcement text cannot be empty." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("announcements")
      .insert({ text })
      .select("*")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, item: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to add announcement" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const isAuth = await checkAdminAuth(cookies);
  if (!isAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { id, ids } = body;

    const supabase = getSupabaseAdmin();

    if (Array.isArray(ids) && ids.length > 0) {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .in("id", ids);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, count: ids.length }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (id) {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "No ID or IDs provided for deletion" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to delete announcement" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
