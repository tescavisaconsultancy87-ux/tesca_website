import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { fullName, email, mobileNumber } = body;

    if (!fullName || !mobileNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields (fullName, mobileNumber)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const detailsStr = JSON.stringify(body);

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'inquiry',
        name: fullName,
        email: email || null,
        phone: mobileNumber,
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
    console.error("Inquiry API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

