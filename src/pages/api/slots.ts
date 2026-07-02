import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { jsonResponse, reportServerError } from '../../utils/security';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response(JSON.stringify({ error: "Missing or invalid date parameter (must be YYYY-MM-DD)." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || getEnv('PUBLIC_GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL || (import.meta.env as any).PUBLIC_GOOGLE_SHEET_URL;
    if (!googleSheetUrl) {
      // Default to all slots being available if not configured
      return jsonResponse({
        success: true,
        availableSlots: [
          "10:00 AM",
          "11:30 AM",
          "02:00 PM",
          "03:30 PM",
          "05:00 PM",
          "06:30 PM"
        ]
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

    return jsonResponse({
      success: true,
      availableSlots: data.availableSlots || []
    });

  } catch (err: any) {
    return await reportServerError("slots-fetch", err, { date }, request);
  }
};
