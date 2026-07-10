import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, reportServerError } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

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

export const GET: APIRoute = async ({ request, locals }) => {
  const clientIP = getClientIP(request);
  if (await checkRateLimit(`slots:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response(JSON.stringify({ error: "Missing or invalid date parameter (must be YYYY-MM-DD)." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;
    if (!googleSheetUrl) {
      // Default to all slots being available if not configured
      const defaultSlots = [
        "10:00 AM",
        "11:30 AM",
        "02:00 PM",
        "03:30 PM",
        "05:00 PM",
        "06:30 PM"
      ];
      return jsonResponse({
        success: true,
        availableSlots: defaultSlots.filter(s => !isSlotInPastIST(date, s))
      }, 200, {
        "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
      });
    }

    const queryUrl = `${googleSheetUrl}?action=checkAvailability&date=${encodeURIComponent(date)}`;
    const response = await fetch(queryUrl);
    
    if (!response.ok) {
      throw new Error(`Google Apps Script returned status ${response.status}`);
    }

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("[slots-fetch] Expected JSON from Google Apps Script, but got HTML/Text. Response preview:\n", responseText.slice(0, 500));
      throw new Error("Google Apps Script returned an HTML page instead of JSON. Ensure the script is deployed with 'Who has access' set to 'Anyone' and that calendar permissions are authorized.");
    }

    if (!data || data.success !== true) {
      console.warn("[slots-fetch] Apps Script response details:", data);
      throw new Error(data?.error || "Google Apps Script has not been updated with the new calendar code yet. Please review the setup instructions.");
    }

    const rawSlots: string[] = data.availableSlots || [];
    return jsonResponse({
      success: true,
      availableSlots: rawSlots.filter(s => !isSlotInPastIST(date, s))
    }, 200, {
      "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
    });

  } catch (err: any) {
    return await reportServerError("slots-fetch", err, { date }, request, locals);
  }
};
