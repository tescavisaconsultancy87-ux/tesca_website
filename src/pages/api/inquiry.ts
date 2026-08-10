import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';
import { getEnv } from '../../utils/env';
import { sendMail } from '../../utils/mailer';
import { inquiryConfirmationEmail, inquiryAdminNotificationEmail } from '../../utils/emailTemplates';
import { runInBackground } from '../../utils/background';
import { forwardInquiryToCRM } from '../../utils/crmWebhook';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 30; // Increased to prevent false-positive blocks on shared Indian mobile networks (Jio/Airtel CGNAT IPs)

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`inquiry:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    const supabase = getSupabaseAdmin();
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

    // Prevent only accidental double-submits within 60 seconds
    const phoneDigits = cleanMobile.replace(/\D/g, '');
    const last10Digits = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : phoneDigits;

    const { data: recentLeads, error: checkError } = await supabase
      .from('leads')
      .select('id, status, phone, email, created_at')
      .neq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error("[inquiry] Error checking for existing active leads:", checkError);
    } else if (recentLeads && recentLeads.length > 0) {
      const latest = recentLeads[0];
      const matchPhone = latest.phone && cleanMobile && latest.phone.replace(/\D/g, '').slice(-10) === last10Digits;
      const matchEmail = cleanEmail && latest.email && latest.email.toLowerCase() === cleanEmail.toLowerCase();
      const isWithinWindow = (Date.now() - new Date(latest.created_at || Date.now()).getTime()) < 60000;

      if ((matchPhone || matchEmail) && isWithinWindow) {
        return new Response(JSON.stringify({ 
          success: true,
          leadId: latest.id,
          message: "Your previous inquiry was received. We'll contact you shortly."
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

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

    // 1. PRIMARY SAFE WRITE TO WEBSITE DATABASE (leads table)
    let insertedData: any = null;
    try {
      const res = await supabase
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
      if (!res.error) {
        insertedData = res.data;
      }
    } catch (dbErr) {
      console.warn('[Website DB Insert Notice]:', dbErr);
    }

    // 2. NON-BLOCKING FORWARD TO CRM PORTAL DATABASE (never blocks or drops lead submission)
    runInBackground(locals, async () => {
      try {
        await forwardInquiryToCRM({
          full_name: cleanFullName,
          email: cleanEmail || '',
          mobile: cleanMobile,
          dob: body.dob || body.date_of_birth || '',
          city: cleanDetails.city || 'Online',
          country_preference: cleanPreferredCountries.join(", ") || "Canada",
          preferred_countries: cleanPreferredCountries,
          lead_source: cleanDetails.leadSource || "Website /inquiry Form",
          reference_name: body.referenceName || body.reference_name || body.refName || '',
          reference_mobile: body.referenceMobile || body.reference_mobile || body.refMobile || '',
          inquiry_types: cleanDetails.inquiryType || [],
          visa_type: Array.isArray(cleanDetails.inquiryType) && cleanDetails.inquiryType.length > 0 ? cleanDetails.inquiryType[0] : 'Student Visa',
          marital_status: body.maritalStatus || body.marital_status || 'Single',
          passport_available: body.passportAvailable || body.passport_available || 'No',
          ssc_completed: body.sscCompleted || body.ssc_completed || body.completedTenth || 'Yes',
          hsc_completed: body.hscCompleted || body.hsc_completed || body.completedTwelfth || 'Yes',
          highest_qualification: body.highest || cleanDetails.education || "Bachelor's",
          study_level: body.highest || cleanDetails.education || "Bachelor's",
          passing_year: body.collegeYear || body.passingYear || body.passing_year || '',
          gpa_percentage: body.collegeGpa || body.gpaPercentage || body.gpa_percentage || '',
          college_university: body.collegeUni || body.universityName || body.college_university || '',
          college_course: body.collegeCourse || body.courseName || body.college_course || '',
          language_test_type: body.languageTestType || cleanDetails.languageTest || 'None',
          exam_score: body.languageTestScore || body.examScore || body.exam_score || '',
          visa_refusal: body.visaRefusal || cleanDetails.visaRefusal || 'No',
          refusal_country: body.refusalCountry || body.refusalCountryName || body.refusal_country || '',
          refusal_date: body.refusalDate || body.refusal_date || '',
          refusal_reason: body.refusalReason || body.refusal_reason || '',
          preferred_contact_method: body.contactMethod || body.preferredContactMethod || body.preferred_contact_method || 'WhatsApp',
          best_time_to_contact: body.contactTime || body.bestTimeToContact || body.best_time_to_contact || 'Morning',
          source: cleanDetails.leadSource || "Website /inquiry Form",
          notes: cleanDetails.comments || cleanDetails.message || "Submitted via website /inquiry page"
        });
      } catch (crmErr) {
        console.error("[inquiry] Background CRM forward exception:", crmErr);
      }
    }, "crm-inquiry-forward");

    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;

    if (googleSheetUrl) {
      const params = new URLSearchParams({
        Timestamp: new Date().toISOString(),
        "Lead ID": cleanLeadId || String(insertedData?.id || ""),
        "Full Name": cleanFullName,
        "Mobile Number": cleanMobile,
        "Email": cleanEmail || "Not provided",
        "City": cleanDetails.city || "Not provided",
        "Country": cleanDetails.country || "Not provided",
        "Lead Source": cleanDetails.leadSource || "CRM Lead Capture Form",
        "Inquiry Type": Array.isArray(cleanDetails.inquiryType) ? cleanDetails.inquiryType.join(", ") : "Not provided",
        "Preferred Countries": cleanPreferredCountries.join(", ") || "None",
        "Comments": cleanDetails.comments || "None",
      });
      runInBackground(locals, () => fetch(`${googleSheetUrl}?${params.toString()}`, { method: "GET" }), "google-sheets-inquiry");
    }

    // Send confirmation email to user if email provided
    if (cleanEmail) {
      const { subject, html } = inquiryConfirmationEmail({
        name: cleanFullName,
        leadId: cleanLeadId,
        inquiryTypes: Array.isArray(cleanDetails.inquiryType) ? cleanDetails.inquiryType : [],
        preferredCountries: cleanPreferredCountries,
        phone: cleanMobile,
      });
      runInBackground(locals, () => sendMail({ to: cleanEmail, subject, html }), "inquiry-confirmation-email");
    }

    // Send admin notification email
    const adminEmail = getEnv('OWNER_EMAIL') || getEnv('GMAIL_USER') || "tescavisaconsultancy87@gmail.com";
    const { subject: adminSubj, html: adminHtml } = inquiryAdminNotificationEmail({
      name: cleanFullName,
      email: cleanEmail || undefined,
      phone: cleanMobile,
      inquiryTypes: Array.isArray(cleanDetails.inquiryType) ? cleanDetails.inquiryType : [],
      preferredCountries: cleanPreferredCountries,
      leadId: insertedData?.id || cleanLeadId,
    });
    runInBackground(locals, () => sendMail({ to: adminEmail, subject: adminSubj, html: adminHtml }), "inquiry-admin-email");

    return jsonResponse({
      success: true,
      leadId: insertedData?.id || cleanLeadId || null
    });

  } catch (err: any) {
    return await reportServerError("inquiry", err, body, request, locals);
  }
};
