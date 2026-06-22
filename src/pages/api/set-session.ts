import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { access_token, refresh_token, expires_in } = await request.json();
    if (!access_token || !refresh_token) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing tokens" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    cookies.set("sb-access-token", access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: expires_in || 3600,
    });

    cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: expires_in || 3600,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Set session error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
