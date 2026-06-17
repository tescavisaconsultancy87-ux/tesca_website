import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";
import { checkAdminAuth } from "../../utils/adminAuth";

export const GET: APIRoute = async ({ cookies }) => {
  const isAuthenticated = await checkAdminAuth(cookies);
  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const db = env?.tesca_db || env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not available" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Run self-healing ALTER TABLE if needed, just to be robust
    try {
      await db.prepare("ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'pending'").run();
    } catch (e) {
      // Column already exists, ignore
    }

    const res = await db.prepare("SELECT COUNT(*) as count FROM leads").first();
    return new Response(JSON.stringify({ count: res?.count || 0 }), {
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
