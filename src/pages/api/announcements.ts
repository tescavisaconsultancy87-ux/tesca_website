import type { APIRoute } from "astro";
import { supabase } from "../../utils/supabase";

export const prerender = false;

// Public announcement strings, fetched client-side so the layout (and therefore
// every page) can be statically prerendered and edge-cached. Cached 60s at the
// edge so admin updates appear quickly without hammering the database.
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("text")
      .order("id", { ascending: true });

    if (error) throw error;
    const texts = (data ?? []).map((r: any) => r.text).filter(Boolean);

    return new Response(JSON.stringify(texts), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Failed to fetch announcements:", err);
    return new Response("[]", {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
};
