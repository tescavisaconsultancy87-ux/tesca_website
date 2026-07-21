import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { getEnv } from '../../utils/env';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';
import { runInBackground } from '../../utils/background';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5; // Allow max 5 submissions per 10 mins per IP

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`popup-lead:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    const supabase = getSupabaseAdmin();
    body = await request.json();

    const { name, phone, email, popupId, popupTitle } = body;

    // Fetch required fields settings for this popup
    let requiredFields = ["name", "phone"];
    if (popupId) {
      const { data: popup } = await supabase
        .from('popup_settings')
        .select('required_fields')
        .eq('id', popupId)
        .single();
      
      if (popup && Array.isArray(popup.required_fields)) {
        requiredFields = popup.required_fields;
      }
    }

    // 1. Basic dynamic validation
    if (requiredFields.includes("name") && !name) {
      return new Response(JSON.stringify({ error: "Full Name is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (requiredFields.includes("phone") && !phone) {
      return new Response(JSON.stringify({ error: "Mobile Number is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (requiredFields.includes("email") && !email) {
      return new Response(JSON.stringify({ error: "Email Address is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Format validation if values are provided
    if (name && !validateName(name)) {
      return new Response(JSON.stringify({ error: "Invalid name format or length." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (phone && !validatePhone(phone)) {
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

    // 2. Sanitization
    const cleanName = name ? sanitizeText(name, 100) : null;
    const cleanPhone = phone ? sanitizeText(phone, 20) : null;
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanPopupTitle = popupTitle ? sanitizeText(popupTitle, 150) : "Direct Popup Lead";
    const cleanPopupId = popupId ? parseInt(popupId, 10) : null;

    // 3. Deduplication (check for active popup lead with same email or phone)
    let hasExisting = false;
    if (cleanPhone || cleanEmail) {
      const phoneDigits = cleanPhone ? cleanPhone.replace(/\D/g, '') : '';
      const last10Digits = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : phoneDigits;

      const checkQuery = supabase
        .from('leads')
        .select('id, status, created_at')
        .eq('lead_type', 'popup')
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (cleanEmail && last10Digits) {
        checkQuery.or(`phone.eq."${cleanPhone}",email.eq."${cleanEmail}",phone.ilike."%${last10Digits}"`);
      } else if (cleanEmail) {
        checkQuery.or(`email.eq."${cleanEmail}"`);
      } else if (last10Digits) {
        checkQuery.or(`phone.eq."${cleanPhone}",phone.ilike."%${last10Digits}"`);
      } else if (cleanPhone) {
        checkQuery.eq('phone', cleanPhone);
      }

      const { data: existingLeads, error: checkError } = await checkQuery;
      if (checkError) {
        console.error("[popup-lead] Error checking for existing leads:", checkError);
      } else if (existingLeads && existingLeads.length > 0) {
        const latest = existingLeads[0];
        const createdAtMs = new Date(latest.created_at || Date.now()).getTime();
        const isRecent = (Date.now() - createdAtMs) < 60000;

        if (isRecent) {
          return new Response(JSON.stringify({ 
            success: true,
            leadId: latest.id,
            message: "Your inquiry has already been received!"
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({ 
          error: "Our team already has an active request for this contact. We will reach out to you shortly!" 
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 4. Save to Supabase leads table
    const detailsStr = JSON.stringify({
      source_popup_id: cleanPopupId,
      source_popup_title: cleanPopupTitle,
      captured_at: new Date().toISOString()
    });

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'popup',
        name: cleanName,
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

    // 5. Integrations: Web3Forms & Google Sheets
    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;
    const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || import.meta.env.WEB3FORMS_ACCESS_KEY;

    if (web3formsAccessKey) {
      runInBackground(locals, () => fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: cleanName,
          email: cleanEmail || "inquiry@tesca.com",
          phone: cleanPhone,
          subject: `Popup Lead: ${cleanPopupTitle} - ${cleanName}`,
          message: `Lead captured directly from popup: "${cleanPopupTitle}". Phone: ${cleanPhone}. Email: ${cleanEmail || 'Not provided'}.`,
          source: `Popup: ${cleanPopupTitle}`,
        })
      }), "web3forms-popup-lead");
    }

    if (googleSheetUrl) {
      const params = new URLSearchParams({
        "Full Name": cleanName || "",
        "Email": cleanEmail || "Not provided",
        "Mobile Number": cleanPhone || "",
        "Comments": `Captured directly from popup: "${cleanPopupTitle}"`,
        "Lead Source": `Popup: ${cleanPopupTitle}`,
      });
      runInBackground(locals, () => fetch(`${googleSheetUrl}?${params.toString()}`, { method: "GET" }), "google-sheets-popup-lead");
    }

    return jsonResponse({
      success: true,
      leadId: insertedData?.id || null
    });

  } catch (err: any) {
    return await reportServerError("popup-lead", err, body, request, locals);
  }
};
