/**
 * TESCA Gmail Mailer Utility
 * Uses Gmail App Password (not Gmail API OAuth) for reliability.
 * Set GMAIL_USER and GMAIL_APP_PASSWORD in .env / wrangler secrets.
 *
 * RUNTIME NOTE — Cloudflare Workers compatibility:
 * Nodemailer's SMTP transport requires node:net and node:tls for TCP
 * connections.  These are available on Cloudflare Workers when BOTH of
 * these conditions are met in wrangler.toml:
 *   1. compatibility_date >= "2024-09-23"
 *   2. compatibility_flags includes "nodejs_compat"
 * The combination activates nodejs_compat_v2 behavior which provides
 * native Node.js TCP socket support.  If SMTP connections fail at
 * runtime, verify these settings first.
 */
import nodemailer from 'nodemailer';
import { getEnv } from './env';

function getTransporter() {
  const user = getEnv('GMAIL_USER') || import.meta.env.GMAIL_USER;
  const pass = getEnv('GMAIL_APP_PASSWORD') || import.meta.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD env vars are not set.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const user = getEnv('GMAIL_USER') || import.meta.env.GMAIL_USER;
  const transporter = getTransporter();

  const maxRetries = 2; // Keep only 2 retries (total 3 attempts)
  let attempts = 0;

  while (true) {
    try {
      await transporter.sendMail({
        from: `"TESCA Visa Consultancy" <${user}>`,
        to,
        subject,
        html,
      });
      return; // Success, exit
    } catch (error: any) {
      attempts++;
      if (attempts > maxRetries) {
        // Surface a clear diagnostic when the runtime lacks TCP socket support
        const isSocketError = error?.code === 'ESOCKET' || error?.code === 'ECONNREFUSED' || error?.message?.includes('connect');
        if (isSocketError) {
          console.error(
            `[Mailer] SMTP socket error after ${attempts} attempts. ` +
            `If running on Cloudflare Workers, verify wrangler.toml has ` +
            `compatibility_date >= "2024-09-23" and nodejs_compat flag.`,
            error
          );
        } else {
          console.error(`[Mailer] All ${attempts} attempts failed to send email to ${to}:`, error);
        }
        throw error;
      }
      console.warn(`[Mailer] Attempt ${attempts} failed to send email to ${to}. Retrying in 1s... Error:`, error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

