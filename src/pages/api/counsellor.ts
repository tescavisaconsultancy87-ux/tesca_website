import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';
import { getEnv } from '../../utils/env';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';
import { sendMail } from '../../utils/mailer';
import { counsellorBookingEmail } from '../../utils/emailTemplates';
import { runInBackground } from '../../utils/background';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

const isSlotInPastIST = (dateStr: string, slotStr: string): boolean => {
  try {
    const now = new Date();
    const todayIST = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);

    if (dateStr < todayIST) return true;
    if (dateStr > todayIST) return false;

    // Same day, check time
    const timeParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(now).split(':');
    const currentHour = parseInt(timeParts[0], 10);
    const currentMinute = parseInt(timeParts[1], 10);

    const match = slotStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return false;
    let slotHour = parseInt(match[1], 10);
    const slotMinute = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && slotHour !== 12) {
      slotHour += 12;
    } else if (ampm === "AM" && slotHour === 12) {
      slotHour = 0;
    }

    if (slotHour < currentHour) return true;
    if (slotHour === currentHour && slotMinute <= currentMinute) return true;
    return false;
  } catch (err) {
    console.error("Error checking isSlotInPastIST:", err);
    return false;
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`counsellor:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    body = await request.json();

    // 0. Handle Google Calendar Slot Booking action
    if (body.action === 'book') {
      const { leadId, selectedDate, selectedTime } = body;
      if (!leadId || !selectedDate || !selectedTime) {
        return new Response(JSON.stringify({ error: "Missing required fields (leadId, selectedDate, selectedTime)." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (isSlotInPastIST(selectedDate, selectedTime)) {
        return new Response(JSON.stringify({ error: "The selected date or time slot is in the past and cannot be booked." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Fetch the existing lead from Supabase
      const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (fetchError || !lead) {
        return new Response(JSON.stringify({ error: "Lead not found or database query failed." }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      let details: any = {};
      try {
        details = typeof lead.details === 'string' ? JSON.parse(lead.details) : lead.details || {};
      } catch (e) {
        details = {};
      }

      const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;

      if (googleSheetUrl) {
        // Build URL parameters for the Apps Script Web App
        const params = new URLSearchParams({
          action: "bookSlot",
          date: selectedDate,
          time: selectedTime,
          "Full Name": lead.name || "Counselling Session",
          Email: lead.email || "Not provided",
          "Mobile Number": lead.phone || "Not provided",
          "Counselling Mode": details.mode || "Not specified",
          "Visa Type": details.visaType || "Not specified",
          "Preferred Countries": details.destination || "Not specified",
          Comments: `BOOKED SLOT: ${selectedDate} at ${selectedTime}. Preferred Mode: ${details.mode || "Not specified"}. Visa Type: ${details.visaType || "Not specified"}. Destination: ${details.destination || "Not specified"}.`,
          "Lead Source": "Main Enquiry Form"
        });

        const gasRes = await fetch(`${googleSheetUrl}?${params.toString()}`);
        if (!gasRes.ok) {
          throw new Error(`Google Apps Script booking returned status ${gasRes.status}`);
        }

        const gasText = await gasRes.text();
        let gasData: any;
        try {
          gasData = JSON.parse(gasText);
        } catch (parseErr) {
          console.error("[counsellor-booking] Expected JSON from Google Apps Script, but got HTML/Text. Response preview:\n", gasText.slice(0, 500));
          return new Response(JSON.stringify({ error: "Google Apps Script returned an invalid HTML page instead of JSON. Ensure the script is deployed as 'Anyone' and permissions are authorized." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        if (!gasData.success) {
          return new Response(JSON.stringify({ error: gasData.error || "Failed to book slot on calendar." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      // Update lead in Supabase with booked status and selected slot details
      const updatedDetails = {
        ...details,
        selectedDate,
        selectedTime
      };

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          status: 'booked',
          details: JSON.stringify(updatedDetails)
        })
        .eq('id', leadId);

      if (updateError) {
        throw updateError;
      }

      // Send confirmation email to user if email is provided
      if (lead.email) {
        const nameParts = (lead.name || '').trim().split(/\s+/);
        const firstName = nameParts[0] || 'Student';
        const lastName = nameParts.slice(1).join(' ') || '';

        const { subject, html } = counsellorBookingEmail({
          firstName,
          lastName,
          phone: lead.phone || '',
          email: lead.email,
          mode: details.mode,
          destination: details.destination,
          visaType: details.visaType,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        });
        runInBackground(locals, sendMail({ to: lead.email, subject, html }), "counsellor-booking-email");
      }

      return jsonResponse({
        success: true,
        message: "Slot booked successfully on Google Calendar and updated in database."
      });
    }

    const { firstName, lastName, email, phone, mode, destination, visaType } = body;

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
    const cleanVisaType = visaType ? sanitizeText(visaType, 50) : "";

    const fullName = `${cleanFirstName} ${cleanLastName}`;
    const detailsStr = JSON.stringify({ mode: cleanMode, destination: cleanDestination, visaType: cleanVisaType });

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

    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;
    const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || import.meta.env.WEB3FORMS_ACCESS_KEY;

    if (web3formsAccessKey) {
      runInBackground(locals, fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: fullName,
          email: cleanEmail || "inquiry@tesca.com",
          phone: cleanPhone,
          subject: `New Student Enquiry - ${fullName}`,
          counselling_mode: cleanMode,
          visa_type: cleanVisaType,
          destination: cleanDestination || "Not specified",
          message: `New enquiry from ${fullName}. Phone: ${cleanPhone}. Preferred Mode: ${cleanMode}. Visa Type: ${cleanVisaType}. Destination: ${cleanDestination || "Not specified"}.`,
          source: "Main Enquiry Form",
        })
      }), "web3forms-counsellor");
    }

    if (googleSheetUrl) {
      const params = new URLSearchParams({
        "Full Name": fullName,
        "Email": cleanEmail || "Not provided",
        "Mobile Number": cleanPhone,
        "Counselling Mode": cleanMode,
        "Visa Type": cleanVisaType,
        "Preferred Countries": cleanDestination || "Not specified",
        "Comments": `Preferred Mode: ${cleanMode}. Visa Type: ${cleanVisaType}. Destination: ${cleanDestination || "Not specified"}.`,
        "Lead Source": "Main Enquiry Form",
      });
      runInBackground(locals, fetch(`${googleSheetUrl}?${params.toString()}`, { method: "GET" }), "google-sheets-counsellor");
    }

    return jsonResponse({
      success: true,
      leadId: insertedData?.id || null
    });

  } catch (err: any) {
    return await reportServerError("counsellor", err, body, request, locals);
  }
};
