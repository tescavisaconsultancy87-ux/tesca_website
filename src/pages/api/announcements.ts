import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "../../utils/supabase";

export const prerender = false;

// Public announcement strings, fetched client-side so the layout (and therefore
// every page) can be statically prerendered and edge-cached. Cached for 15 min
// at the edge to absorb traffic spikes without hammering the database.
export const GET: APIRoute = async () => {
  try {
    const supabase = getSupabaseAdmin();
const { data, error } = await supabase
      .from("announcements")
      .select("text")
      .order("id", { ascending: false });

    if (error) throw error;
    const texts = (data ?? []).map((r: any) => r.text).filter(Boolean);

    return new Response(JSON.stringify(texts), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
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
