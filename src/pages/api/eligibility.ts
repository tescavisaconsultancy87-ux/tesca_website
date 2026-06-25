import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { getEnv } from '../../utils/env';
import { validateEmail, validatePhone, validateName, validateScoreRange, sanitizeText } from '../../utils/validation';
import { reportServerError, getClientIP, isRateLimited, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

export const POST: APIRoute = async ({ request, locals }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (isRateLimited(`eligibility:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    body = await request.json();
    const { name, email, phone, score, ielts, budget, destination } = body;

    // 1. Basic check for presence
    if (!name || !email || !phone || !score || !ielts || !budget) {
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

    if (!validateScoreRange(ielts, 0, 9)) {
      return new Response(JSON.stringify({ error: "IELTS score must be a band value between 0 and 9." }), {
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
    const ieltsScoreNum = parseFloat(ielts);
    const budgetLakhsNum = parseFloat(budget);

    // 3. Sanitization
    const cleanName = sanitizeText(name, 200);
    const cleanEmail = sanitizeText(email, 254).toLowerCase();
    const cleanPhone = sanitizeText(phone, 20);
    const cleanDestination = destination ? sanitizeText(destination, 50) : "Any";

    // Save lead to database
    let leadId: number | null = null;
    try {
      const detailsStr = JSON.stringify({
        academic_score: academicScoreNum,
        ielts_score: ieltsScoreNum,
        budget: budgetLakhsNum,
        destination: cleanDestination
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

    // Submit lead to Google Sheets & Web3Forms
    const googleSheetUrl = getEnv('GOOGLE_SHEET_URL') || getEnv('PUBLIC_GOOGLE_SHEET_URL') || import.meta.env.GOOGLE_SHEET_URL || (import.meta.env as any).PUBLIC_GOOGLE_SHEET_URL;
    const web3formsAccessKey = getEnv('WEB3FORMS_ACCESS_KEY') || import.meta.env.WEB3FORMS_ACCESS_KEY;

    // 1. Submit to Web3Forms
    if (web3formsAccessKey) try {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: `Eligibility Finder Match - ${cleanName} 🎯`,
          message: `Eligibility profile submitted by ${cleanName}. Phone: ${cleanPhone}. Email: ${cleanEmail}. Academic Score: ${academicScoreNum}%, IELTS: ${ieltsScoreNum}, Budget: ${budgetLakhsNum} Lakhs/yr. Preferred destination: ${cleanDestination}.`,
          source: "Eligibility Finder Form",
        })
      }).catch(err => console.error("Web3Forms eligibility post failed:", err));
    } catch (err) {
      console.error("Web3Forms eligibility submission failed:", err);
    }

    // 2. Submit to Google Sheets (GET request with query parameters)
    if (googleSheetUrl) {
      try {
        const params = new URLSearchParams({
          "Full Name": cleanName,
          "Email": cleanEmail,
          "Mobile Number": cleanPhone,
          "Counselling Mode": "Eligibility Finder",
          "Preferred Countries": cleanDestination,
          "Comments": `Academic: ${academicScoreNum}%, IELTS: ${ieltsScoreNum}, Budget: ${budgetLakhsNum} Lakhs/yr.`,
          "Lead Source": "Eligibility Finder Form",
        });
        fetch(`${googleSheetUrl}?${params.toString()}`, {
          method: "GET",
        }).catch(err => console.error("Google Sheets eligibility GET failed:", err));
      } catch (err) {
        console.error("Google Sheets eligibility submission failed:", err);
      }
    }

    // Conversion rate: 1 Lakh INR is approx $1,200 USD (broad average for tuition match)
    const budgetUSD = budgetLakhsNum * 1200;

    // Fetch all universities or filter by destination code
    let query = supabase.from('universities').select('*');
    if (destination && destination !== "all") {
      query = query.eq('code', destination);
    }
    const { data: allUniversities, error: queryErr } = await query.order('name', { ascending: true });
    if (queryErr) {
      throw queryErr;
    }


    // Helper to map and parse D1 rows
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
    const mappedUniversities = allUniversities.map((u: any) => {
      const ugTuition = u.ug_tuition_fees || u.ug_fees || u.tuition_fees || "";
      const ugIelts = u.ug_ielts_pte || u.ug_ielts_pte_req || u.ielts_pte_req || "";
      const ugIntake = u.ug_intakes || u.ug_intake || u.intake || "Sep";
      const ugCourses = u.ug_courses || u.courses || "Various";
      
      const { min: feeMin, max: feeMax } = parseTuitionUSD(ugTuition, u.code);
      const minIelts = parseIelts(ugIelts);
      const minGpa = parseFloat(u.min_cgpa_percent) || 0;
      
      // Auto-generate domain based on university name if missing
      const cleanName = u.name.toLowerCase().replace(/[^a-z0-9\s]/g, "");
      const domain = cleanName.split(/\s+/).slice(0, 2).join("") + ".edu";
      
      // Auto-generate rank based on id
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
    // Exact Matches:
    const matches = mappedUniversities.filter(uni => {
      return uni.min_gpa_percent <= academicScoreNum &&
             uni.min_ielts <= ieltsScoreNum &&
             uni.tuition_fee_max <= budgetUSD;
    }).slice(0, 15);

    // Reach Matches (only if no exact matches, or less than 3)
    let reachResults: any[] = [];
    if (matches.length < 3) {
      reachResults = mappedUniversities.filter(uni => {
        // Must not be in exact matches
        if (matches.some(m => m.id === uni.id)) return false;
        
        const gpaEligible = uni.min_gpa_percent <= academicScoreNum * 1.15;
        const ieltsEligible = uni.min_ielts <= ieltsScoreNum + 0.5;
        const feeEligible = uni.tuition_fee_max <= budgetUSD * 1.35;
        
        return gpaEligible && ieltsEligible && feeEligible;
      }).slice(0, 5);
    }

    return jsonResponse({
      success: true,
      matches: matches,
      reachMatches: reachResults,
      leadId: leadId
    });

  } catch (err: any) {
    return await reportServerError("eligibility", err, body, request);
  }
};
