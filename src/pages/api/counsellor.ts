import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { getEnv } from '../../utils/env';
import { reportServerError, getClientIP, isRateLimited, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

export const POST: APIRoute = async ({ request }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (isRateLimited(`counsellor:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    body = await request.json();
    const { firstName, lastName, email, phone, mode, destination } = body;

    // 1. Basic check for presence
    if (!firstName || !lastName || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields (firstName, lastName, phone)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Strict format & length validation
    if (!validateName(firstName) || !validateName(lastName)) {
      return new Response(JSON.stringify({ error: "Invalid name format or length (max 100 characters)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!validatePhone(phone)) {
      return new Response(JSON.stringify({ error: "Invalid phone number format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (email && !validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Sanitization
    const cleanFirstName = sanitizeText(firstName, 100);
    const cleanLastName = sanitizeText(lastName, 100);
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanPhone = sanitizeText(phone, 20);
    const cleanMode = mode ? sanitizeText(mode, 50) : "";
    const cleanDestination = destination ? sanitizeText(destination, 50) : "";

    const fullName = `${cleanFirstName} ${cleanLastName}`;
    const detailsStr = JSON.stringify({ mode: cleanMode, destination: cleanDestination });

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'counsellor',
        name: fullName,
        email: cleanEmail,
        phone: cleanPhone,
        details: detailsStr,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || getEnv('PUBLIC_GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL || (import.meta.env as any).PUBLIC_GOOGLE_SHEET_URL;
    const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || import.meta.env.WEB3FORMS_ACCESS_KEY;

    if (web3formsAccessKey) {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: fullName,
          email: cleanEmail || "inquiry@tesca.com",
          phone: cleanPhone,
          subject: `New Student Enquiry - ${fullName}`,
          counselling_mode: cleanMode,
          destination: cleanDestination || "Not specified",
          message: `New enquiry from ${fullName}. Phone: ${cleanPhone}. Preferred Mode: ${cleanMode}. Destination: ${cleanDestination || "Not specified"}.`,
          source: "Main Enquiry Form",
        })
      }).catch(err => console.error("Web3Forms counsellor post failed:", err));
    }

    if (googleSheetUrl) {
      const params = new URLSearchParams({
        "Full Name": fullName,
        "Email": cleanEmail || "Not provided",
        "Mobile Number": cleanPhone,
        "Counselling Mode": cleanMode,
        "Preferred Countries": cleanDestination || "Not specified",
        "Comments": `Preferred Mode: ${cleanMode}. Destination: ${cleanDestination || "Not specified"}.`,
        "Lead Source": "Main Enquiry Form",
      });
      fetch(`${googleSheetUrl}?${params.toString()}`, { method: "GET" })
        .catch(err => console.error("Google Sheets counsellor GET failed:", err));
    }

    return jsonResponse({
      success: true,
      leadId: insertedData?.id || null
    });

  } catch (err: any) {
    return await reportServerError("counsellor", err, body, request);
  }
};
