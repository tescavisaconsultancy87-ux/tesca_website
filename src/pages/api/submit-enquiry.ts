import type { APIRoute } from 'astro';

export const prerender = false; // Render on demand (SSR)

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { firstName, lastName, email, phone, mode, destination, message, source } = await request.json();

    // 1. Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !mode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (First Name, Last Name, Email, Phone, Preferred Mode)." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Access runtime environment variables (for Cloudflare Workers runtime)
    const runtimeEnv = (locals as any)?.runtime?.env || {};
    const accessKey = runtimeEnv.WEB3FORMS_ACCESS_KEY || import.meta.env.WEB3FORMS_ACCESS_KEY || "85242216-06e7-475c-ad35-beb2808b60d7";

    if (!accessKey) {
      console.error("[Enquiry API] Web3Forms access key is missing.");
      return new Response(
        JSON.stringify({ error: "Email service is temporarily misconfigured. Please check environment variables." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Enquiry API] Submitting enquiry to Web3Forms for student: ${firstName} ${lastName}`);

    // 2. Submit to Web3Forms API
    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        subject: `New Student Enquiry - ${firstName} ${lastName} 🚀`,
        counselling_mode: mode,
        destination: destination || "Not specified",
        message: message || `New student enquiry from ${firstName} ${lastName}.`,
        source: source || "Main Enquiry Form"
      })
    });

    const data = await web3formsResponse.json();

    if (!web3formsResponse.ok || !data.success) {
      console.error("[Enquiry API] Web3Forms API returned error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Failed to submit enquiry via Web3Forms." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("[Enquiry API] Web3Forms submission completed successfully:", data);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Enquiry submitted successfully.",
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("[Enquiry API] General endpoint crash:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};