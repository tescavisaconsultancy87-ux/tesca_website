import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { getEnv } from '../../utils/env';
import { sendMail } from '../../utils/mailer';
import { contactConfirmationEmail, contactAdminNotificationEmail } from '../../utils/emailTemplates';
import { runInBackground } from '../../utils/background';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`contact:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    const supabase = getSupabaseAdmin();
    body = await request.json();
    const { name, email, phone, subject, category, message } = body;

    if (!name || !message) {
      return jsonResponse({ error: "Missing required fields (name, message)." }, 400);
    }

    if (!validateName(name, 200)) {
      return jsonResponse({ error: "Invalid name format or length (max 200 characters)." }, 400);
    }

    if (email && !validateEmail(email)) {
      return jsonResponse({ error: "Invalid email address format." }, 400);
    }

    if (phone && !validatePhone(phone)) {
      return jsonResponse({ error: "Invalid phone number format." }, 400);
    }

    const cleanName = sanitizeText(name, 200);
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanPhone = phone ? sanitizeText(phone, 20) : null;
    const cleanSubject = subject ? sanitizeText(subject, 200) : '';
    const cleanCategory = ['bug', 'error', 'general'].includes(category) ? category : 'general';
    const cleanMessage = sanitizeText(message, 2000);

    const detailsStr = JSON.stringify({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      category: cleanCategory,
      message: cleanMessage,
    });

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'contact',
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        details: detailsStr,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;

    // Send confirmation to user
    if (cleanEmail) {
      const { subject: emailSubject, html } = contactConfirmationEmail({
        name: cleanName,
        subject: cleanSubject || 'message',
        category: cleanCategory,
      });
      runInBackground(locals, () => sendMail({ to: cleanEmail, subject: emailSubject, html }), "contact-confirmation-email");
    }

    // Send notification to admin
    const adminEmail = getEnv('OWNER_EMAIL') || getEnv('GMAIL_USER') || "tescavisaconsultancy87@gmail.com";
    const { subject: adminSubject, html: adminHtml } = contactAdminNotificationEmail({
      name: cleanName,
      email: cleanEmail || undefined,
      phone: cleanPhone || undefined,
      subject: cleanSubject,
      category: cleanCategory,
      message: cleanMessage,
    });
    runInBackground(locals, () => sendMail({ to: adminEmail, subject: adminSubject, html: adminHtml }), "contact-admin-email");

    return jsonResponse({ success: true, id: insertedData?.id || null });

  } catch (err: any) {
    return await reportServerError("contact", err, body, request, locals);
  }
};
