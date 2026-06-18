import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return new Response("Asset key is required.", { status: 400 });
    }

    const bucket = env?.R2_BUCKET;
    if (!bucket) {
      return new Response("Storage binding not available.", { status: 500 });
    }

    const object = await bucket.get(key);
    if (!object) {
      return new Response("Asset not found.", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { 
      status: 200, 
      headers 
    });

  } catch (err: any) {
    console.error("Asset serving error:", err);
    return new Response(err.message || "Internal server error serving asset", { status: 500 });
  }
};
