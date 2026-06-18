import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, mode, destination } = body;

    if (!firstName || !lastName || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields (firstName, lastName, phone)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const fullName = `${firstName} ${lastName}`;
    const detailsStr = JSON.stringify({ mode, destination });

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'counsellor',
        name: fullName,
        email: email || null,
        phone,
        details: detailsStr,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      leadId: insertedData?.id || null
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Counsellor API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

