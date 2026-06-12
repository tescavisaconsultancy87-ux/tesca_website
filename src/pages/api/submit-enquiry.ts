import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getStudentConfirmationHtml, getOwnerNotificationHtml } from '../../utils/emailTemplates';

export const prerender = false; // Render on demand (SSR)

export const POST: APIRoute = async ({ request }) => {
  try {
    const { firstName, lastName, email, phone, mode, destination, message, source } = await request.json();

    // 1. Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !mode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (First Name, Last Name, Email, Phone, Preferred Mode)." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Enquiry API] RESEND_API_KEY is missing in environment variables.");
      return new Response(
        JSON.stringify({ error: "Email service is temporarily misconfigured. Please check environment variables." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);

    // 2. Configure emails
    const ownerEmail = import.meta.env.OWNER_EMAIL || "tescavisaconsultancy87@gmail.com";
    const senderEmail = import.meta.env.SENDER_EMAIL || "onboarding@resend.dev";

    // 3. Compile templates
    const studentHtml = getStudentConfirmationHtml(firstName, lastName, mode, destination, phone);
    const ownerHtml = getOwnerNotificationHtml(firstName, lastName, email, phone, mode, destination, message, source || "Main Enquiry Form");

    let studentMailSent = false;
    let ownerMailSent = false;
    let studentMailError = null;
    let ownerMailError = null;

    // Send confirmation to the student
    try {
      console.log(`[Enquiry API] Attempting to send confirmation email to student: ${email}`);
      const studentResult = await resend.emails.send({
        from: senderEmail,
        to: email,
        subject: "Enquiry Received Successfully! 🎓",
        html: studentHtml,
      });

      if (studentResult.error) {
        throw studentResult.error;
      }
      
      console.log("[Enquiry API] Student confirmation email sent successfully:", studentResult.data);
      studentMailSent = true;
    } catch (err: any) {
      studentMailError = err.message || err;
      console.error("[Enquiry API] Failed to send student confirmation email. (Note: Resend free tier accounts can only send to the registered owner email address unless a custom domain is verified):", err);
    }

    // Send alert to the owner
    try {
      console.log(`[Enquiry API] Attempting to send alert email to owner: ${ownerEmail}`);
      const ownerResult = await resend.emails.send({
        from: senderEmail,
        to: ownerEmail,
        subject: `New Student Enquiry - ${firstName} ${lastName} 🚀`,
        html: ownerHtml,
      });

      if (ownerResult.error) {
        throw ownerResult.error;
      }

      console.log("[Enquiry API] Owner notification email sent successfully:", ownerResult.data);
      ownerMailSent = true;
    } catch (err: any) {
      ownerMailError = err.message || err;
      console.error("[Enquiry API] Failed to send owner alert email:", err);
    }

    // If both failed, return a 500 error
    if (!studentMailSent && !ownerMailSent) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to send emails.", 
          details: { studentError: studentMailError, ownerError: ownerMailError } 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return status
    return new Response(
      JSON.stringify({
        success: true,
        message: "Enquiry processed successfully.",
        dispatch: {
          studentMailSent,
          ownerMailSent,
          studentMailError: studentMailError ? "Check logs for sandbox/verification restrictions" : null,
          ownerMailError
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("[Enquiry API] General endpoint crash:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
