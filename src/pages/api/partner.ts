import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { getEnv } from '../../utils/env';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';
import { sendMail } from '../../utils/mailer';
import { partnerConfirmationEmail, partnerNotificationEmail } from '../../utils/emailTemplates';
import { runInBackground } from '../../utils/background';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`partner:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    const supabase = getSupabaseAdmin();
body = await request.json();
    const { fullName, email, phone, experience, partnershipModel, city, comments } = body;

    // 1. Presence check
    if (!fullName || !email || !phone || !experience || !partnershipModel || !city) {
      return new Response(JSON.stringify({ error: "Missing required fields (fullName, email, phone, experience, partnershipModel, city)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Format validation
    if (!validateName(fullName)) {
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

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Sanitization
    const cleanFullName = sanitizeText(fullName, 100);
    const cleanEmail = sanitizeText(email, 254).toLowerCase();
    const cleanPhone = sanitizeText(phone, 20);
    const cleanExperience = sanitizeText(experience, 500);
    const cleanModel = sanitizeText(partnershipModel, 50);
    const cleanCity = sanitizeText(city, 100);
    const cleanComments = comments ? sanitizeText(comments, 1000) : "";

    const detailsStr = JSON.stringify({
      experience: cleanExperience,
      partnershipModel: cleanModel,
      city: cleanCity,
      comments: cleanComments
    });

    // 4. Save to Database
    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'partner',
        name: cleanFullName,
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

    const leadId = insertedData?.id || "N/A";
    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;
    const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || import.meta.env.WEB3FORMS_ACCESS_KEY;
    const adminEmail = getEnv('OWNER_EMAIL') || getEnv('GMAIL_USER') || "tescavisaconsultancy87@gmail.com";

    // 5. Send Web3Forms fallback submission
    if (web3formsAccessKey) {
      runInBackground(locals, () => fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: cleanFullName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: `🤝 New Partnership Inquiry - ${cleanFullName} (${cleanModel})`,
          message: `New partner application. Model: ${cleanModel}. Location: ${cleanCity}. Experience: ${cleanExperience}. Comments: ${cleanComments || 'None'}. Lead ID: ${leadId}`,
          source: "Partner With Us Form",
        })
      }), "web3forms-partner");
    }

    // 6. Log to Google Sheet
    if (googleSheetUrl) {
      const params = new URLSearchParams({
        "Full Name": cleanFullName,
        "Email": cleanEmail,
        "Mobile Number": cleanPhone,
        "Counselling Mode": "Partnership Application",
        "Visa Type": cleanModel,
        "Preferred Countries": cleanCity,
        "Comments": `Experience: ${cleanExperience}. Comments: ${cleanComments || 'None'}. Lead ID: ${leadId}`,
        "Lead Source": "Partner With Us Form",
      });
      runInBackground(locals, () => fetch(`${googleSheetUrl}?${params.toString()}`, { method: "GET" }), "google-sheets-partner");
    }

    // 7. Send confirmation email to User
    const userEmail = partnerConfirmationEmail({
      name: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      experience: cleanExperience,
      partnershipModel: cleanModel,
      city: cleanCity,
      comments: cleanComments
    });
    runInBackground(locals, () => sendMail({ to: cleanEmail, subject: userEmail.subject, html: userEmail.html }), "partner-confirmation-email");

    // 8. Send notification email to Admin (Tesca)
    const adminNotification = partnerNotificationEmail({
      name: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      experience: cleanExperience,
      partnershipModel: cleanModel,
      city: cleanCity,
      comments: cleanComments,
      leadId
    });
    runInBackground(locals, () => sendMail({ to: adminEmail, subject: adminNotification.subject, html: adminNotification.html }), "partner-admin-email");

    return jsonResponse({
      success: true,
      leadId
    });

  } catch (err: any) {
    return await reportServerError("partner-api", err, body, request, locals);
  }
};
