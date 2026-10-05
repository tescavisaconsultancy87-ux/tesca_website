import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { getEnv } from '../../utils/env';
import { sendMail } from '../../utils/mailer';
import { contactConfirmationEmail, contactAdminNotificationEmail } from '../../utils/emailTemplates';
import { runInBackground } from '../../utils/background';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 30;

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
    const {
      name,
      email,
      phone,
      subject,
      category,
      message,
      city,
      lead_type,
      document_title,
      document_slug,
      page_url,
      source,
      target_country,
      country,
      destination,
      visa_type,
      visaType,
      service
    } = body;

    const isWhatsAppLead = lead_type === 'whatsapp';
    const effectiveName = (name && name.trim()) || (isWhatsAppLead ? 'WhatsApp Visitor' : '');
    const effectiveMessage = (message && message.trim()) || (isWhatsAppLead ? `Direct WhatsApp chat initiated from ${page_url || source || 'Website'}` : '');

    if (!effectiveName || !effectiveMessage) {
      return jsonResponse({ error: "Missing required fields (name, message)." }, 400);
    }

    if (!validateName(effectiveName, 200)) {
      return jsonResponse({ error: "Invalid name format or length (max 200 characters)." }, 400);
    }

    if (email && !validateEmail(email)) {
      return jsonResponse({ error: "Invalid email address format." }, 400);
    }

    if (phone && phone !== 'WhatsApp Chat' && !validatePhone(phone)) {
      return jsonResponse({ error: "Invalid phone number format." }, 400);
    }

    const cleanName = sanitizeText(effectiveName, 200);
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanPhone = phone ? sanitizeText(phone, 30) : (isWhatsAppLead ? 'WhatsApp Chat' : null);
    const cleanSubject = subject ? sanitizeText(subject, 200) : (isWhatsAppLead ? 'WhatsApp Direct Inquiry' : '');
    const cleanCategory = ['bug', 'error', 'general'].includes(category) ? category : 'general';
    const cleanMessage = sanitizeText(effectiveMessage, 2000);
    const cleanCity = city ? sanitizeText(city, 100) : null;

    // Structured Country & Visa Type capture
    const effectiveCountry = target_country || country || destination || null;
    const effectiveVisaType = visa_type || visaType || service || null;
    const cleanCountry = effectiveCountry ? sanitizeText(effectiveCountry, 80) : null;
    const cleanVisaType = effectiveVisaType ? sanitizeText(effectiveVisaType, 80) : null;

    let cleanDocTitle = document_title ? sanitizeText(document_title, 200) : null;
    let cleanDocSlug = document_slug ? sanitizeText(document_slug, 120) : null;

    // Guard: Prevent full website SEO titles from being mistaken as a Document Guide
    if (cleanDocTitle && (
      cleanDocTitle.includes('TESCA Visa Consultancy Surat | Best Visa') ||
      cleanDocTitle.includes('TESCA Visa Consultancy') ||
      cleanDocTitle.toLowerCase().includes('best visa consultant & ielts')
    )) {
      cleanDocTitle = null;
      cleanDocSlug = null;
    }

    const cleanPageUrl = page_url ? sanitizeText(page_url, 300) : null;
    const cleanSource = source ? sanitizeText(source, 200) : null;

    const isDocLead = lead_type === 'document' || Boolean(cleanDocTitle) || (cleanSource && cleanSource.toLowerCase().includes('guide'));
    const finalLeadType = isWhatsAppLead ? 'whatsapp' : (isDocLead ? 'document' : 'contact');

    // Deduplication check: prevent duplicate rapid submits within 60 seconds
    const phoneDigits = (cleanPhone || '').replace(/\D/g, '');
    const last10Digits = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : phoneDigits;

    if (last10Digits || cleanEmail) {
      const { data: recentLeads, error: checkError } = await supabase
        .from('leads')
        .select('id, created_at, phone, email')
        .eq('lead_type', finalLeadType)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!checkError && recentLeads && recentLeads.length > 0) {
        const duplicate = recentLeads.find(l => {
          const lPhoneDigits = (l.phone || '').replace(/\D/g, '');
          const matchPhone = last10Digits && lPhoneDigits.slice(-10) === last10Digits;
          const matchEmail = cleanEmail && l.email && l.email.toLowerCase() === cleanEmail.toLowerCase();
          const diffMs = Date.now() - new Date(l.created_at || Date.now()).getTime();
          return (matchPhone || matchEmail) && diffMs < 60000;
        });

        if (duplicate) {
          return jsonResponse({
            success: true,
            id: duplicate.id,
            duplicate: true,
            message: "Lead previously received within 60 seconds."
          });
        }
      }
    }

    const detailsStr = JSON.stringify({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      city: cleanCity,
      target_country: cleanCountry,
      visa_type: cleanVisaType,
      lead_source: cleanSource || (isDocLead ? `Document: ${cleanDocTitle}` : (isWhatsAppLead ? 'WhatsApp Direct' : 'Contact Page')),
      document_title: cleanDocTitle,
      document_slug: cleanDocSlug,
      page_url: cleanPageUrl,
      subject: cleanSubject,
      category: cleanCategory,
      message: cleanMessage,
    });

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: finalLeadType,
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

    // Send notification to admin (skip for raw WhatsApp clicks to avoid email spam)
    if (!isWhatsAppLead) {
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
    }

    return jsonResponse({ success: true, id: insertedData?.id || null });

  } catch (err: any) {
    return await reportServerError("contact", err, body, request, locals);
  }
};
