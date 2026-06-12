/**
 * Email templates for TESCA Visa Consultancy.
 * Tailored brand colors:
 * Primary Teal/Blue: #0A7880
 * Highlight Orange: #F08A00
 * Fonts: 'Plus Jakarta Sans', Arial, sans-serif
 */

export function getStudentConfirmationHtml(
  firstName: string,
  lastName: string,
  counsellingMode: string,
  destination: string,
  phone: string
): string {
  const name = `${firstName} ${lastName}`;
  const countryText = destination || "Not specified";

  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Enquiry Submitted Successfully! 🎓</title>
    <style>
      body {
        background-color: #f6f9fc;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
      }
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; 
      }
      table td {
        font-family: sans-serif;
        font-size: 14px;
        vertical-align: top; 
      }
      .wrapper {
        box-sizing: border-box;
        padding: 20px; 
      }
      .content {
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 10px; 
      }
      .main {
        background: #ffffff;
        border-radius: 16px;
        width: 100%;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 12px rgba(10, 120, 128, 0.03);
        overflow: hidden;
      }
      .header-banner {
        background: linear-gradient(135deg, #0A7880 0%, #075E64 100%);
        padding: 35px 20px;
        text-align: center;
        color: #ffffff;
      }
      .header-banner h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.5px;
        color: #ffffff;
      }
      .header-banner p {
        margin: 5px 0 0 0;
        font-size: 14px;
        color: #e6f2f3;
        font-weight: 500;
      }
      .body-content {
        padding: 30px;
      }
      .welcome-text {
        font-size: 16px;
        color: #1e293b;
        margin-bottom: 20px;
        font-weight: 500;
      }
      .alert-box {
        background-color: #f0f7f7;
        border-left: 4px solid #0A7880;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 25px;
        color: #075E64;
        font-weight: 600;
        font-size: 14px;
      }
      .details-card {
        background-color: #f8fafc;
        border: 1px solid #f1f5f9;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 25px;
      }
      .details-title {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #64748b;
        margin-bottom: 12px;
        margin-top: 0;
      }
      .details-grid {
        width: 100%;
      }
      .details-row td {
        padding: 6px 0;
        font-family: inherit;
      }
      .details-label {
        font-weight: 600;
        color: #475569;
        width: 40%;
      }
      .details-value {
        color: #1e293b;
        font-weight: 500;
      }
      .timeline-title {
        font-size: 15px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 15px;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
      }
      .timeline-item {
        margin-bottom: 15px;
      }
      .timeline-icon {
        font-size: 18px;
        margin-right: 10px;
        vertical-align: middle;
      }
      .timeline-text {
        font-size: 13px;
        color: #475569;
        display: inline-block;
        vertical-align: middle;
        width: 90%;
      }
      .timeline-text strong {
        color: #0d1e21;
      }
      .btn-container {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 20px;
      }
      .btn-primary {
        background-color: #F08A00;
        border: none;
        border-radius: 12px;
        color: #ffffff !important;
        display: inline-block;
        font-size: 14px;
        font-weight: 700;
        line-height: 50px;
        text-align: center;
        text-decoration: none;
        width: 240px;
        box-shadow: 0 4px 6px rgba(240, 138, 0, 0.2);
        -webkit-text-size-adjust: none;
      }
      .btn-primary:hover {
        background-color: #d87c00;
      }
      .footer {
        text-align: center;
        padding-top: 20px;
        color: #94a3b8;
        font-size: 12px;
      }
      .footer a {
        color: #0A7880;
        text-decoration: none;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <!-- START CENTERED WHITE CONTAINER -->
            <div class="main">
              <div class="header-banner">
                <h1>TESCA Visa Consultancy</h1>
                <p>Premium Study Abroad & Visa Consultants</p>
              </div>
              <div class="body-content">
                <p class="welcome-text">Dear <strong>${name}</strong>,</p>
                
                <div class="alert-box">
                  🎉 Form Submitted Successfully! Our team will reach out to you within 24 hours.
                </div>
                
                <p style="color: #475569; font-size: 14px; margin-bottom: 25px;">
                  We have received your enquiry for global study options. Our senior counsellor is reviewing your profile and will get in touch with you shortly using your preferred mode of contact.
                </p>

                <div class="details-card">
                  <h3 class="details-title">Your Enquiry Summary</h3>
                  <table class="details-grid">
                    <tr class="details-row">
                      <td class="details-label">Preferred Mode</td>
                      <td class="details-value">📱 ${counsellingMode}</td>
                    </tr>
                    <tr class="details-row">
                      <td class="details-label">Target Destination</td>
                      <td class="details-value">✈️ ${countryText}</td>
                    </tr>
                    <tr class="details-row">
                      <td class="details-label">Phone Number</td>
                      <td class="details-value">📞 ${phone}</td>
                    </tr>
                  </table>
                </div>

                <h3 class="timeline-title">What happens next?</h3>
                
                <div class="timeline-item">
                  <span class="timeline-icon">📋</span>
                  <span class="timeline-text">
                    <strong>Step 1: Profile Evaluation</strong><br/>
                    Our advisors evaluate your profile for academic matching and visa success.
                  </span>
                </div>
                
                <div class="timeline-item">
                  <span class="timeline-icon">🤝</span>
                  <span class="timeline-text">
                    <strong>Step 2: 1-on-1 Consultation</strong><br/>
                    A dedicated study-abroad expert schedules your detailed advisory meeting.
                  </span>
                </div>

                <div class="timeline-item">
                  <span class="timeline-icon">✈️</span>
                  <span class="timeline-text">
                    <strong>Step 3: School Selection & Visa Roadmap</strong><br/>
                    Receive direct admission support and secure compliance checklist auditing.
                  </span>
                </div>

                <div class="btn-container">
                  <a href="https://wa.me/919824152731" class="btn-primary" target="_blank">Chat with our Experts Now</a>
                </div>

                <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 30px;">
                  If you have urgent questions, you can reach our helpline directly at <strong>+91 98241 52731</strong> or reply to this email.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>TESCA Visa Consultancy • ISO 9001 Certified • Guiding students since 2005</p>
              <p>Want to know more? Visit <a href="https://www.tescavisa.com" target="_blank">our website</a></p>
            </div>
            <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export function getOwnerNotificationHtml(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  counsellingMode: string,
  destination: string,
  message: string,
  source: string = "Direct Web Form"
): string {
  const name = `${firstName} ${lastName}`;
  const countryText = destination || "Not specified";
  const dateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New Student Enquiry 🚀</title>
    <style>
      body {
        background-color: #f1f5f9;
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
        padding: 20px;
      }
      .container {
        background-color: #ffffff;
        border-radius: 12px;
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #e2e8f0;
        overflow: hidden;
      }
      .header {
        background-color: #0A7880;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header h2 {
        margin: 0;
        font-size: 20px;
      }
      .content {
        padding: 25px;
      }
      .lead {
        font-size: 15px;
        font-weight: bold;
        color: #0f172a;
        margin-bottom: 15px;
      }
      .table-data {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .table-data th, .table-data td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      .table-data th {
        background-color: #f8fafc;
        color: #475569;
        font-weight: 600;
        width: 35%;
      }
      .table-data td {
        color: #0f172a;
      }
      .message-box {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
        font-style: italic;
        color: #334155;
      }
      .footer {
        background-color: #f8fafc;
        padding: 15px;
        text-align: center;
        font-size: 11px;
        color: #64748b;
        border-top: 1px solid #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>🚀 New Student Enquiry Received</h2>
      </div>
      <div class="content">
        <p class="lead">A new consultation request has been submitted from the website:</p>
        
        <table class="table-data">
          <tr>
            <th>Student Name</th>
            <td><strong>${name}</strong></td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <th>Preferred Mode</th>
            <td>${counsellingMode}</td>
          </tr>
          <tr>
            <th>Destination</th>
            <td>${countryText}</td>
          </tr>
          <tr>
            <th>Submission Date</th>
            <td>${dateStr} (IST)</td>
          </tr>
          <tr>
            <th>Source</th>
            <td><span style="background-color: #e6f2f3; color: #075E64; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold;">${source}</span></td>
          </tr>
        </table>

        <div class="lead">Additional Details / Message:</div>
        <div class="message-box">
          ${message || "No additional message."}
        </div>
      </div>
      <div class="footer">
        TESCA Website Automated Mailer • Deployed on Cloudflare Pages
      </div>
    </div>
  </body>
</html>
  `.trim();
}
