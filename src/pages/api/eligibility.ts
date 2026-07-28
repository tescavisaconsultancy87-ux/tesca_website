import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../utils/supabase';
import { getEnv } from '../../utils/env';
import { validateEmail, validatePhone, validateName, validateScoreRange, sanitizeText } from '../../utils/validation';
import { reportServerError, getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';
import { sendMail } from '../../utils/mailer';
import { eligibilityResultEmail, eligibilityAdminNotificationEmail } from '../../utils/emailTemplates';
import { runInBackground } from '../../utils/background';
import { DEFAULT_COUNTRY_RULES } from '../../utils/countryRules';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

const COUNTRY_NAMES: Record<string, string> = {
  us: "USA", uk: "United Kingdom", ca: "Canada", au: "Australia",
  de: "Germany", nz: "New Zealand", ie: "Ireland", sg: "Singapore",
  ch: "Switzerland", my: "Malaysia", ae: "Dubai", eu: "Europe",
};

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`eligibility:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    const supabase = getSupabaseAdmin();
    body = await request.json();
    const { name, email, phone, score, ielts, budget, destination, englishType, englishTestName, languageLabel } = body;

    // 1. Basic check for presence
    if (!name || !email || !phone || !score || !budget) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Strict format & range validation
    if (!validateName(name, 200)) {
      return new Response(JSON.stringify({ error: "Invalid name format or length (max 200 characters)." }), {
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

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!validateScoreRange(score, 0, 100)) {
      return new Response(JSON.stringify({ error: "Academic score must be a percentage between 0 and 100." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const ieltsVal = ielts ? parseFloat(ielts) : 0;
    if (ieltsVal > 0 && !validateScoreRange(ielts, 0, 9)) {
      return new Response(JSON.stringify({ error: "IELTS equivalency score must be between 0 and 9." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!validateScoreRange(budget, 0.1, 1000)) {
      return new Response(JSON.stringify({ error: "Budget must be a valid positive number in Lakhs (max 1000)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const academicScoreNum = parseFloat(score);
    const ieltsScoreNum = ieltsVal;
    const budgetLakhsNum = parseFloat(budget);

    // 3. Sanitization
    const cleanName = sanitizeText(name, 200);
    const cleanEmail = sanitizeText(email, 254).toLowerCase();
    const cleanPhone = sanitizeText(phone, 20);
    const cleanDestination = destination ? sanitizeText(destination, 50).toLowerCase() : "all";
    const destinationFullName = COUNTRY_NAMES[cleanDestination] || DEFAULT_COUNTRY_RULES[cleanDestination]?.country_name || cleanDestination.toUpperCase();
    const cleanLangLabel = languageLabel ? sanitizeText(languageLabel, 100) : (englishType === 'MOI' ? 'MOI Certificate' : `IELTS ${ieltsScoreNum}`);

    // Save lead to database
    let leadId: number | null = null;
    try {
      const detailsStr = JSON.stringify({
        academic_score: academicScoreNum,
        ielts_score: ieltsScoreNum,
        language_label: cleanLangLabel,
        english_type: englishType,
        english_test_name: englishTestName,
        budget: budgetLakhsNum,
        destination: destinationFullName
      });
      const { data: insertedData, error: dbErr } = await supabase
        .from('leads')
        .insert({
          lead_type: 'eligibility',
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          details: detailsStr,
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (dbErr) {
        console.error("Failed to save lead in Supabase:", dbErr);
      } else {
        leadId = insertedData?.id || null;
      }
    } catch (dbErr) {
      console.error("Failed to save lead in Supabase:", dbErr);
    }

    // Submit lead to Google Sheets
    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL;

    if (googleSheetUrl) {
      try {
        const params = new URLSearchParams({
          "Full Name": cleanName,
          "Email": cleanEmail,
          "Mobile Number": cleanPhone,
          "Counselling Mode": "Eligibility Finder",
          "Preferred Countries": destinationFullName,
          "Comments": `Academic: ${academicScoreNum}%, Language: ${cleanLangLabel}, Budget: ${budgetLakhsNum} Lakhs/yr.`,
          "Lead Source": "Eligibility Finder Form",
        });
        runInBackground(locals, () => fetch(`${googleSheetUrl}?${params.toString()}`, {
          method: "GET",
        }), "google-sheets-eligibility");
      } catch (err) {
        console.error("Google Sheets eligibility submission failed:", err);
      }
    }

    // Conversion rate: 1 Lakh INR is approx $1,200 USD
    const budgetUSD = budgetLakhsNum * 1200;

    // Fetch all universities or filter by destination code
    let query = supabase.from('universities').select('*');
    if (cleanDestination && cleanDestination !== "all") {
      query = query.eq('code', cleanDestination);
    }
    const { data: allUniversities, error: queryErr } = await query.order('name', { ascending: true });
    if (queryErr) {
      throw queryErr;
    }

    const parseIelts = (req: string | null | undefined): number => {
      if (!req) return 0;
      const match = req.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const parseTuitionUSD = (feeStr: string | null | undefined, countryCode: string): { min: number; max: number } => {
      if (!feeStr) return { min: 0, max: 0 };
      const cleanStr = feeStr.replace(/,/g, "");
      const matches = [...cleanStr.matchAll(/\d+/g)].map(m => parseInt(m[0]));
      if (matches.length === 0) return { min: 0, max: 0 };
      const minVal = matches[0];
      const maxVal = matches[1] || minVal;
      
      let rate = 1.0;
      const code = countryCode.toLowerCase();
      if (code === "uk") rate = 1.3;
      else if (code === "ca") rate = 0.74;
      else if (code === "au") rate = 0.66;
      else if (code === "nz") rate = 0.61;
      else if (code === "de" || code === "ch" || code === "ie" || code === "eu") rate = 1.08;
      else if (code === "sg") rate = 0.74;
      else if (code === "my") rate = 0.21;
      else if (code === "ae") rate = 0.27;
      
      return { min: minVal * rate, max: maxVal * rate };
    };

    // Map rows to normalized values & parse requirements
    const mappedUniversities = (allUniversities || []).map((u: any) => {
      const ugTuition = u.ug_tuition_fees || u.ug_fees || u.tuition_fees || "";
      const ugIelts = u.ug_ielts_pte || u.ug_ielts_pte_req || u.ielts_pte_req || "";
      const ugIntake = u.ug_intakes || u.ug_intake || u.intake || "Sep";
      const ugCourses = u.ug_courses || u.courses || "Various";
      
      const { min: feeMin, max: feeMax } = parseTuitionUSD(ugTuition, u.code);
      const minIelts = parseIelts(ugIelts);
      const minGpa = parseFloat(u.min_cgpa_percent) || 0;
      
      const cleanUniName = u.name.toLowerCase().replace(/[^a-z0-9\s]/g, "");
      const domain = cleanUniName.split(/\s+/).slice(0, 2).join("") + ".edu";
      const rank = u.id ? u.id * 3 : 15;
      const city = u.country === "United Kingdom" ? "London" : u.country === "USA" ? "Boston" : "Main Campus";
      const highlights = JSON.stringify([
        `Intake: ${ugIntake}`,
        `Courses: ${ugCourses.split(",").slice(0, 2).join(", ")}`
      ]);

      return {
        ...u,
        rank,
        domain,
        city,
        established: 1950,
        students: "15,000+",
        tuition_fee_min: feeMin,
        tuition_fee_max: feeMax,
        min_gpa_percent: minGpa,
        min_ielts: minIelts,
        highlights
      };
    });

    // Filter by criteria
    const matches = mappedUniversities.filter((uni: any) => {
      return uni.min_gpa_percent <= academicScoreNum &&
             uni.min_ielts <= ieltsScoreNum &&
             uni.tuition_fee_max <= budgetUSD;
    }).slice(0, 15);

    let reachResults: any[] = [];
    if (matches.length < 3) {
      reachResults = mappedUniversities.filter((uni: any) => {
        if (matches.some((m: any) => m.id === uni.id)) return false;
        
        const gpaEligible = uni.min_gpa_percent <= academicScoreNum * 1.15;
        const ieltsEligible = uni.min_ielts <= ieltsScoreNum + 0.5;
        const feeEligible = uni.tuition_fee_max <= budgetUSD * 1.35;
        
        return gpaEligible && ieltsEligible && feeEligible;
      }).slice(0, 5);
    }

    // 1. Send confirmation email to student
    if (cleanEmail) {
      const { subject: studentSubject, html: studentHtml } = eligibilityResultEmail({
        name: cleanName,
        academicScore: academicScoreNum,
        ieltsScore: ieltsScoreNum,
        languageTestLabel: cleanLangLabel,
        budget: budgetLakhsNum,
        destination: cleanDestination,
        destinationName: destinationFullName,
        matchCount: matches.length,
      });
      runInBackground(locals, () => sendMail({ to: cleanEmail, subject: studentSubject, html: studentHtml }), "eligibility-result-email");
    }

    // 2. Send admin counselor notification email
    const adminEmail = getEnv('ADMIN_NOTIFICATION_EMAIL') || getEnv('GMAIL_USER') || import.meta.env.GMAIL_USER;
    if (adminEmail) {
      const { subject: adminSubject, html: adminHtml } = eligibilityAdminNotificationEmail({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        academicScore: academicScoreNum,
        languageTestLabel: cleanLangLabel,
        budget: budgetLakhsNum,
        destinationName: destinationFullName,
        matchCount: matches.length,
      });
      runInBackground(locals, () => sendMail({ to: adminEmail, subject: adminSubject, html: adminHtml }), "eligibility-admin-notification-email");
    }

    return jsonResponse({
      success: true,
      matches: matches,
      reachMatches: reachResults,
      leadId: leadId
    });

  } catch (err: any) {
    return await reportServerError("eligibility", err, body, request, locals);
  }
};

