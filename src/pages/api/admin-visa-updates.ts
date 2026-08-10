import type { APIRoute } from "astro";
import { checkAdminAuth } from "../../utils/adminAuth";
import { getSupabaseAdmin } from "../../utils/supabase";

export const prerender = false;

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
    const date = (body.date || "").toString().trim();
    const tag = (body.tag || "").toString().trim();
    const tagColor = (body.tag_color || "amber").toString().trim();
    const title = (body.title || "").toString().trim();
    const link = (body.link || "").toString().trim();

    if (!date || !tag || !title || !link) {
      return new Response(JSON.stringify({ error: "Please fill in all visa bulletin fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let tagBg = "bg-amber-100 text-amber-700 border-amber-200";
    if (tagColor === "emerald") { tagBg = "bg-emerald-100 text-emerald-700 border-emerald-200"; }
    if (tagColor === "purple") { tagBg = "bg-purple-100 text-purple-700 border-purple-200"; }
    if (tagColor === "cyan") { tagBg = "bg-cyan-100 text-cyan-700 border-cyan-200"; }
    if (tagColor === "rose") { tagBg = "bg-rose-100 text-rose-700 border-rose-200"; }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("visa_updates")
      .insert({
        date,
        tag,
        tag_bg: tagBg,
        title,
        link,
      })
      .select("*")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, item: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to add visa update" }), {
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
        .from("visa_updates")
        .delete()
        .in("id", ids);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, count: ids.length }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (id) {
      const { error } = await supabase
        .from("visa_updates")
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
    return new Response(JSON.stringify({ error: err.message || "Failed to delete visa update" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
