import type { APIRoute } from 'astro';
import { sendMail } from '../../utils/mailer';
import { getClientIP, checkRateLimit, jsonResponse } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 10; // Max 10 error reports per IP in 10 minutes

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = getClientIP(request);
    
    // Rate limit check to prevent spamming the error notification email
    const isLimited = await checkRateLimit(`client-error:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (isLimited) {
      return jsonResponse({ error: "Too many requests. Error report rate-limited." }, 429);
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: "Invalid JSON payload" }, 400);
    }

    const { type, message, stack, url, filename, lineno, colno, context, userAgent } = body;

    if (!message) {
      return jsonResponse({ error: "Missing error message" }, 400);
    }

    // Ignore list for third-party/browser extension/autofill errors
    const IGNORED_ERRORS = [
      'AutofillCallbackHandler',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'safari-web-extension://',
      '__gaOptOutExtension',
      'webkitAudioContext',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Script error.',
      'window.webkit.messageHandlers',
      'Extensions/',
      'fbq is not defined'
    ];

    const errorStr = `${message} ${stack || ''}`.toLowerCase();
    const shouldIgnore = IGNORED_ERRORS.some(pattern => errorStr.includes(pattern.toLowerCase()));

    if (shouldIgnore) {
      return jsonResponse({ success: true, message: "Ignored noisy/extension error (not reported)." });
    }

    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (IST)';
    const emailSubject = `⚠️ Client-Side Error: ${type || 'Unhandled Error'}`;

    const formattedContext = context 
      ? `<pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-family: monospace;">${JSON.stringify(context, null, 2)}</pre>`
      : 'N/A';

    const formattedStack = stack
      ? `<pre style="background: #fdf2f2; border: 1px solid #fde8e8; padding: 10px; border-radius: 5px; overflow-x: auto; color: #9b1c1c; font-family: monospace; font-size: 13px;">${stack}</pre>`
      : 'N/A';

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Client-Side Error Detected</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">An error occurred in a user's browser</p>
        </div>
        <div style="padding: 24px; color: #1f2937;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 120px; border-bottom: 1px solid #f3f4f6;">Type:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: 500;">${type || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">URL:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #3b82f6;"><a href="${url || '#'}" target="_blank" style="text-decoration: none; color: #3b82f6;">${url || 'Unknown'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Time:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #1f2937;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Client IP:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #1f2937;">${clientIP}</td>
            </tr>
            ${filename ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Location:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #1f2937; font-family: monospace;">${filename}:${lineno || 0}:${colno || 0}</td>
            </tr>` : ''}
          </table>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Error Message:</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 16px; border-radius: 8px; font-weight: 600; color: #111827; font-size: 15px; font-family: system-ui;">
              ${message}
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Contextual Data:</p>
            ${formattedContext}
          </div>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #4b5563; font-size: 14px;">Stack Trace:</p>
            ${formattedStack}
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
            <strong>User Agent:</strong> ${userAgent || 'N/A'}
          </div>
        </div>
      </div>
    `;

    await sendMail({
      to: 'tescavisaconsultancy87@gmail.com',
      subject: emailSubject,
      html: htmlContent
    });

    return jsonResponse({ success: true, message: "Client error reported and emailed successfully." });
  } catch (err: any) {
    console.error("[report-client-error] Failed to send client error report:", err);
    return jsonResponse({ error: "Failed to send report" }, 500);
  }
};
