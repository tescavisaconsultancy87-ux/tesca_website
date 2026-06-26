/**
 * TESCA Gmail Mailer Utility
 * Uses Gmail App Password (not Gmail API OAuth) for reliability.
 * Set GMAIL_USER and GMAIL_APP_PASSWORD in .env
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

  await transporter.sendMail({
    from: `"TESCA Visa Consultancy" <${user}>`,
    to,
    subject,
    html,
  });
}
