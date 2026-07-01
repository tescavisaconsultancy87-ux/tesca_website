/**
 * TESCA Email Templates — Professionally designed HTML emails
 * Three templates:
 *  1. eligibilityResultEmail   – sent when user checks their eligibility
 *  2. counsellorBookingEmail   – sent when user books a counsellor session
 *  3. inquiryConfirmationEmail – sent when user submits the full CRM inquiry form
 */

const BRAND_BLUE = '#0F4C81';
const BRAND_AMBER = '#F08A00';
const BRAND_DARK = '#1E293B';

function baseWrapper(content: string, previewText = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TESCA Visa Consultancy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    img { display: block; border: 0; }
    @media (max-width: 600px) {
      .email-card { padding: 24px 20px !important; }
      .hero-section { padding: 36px 20px 28px !important; }
      .section-row { flex-direction: column !important; }
      .stat-box { width: 100% !important; }
    }
  </style>
</head>
<body>
  <!-- Preview Text -->
  <span style="display:none;font-size:1px;color:#f1f5f9;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</span>
  
  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9; padding: 32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(15,76,129,0.10);">
        ${content}
      </table>

      <!-- Footer -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; margin-top:20px;">
        <tr><td style="text-align:center; padding: 0 20px;">
          <p style="font-size:12px; color:#94a3b8; line-height:1.7;">
            © ${new Date().getFullYear()} TESCA Visa Consultancy. All rights reserved.<br/>
            110-112, Royal Arcade, Simada Naka, Surat, Gujarat 395013<br/>
            <a href="mailto:tescavisaconsultancy87@gmail.com" style="color:#${BRAND_BLUE.replace('#','')};">tescavisaconsultancy87@gmail.com</a> &nbsp;|&nbsp; 
            <a href="tel:9824152731" style="color:#${BRAND_BLUE.replace('#','')};">+91 98241 52731</a>
          </p>
          <p style="font-size:11px; color:#cbd5e1; margin-top:12px;">This email was sent because you interacted with TESCA Visa Consultancy website.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function header() {
  return `
  <!-- Header -->
  <tr>
    <td style="background: ${BRAND_BLUE}; padding: 20px 32px; text-align: left;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <span style="font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">TESCA</span>
            <span style="font-size:10px; font-weight:700; color:#93c5fd; background:rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding:2px 8px; border-radius:20px; margin-left:8px; vertical-align:middle; letter-spacing:1.5px;">EST. 2005</span>
          </td>
          <td style="text-align:right;">
            <span style="font-size:10px; font-weight:600; color:rgba(255,255,255,0.6); letter-spacing:1px; text-transform:uppercase;">Visa Consultancy</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ELIGIBILITY RESULT EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export function eligibilityResultEmail({
  name,
  academicScore,
  ieltsScore,
  budget,
  destination,
  matchCount,
}: {
  name: string;
  academicScore: number | string;
  ieltsScore: number | string;
  budget: number | string;
  destination: string;
  matchCount: number;
}) {
  const isGoodMatch = matchCount >= 3;

  const content = `
  ${header()}

  <!-- Hero Banner -->
  <tr>
    <td class="hero-section" style="background: linear-gradient(135deg, #0F4C81 0%, #1e40af 60%, #0F4C81 100%); padding: 44px 40px 36px; text-align:left;">
      <div style="display:inline-block; background:rgba(240,138,0,0.15); border:1px solid rgba(240,138,0,0.4); border-radius:30px; padding:5px 16px; margin-bottom:16px;">
        <span style="font-size:11px; font-weight:700; color:#fbbf24; letter-spacing:1.5px; text-transform:uppercase;">🎯 Eligibility Report</span>
      </div>
      <h1 style="font-size:28px; font-weight:800; color:#ffffff; line-height:1.25; margin:0 0 10px;">Hello, ${name}! 👋</h1>
      <p style="font-size:16px; color:rgba(255,255,255,0.80); line-height:1.6; margin:0;">
        Your eligibility assessment is ready. Here's a personalized summary of your profile.
      </p>
    </td>
  </tr>

  <!-- Profile Score Cards -->
  <tr>
    <td style="padding: 32px 40px 0;" class="email-card">
      <p style="font-size:13px; font-weight:700; color:#64748b; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:16px;">Your Academic Profile</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:33%; padding:0 6px 0 0;">
            <div style="background:#f0f9ff; border:1.5px solid #bae6fd; border-radius:14px; padding:18px 14px; text-align:center;">
              <span style="font-size:28px; font-weight:800; color:${BRAND_BLUE}; display:block; line-height:1;">${academicScore}%</span>
              <span style="font-size:11px; color:#64748b; font-weight:600; margin-top:4px; display:block; text-transform:uppercase; letter-spacing:0.8px;">Academic Score</span>
            </div>
          </td>
          <td style="width:33%; padding:0 3px;">
            <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:14px; padding:18px 14px; text-align:center;">
              <span style="font-size:28px; font-weight:800; color:#16a34a; display:block; line-height:1;">${ieltsScore}</span>
              <span style="font-size:11px; color:#64748b; font-weight:600; margin-top:4px; display:block; text-transform:uppercase; letter-spacing:0.8px;">IELTS Band</span>
            </div>
          </td>
          <td style="width:33%; padding:0 0 0 6px;">
            <div style="background:#fff7ed; border:1.5px solid #fed7aa; border-radius:14px; padding:18px 14px; text-align:center;">
              <span style="font-size:22px; font-weight:800; color:${BRAND_AMBER}; display:block; line-height:1;">₹${budget}L</span>
              <span style="font-size:11px; color:#64748b; font-weight:600; margin-top:4px; display:block; text-transform:uppercase; letter-spacing:0.8px;">Budget/Year</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Result Banner -->
  <tr>
    <td style="padding: 24px 40px;" class="email-card">
      ${isGoodMatch
        ? `<div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border:2px solid #86efac; border-radius:16px; padding:22px 24px; display:flex; align-items:center;">
            <div>
              <p style="font-size:18px; font-weight:800; color:#16a34a; margin:0 0 6px;">🎉 Great News! ${matchCount} Universities Match Your Profile</p>
              <p style="font-size:14px; color:#374151; margin:0; line-height:1.6;">
                Based on your academic score, IELTS band, and budget, we found <strong>${matchCount} matched universities</strong> for <strong>${destination}</strong>. 
                Our counselors will shortlist the best options for you!
              </p>
            </div>
          </div>`
        : `<div style="background:linear-gradient(135deg, #fff7ed, #ffedd5); border:2px solid #fdba74; border-radius:16px; padding:22px 24px;">
            <p style="font-size:18px; font-weight:800; color:#c2410c; margin:0 0 6px;">⚡ We Have Options for You!</p>
            <p style="font-size:14px; color:#374151; margin:0; line-height:1.6;">
              While a few universities match your current profile, our expert counselors can help you explore 
              <strong>stretch universities</strong> and <strong>alternative pathways</strong> to reach your dream destination.
            </p>
          </div>`
      }
    </td>
  </tr>

  <!-- CTA Section -->
  <tr>
    <td style="padding: 0 40px 40px;" class="email-card">
      <div style="background: linear-gradient(135deg, ${BRAND_BLUE} 0%, #1e40af 100%); border-radius:18px; padding:32px; text-align:center;">
        <p style="font-size:14px; font-weight:700; color:rgba(255,255,255,0.7); letter-spacing:1px; text-transform:uppercase; margin:0 0 10px;">Next Step</p>
        <h2 style="font-size:22px; font-weight:800; color:#ffffff; margin:0 0 12px; line-height:1.3;">Book a Free Counselling Session</h2>
        <p style="font-size:14px; color:rgba(255,255,255,0.75); margin:0 0 24px; line-height:1.6;">
          Our senior counselors will review your profile, shortlist universities, and create a custom roadmap for your journey abroad.
        </p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
          <tr>
            <td style="padding-right:10px;">
              <a href="https://tescavisa.com/eligibility/" style="display:inline-block; background:#ffffff; color:${BRAND_BLUE}; font-size:14px; font-weight:800; padding:13px 28px; border-radius:50px; letter-spacing:0.5px;">View Your Matches →</a>
            </td>
            <td>
              <a href="https://wa.me/919824152731" style="display:inline-block; background:${BRAND_AMBER}; color:#ffffff; font-size:14px; font-weight:800; padding:13px 28px; border-radius:50px; letter-spacing:0.5px;">💬 WhatsApp Us</a>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <!-- Trust Footer Bar -->
  <tr>
    <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 40px; text-align:center;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;">
            <span style="font-size:12px; color:#94a3b8; margin:0 10px;">⭐ 97% Visa Success Rate</span>
            <span style="font-size:12px; color:#94a3b8; margin:0 10px;">🎓 30,000+ Students</span>
            <span style="font-size:12px; color:#94a3b8; margin:0 10px;">📅 Since 2005</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return {
    subject: `🎯 Your Eligibility Results Are Ready, ${name}! — TESCA`,
    html: baseWrapper(content, `Your eligibility assessment found ${matchCount} university matches. View them now!`),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. COUNSELLOR BOOKING CONFIRMATION EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export function counsellorBookingEmail({
  firstName,
  lastName,
  phone,
  email,
  mode,
  destination,
  visaType,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  mode?: string;
  destination?: string;
  visaType?: string;
}) {
  const fullName = `${firstName} ${lastName}`;

  const content = `
  ${header()}

  <!-- Hero -->
  <tr>
    <td style="background: linear-gradient(135deg, ${BRAND_BLUE} 0%, #1e3a5f 100%); padding: 44px 40px 36px; text-align:left;" class="hero-section">
      <div style="display:inline-block; background:rgba(240,138,0,0.18); border:1px solid rgba(240,138,0,0.5); border-radius:30px; padding:5px 16px; margin-bottom:16px;">
        <span style="font-size:11px; font-weight:700; color:#fbbf24; letter-spacing:1.5px; text-transform:uppercase;">✅ Booking Confirmed</span>
      </div>
      <h1 style="font-size:28px; font-weight:800; color:#ffffff; margin:0 0 10px; line-height:1.25;">You're All Set, ${firstName}!</h1>
      <p style="font-size:15px; color:rgba(255,255,255,0.78); margin:0; line-height:1.65;">
        Your counselling request has been received. A TESCA senior counselor will reach out to you within <strong style="color:#fbbf24;">24 hours</strong>.
      </p>
    </td>
  </tr>

  <!-- Booking Summary -->
  <tr>
    <td style="padding:32px 40px 0;" class="email-card">
      <p style="font-size:13px; font-weight:700; color:#64748b; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:20px;">Booking Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e2e8f0; border-radius:14px; overflow:hidden;">
        ${[
          ['Full Name', fullName],
          ['Phone / WhatsApp', phone],
          ['Email', email],
          ['Mode of Counselling', mode || 'Not specified'],
          ['Visa Type Interest', visaType || 'Not specified'],
          ['Preferred Destination', destination || 'Flexible'],
        ].map(([label, value], i) => `
        <tr style="background:${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">
          <td style="padding:14px 20px; font-size:13px; font-weight:600; color:#475569; width:45%; border-bottom:1px solid #f1f5f9;">${label}</td>
          <td style="padding:14px 20px; font-size:13px; font-weight:700; color:${BRAND_DARK}; border-bottom:1px solid #f1f5f9;">${value}</td>
        </tr>`).join('')}
      </table>
    </td>
  </tr>

  <!-- What Happens Next -->
  <tr>
    <td style="padding:28px 40px 0;" class="email-card">
      <p style="font-size:13px; font-weight:700; color:#64748b; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:16px;">What Happens Next?</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          { icon: '📞', title: 'Counselor Call', desc: 'Our expert will call you within 24 hours to understand your goals.' },
          { icon: '📋', title: 'Profile Assessment', desc: 'We\u2019ll evaluate your academic profile and match you with universities.' },
          { icon: '🗺️', title: 'Custom Roadmap', desc: 'Get a tailored step-by-step plan for your study abroad journey.' },
        ].map(step => `
        <tr>
          <td style="vertical-align:top; padding:0 0 18px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:46px; vertical-align:top; padding-right:14px;">
                  <div style="width:44px; height:44px; background:${BRAND_BLUE}; border-radius:12px; text-align:center; line-height:44px; font-size:20px;">${step.icon}</div>
                </td>
                <td style="vertical-align:top;">
                  <p style="font-size:15px; font-weight:700; color:${BRAND_DARK}; margin:0 0 4px;">${step.title}</p>
                  <p style="font-size:13px; color:#64748b; margin:0; line-height:1.55;">${step.desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`).join('')}
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:24px 40px 40px;" class="email-card">
      <div style="background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border:2px solid #86efac; border-radius:16px; padding:24px; text-align:center;">
        <p style="font-size:15px; font-weight:700; color:#15803d; margin:0 0 8px;">Need to Reach Us Sooner?</p>
        <p style="font-size:13px; color:#374151; margin:0 0 18px;">WhatsApp or call us directly \u2014 we\u2019re available 9AM to 7PM IST.</p>
        <a href="https://wa.me/919824152731" style="display:inline-block; background:#25D366; color:#ffffff; font-size:14px; font-weight:800; padding:12px 32px; border-radius:50px; letter-spacing:0.5px;">💬 WhatsApp Counsellor</a>
      </div>
    </td>
  </tr>

  <!-- Trust Footer -->
  <tr>
    <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 40px; text-align:center;">
      <span style="font-size:12px; color:#94a3b8; margin:0 10px;">✅ 20+ Years Experience</span>
      <span style="font-size:12px; color:#94a3b8; margin:0 10px;">🌍 12+ Destinations</span>
      <span style="font-size:12px; color:#94a3b8; margin:0 10px;">📜 ISO 9001 Certified</span>
    </td>
  </tr>`;

  return {
    subject: `✅ Counselling Request Confirmed — TESCA Visa Consultancy`,
    html: baseWrapper(content, `Hi ${firstName}, your counselling session request is confirmed! We will contact you within 24 hours.`),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CRM INQUIRY CONFIRMATION EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export function inquiryConfirmationEmail({
  name,
  leadId,
  inquiryTypes,
  preferredCountries,
  phone: _phone,
}: {
  name: string;
  leadId?: string;
  inquiryTypes: string[];
  preferredCountries: string[];
  phone: string;
}) {
  const content = `
  ${header()}

  <!-- Hero -->
  <tr>
    <td style="background: linear-gradient(135deg, #0F4C81 0%, #1e3a5f 60%, #0a2e5c 100%); padding:44px 40px 36px;" class="hero-section">
      <div style="display:inline-block; background:rgba(240,138,0,0.18); border:1px solid rgba(240,138,0,0.5); border-radius:30px; padding:5px 16px; margin-bottom:16px;">
        <span style="font-size:11px; font-weight:700; color:#fbbf24; letter-spacing:1.5px; text-transform:uppercase;">📋 Inquiry Received</span>
      </div>
      <h1 style="font-size:28px; font-weight:800; color:#ffffff; margin:0 0 10px; line-height:1.25;">Thank You, ${name}!</h1>
      <p style="font-size:15px; color:rgba(255,255,255,0.78); margin:0; line-height:1.65;">
        Your detailed inquiry has been registered. Our senior counselor will review your complete profile and contact you within <strong style="color:#fbbf24;">24 hours</strong>.
      </p>
      ${leadId ? `<div style="margin-top:16px; display:inline-block; background:rgba(255,255,255,0.10); border:1px solid rgba(255,255,255,0.20); border-radius:10px; padding:8px 20px;">
        <span style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.6); letter-spacing:0.8px;">LEAD ID: </span>
        <span style="font-size:13px; font-weight:800; color:#ffffff; font-family:monospace;">${leadId}</span>
      </div>` : ''}
    </td>
  </tr>

  <!-- Summary Cards -->
  <tr>
    <td style="padding:32px 40px 0;" class="email-card">
      <p style="font-size:13px; font-weight:700; color:#64748b; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:16px;">Inquiry Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:50%; padding:0 8px 16px 0;" valign="top">
            <div style="background:#f0f9ff; border:1.5px solid #bae6fd; border-radius:14px; padding:18px;">
              <p style="font-size:11px; font-weight:700; color:#0369a1; text-transform:uppercase; letter-spacing:1px; margin:0 0 10px;">🎯 Inquiry Types</p>
              ${inquiryTypes.length > 0 
                ? inquiryTypes.map(t => `<div style="display:inline-block; background:#e0f2fe; color:#0369a1; font-size:12px; font-weight:700; padding:4px 12px; border-radius:20px; margin:3px 3px 3px 0; border:1px solid #bae6fd;">${t}</div>`).join('')
                : '<span style="font-size:13px; color:#94a3b8;">Not specified</span>'}
            </div>
          </td>
          <td style="width:50%; padding:0 0 16px 8px;" valign="top">
            <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:14px; padding:18px;">
              <p style="font-size:11px; font-weight:700; color:#15803d; text-transform:uppercase; letter-spacing:1px; margin:0 0 10px;">🌍 Preferred Countries</p>
              ${preferredCountries.length > 0
                ? preferredCountries.map(c => `<div style="display:inline-block; background:#dcfce7; color:#15803d; font-size:12px; font-weight:700; padding:4px 12px; border-radius:20px; margin:3px 3px 3px 0; border:1px solid #bbf7d0;">${c}</div>`).join('')
                : '<span style="font-size:13px; color:#94a3b8;">Flexible</span>'}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Timeline -->
  <tr>
    <td style="padding:16px 40px 0;" class="email-card">
      <p style="font-size:13px; font-weight:700; color:#64748b; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:16px;">Your Journey Timeline</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          { step: '01', title: 'Profile Reviewed', desc: 'Within 24 hours — our team analyzes your academic and visa profile', color: '#0F4C81', bg: '#eff6ff' },
          { step: '02', title: 'Counselor Assigned', desc: 'A dedicated counselor matched to your destination and visa type', color: '#7c3aed', bg: '#f5f3ff' },
          { step: '03', title: 'Personalized Plan', desc: 'Step-by-step roadmap covering documents, universities & timeline', color: '#0d9488', bg: '#f0fdfa' },
          { step: '04', title: 'Application Support', desc: 'Full guidance from university applications to visa stamping', color: '#c2410c', bg: '#fff7ed' },
        ].map(step => `
        <tr>
          <td style="padding:0 0 16px;" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:48px; vertical-align:top; padding-right:14px;">
                  <div style="width:44px; height:44px; background:${step.bg}; border:2px solid ${step.color}30; border-radius:12px; text-align:center; line-height:44px;">
                    <span style="font-size:13px; font-weight:800; color:${step.color};">${step.step}</span>
                  </div>
                </td>
                <td valign="top">
                  <p style="font-size:14px; font-weight:700; color:${BRAND_DARK}; margin:0 0 3px;">${step.title}</p>
                  <p style="font-size:12px; color:#64748b; margin:0; line-height:1.55;">${step.desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`).join('')}
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:20px 40px 40px;" class="email-card">
      <div style="background:linear-gradient(135deg, ${BRAND_BLUE}, #1e40af); border-radius:18px; padding:28px; text-align:center;">
        <h2 style="font-size:20px; font-weight:800; color:#ffffff; margin:0 0 10px;">Need Immediate Help?</h2>
        <p style="font-size:13px; color:rgba(255,255,255,0.75); margin:0 0 20px;">Our counselors are available 9 AM – 7 PM (IST) on WhatsApp and Phone.</p>
        <a href="https://wa.me/919824152731" style="display:inline-block; background:#25D366; color:#ffffff; font-size:14px; font-weight:800; padding:13px 30px; border-radius:50px; margin-right:10px;">💬 WhatsApp</a>
        <a href="tel:9824152731" style="display:inline-block; background:rgba(255,255,255,0.15); color:#ffffff; font-size:14px; font-weight:800; padding:13px 30px; border-radius:50px; border:1px solid rgba(255,255,255,0.25);">📞 Call Us</a>
      </div>
    </td>
  </tr>

  <!-- Trust Footer -->
  <tr>
    <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 40px; text-align:center;">
      <span style="font-size:12px; color:#94a3b8; margin:0 8px;">⭐ 97% Visa Success</span>
      <span style="font-size:12px; color:#94a3b8; margin:0 8px;">🎓 30,000+ Students</span>
      <span style="font-size:12px; color:#94a3b8; margin:0 8px;">🌍 20+ Years Experience</span>
    </td>
  </tr>`;

  return {
    subject: `📋 Inquiry Registered — TESCA Visa Consultancy`,
    html: baseWrapper(content, `Hi ${name}, your inquiry has been received! We'll contact you within 24 hours.`),
  };
}
