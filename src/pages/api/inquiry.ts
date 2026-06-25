import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { reportServerError, getClientIP, isRateLimited, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';
import { getEnv } from '../../utils/env';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

export const POST: APIRoute = async ({ request }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (isRateLimited(`inquiry:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    body = await request.json();
    const { fullName, email, mobileNumber, message, subject } = body;

    // 1. Basic check for presence
    if (!fullName || !mobileNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields (fullName, mobileNumber)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Strict format & length validation
    if (!validateName(fullName, 200)) {
      return new Response(JSON.stringify({ error: "Invalid name format or length (max 200 characters)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!validatePhone(mobileNumber)) {
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
    const cleanFullName = sanitizeText(fullName, 200);
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanMobile = sanitizeText(mobileNumber, 20);
    const cleanLeadId = body.leadId ? sanitizeText(body.leadId, 80) : undefined;
    const cleanPreferredCountries = Array.isArray(body.preferredCountries)
      ? body.preferredCountries.map((country: unknown) => sanitizeText(String(country), 50)).filter(Boolean).slice(0, 12)
      : [];
    
    // Safely whitelist details fields to prevent arbitrary JSON manipulation
    const cleanDetails = {
      leadId: cleanLeadId,
      fullName: cleanFullName,
      email: cleanEmail,
      mobileNumber: cleanMobile,
      message: message ? sanitizeText(message, 1000) : undefined,
      subject: subject ? sanitizeText(subject, 200) : undefined,
      city: body.city ? sanitizeText(body.city, 100) : undefined,
      country: body.country ? sanitizeText(body.country, 100) : undefined,
      leadSource: body.leadSource ? sanitizeText(body.leadSource, 160) : undefined,
      inquiryType: Array.isArray(body.inquiryType) ? body.inquiryType.map((item: unknown) => sanitizeText(String(item), 80)).filter(Boolean).slice(0, 12) : undefined,
      preferredCountries: cleanPreferredCountries,
      education: body.highest ? sanitizeText(body.highest, 100) : undefined,
      languageTest: body.languageTestType ? sanitizeText(body.languageTestType, 80) : undefined,
      visaRefusal: body.visaRefusal ? sanitizeText(body.visaRefusal, 20) : undefined,
      comments: body.comments ? sanitizeText(body.comments, 1000) : undefined,
    };
    const detailsStr = JSON.stringify(cleanDetails);

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'inquiry',
        name: cleanFullName,
        email: cleanEmail,
        phone: cleanMobile,
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

    const detailedMessage = [
      `Lead ID: ${cleanLeadId || insertedData?.id || "N/A"}`,
      `Full Name: ${cleanFullName}`,
      `Mobile/WhatsApp: ${cleanMobile}`,
      `Email: ${cleanEmail || "Not provided"}`,
      `City: ${cleanDetails.city || "Not provided"}`,
      `Country: ${cleanDetails.country || "Not provided"}`,
      `Lead Source: ${cleanDetails.leadSource || "Not provided"}`,
      `Inquiry Type: ${Array.isArray(cleanDetails.inquiryType) ? cleanDetails.inquiryType.join(", ") : "Not provided"}`,
      `Preferred Countries: ${cleanPreferredCountries.join(", ") || "None"}`,
      `Comments: ${cleanDetails.comments || "None"}`,
    ].join("\n");

    if (web3formsAccessKey) {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: cleanFullName,
          email: cleanEmail || "inquiry@tesca.com",
          subject: `CRM Assessment Lead: ${cleanFullName}`,
          message: detailedMessage,
          source: "CRM Lead Capture Form",
        })
      }).catch(err => console.error("Web3Forms inquiry post failed:", err));
    }

    if (googleSheetUrl) {
      const params = new URLSearchParams({
        Timestamp: new Date().toISOString(),
        "Lead ID": cleanLeadId || String(insertedData?.id || ""),
        "Full Name": cleanFullName,
        "Mobile Number": cleanMobile,
        Email: cleanEmail || "Not provided",
        City: cleanDetails.city || "Not provided",
        Country: cleanDetails.country || "Not provided",
        "Lead Source": cleanDetails.leadSource || "CRM Lead Capture Form",
        "Inquiry Type": Array.isArray(cleanDetails.inquiryType) ? cleanDetails.inquiryType.join(", ") : "Not provided",
        "Preferred Countries": cleanPreferredCountries.join(", ") || "None",
        Comments: cleanDetails.comments || "None",
      });
      fetch(`${googleSheetUrl}?${params.toString()}`, { method: "GET" })
        .catch(err => console.error("Google Sheets inquiry GET failed:", err));
    }

    return jsonResponse({
      success: true,
      leadId: insertedData?.id || null
    });

  } catch (err: any) {
    return await reportServerError("inquiry", err, body, request);
  }
};
