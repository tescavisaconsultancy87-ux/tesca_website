import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = env?.tesca_db || env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database connection not available." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const { name, email, phone, score, ielts, budget, destination } = body;

    // Validate inputs
    if (!name || !email || !phone || !score || !ielts || !budget) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const academicScoreNum = parseFloat(score);
    const ieltsScoreNum = parseFloat(ielts);
    const budgetLakhsNum = parseFloat(budget);

    // Save lead to database
    let leadId: number | null = null;
    try {
      const detailsStr = JSON.stringify({
        academic_score: academicScoreNum,
        ielts_score: ieltsScoreNum,
        budget: budgetLakhsNum,
        destination: destination || "Any"
      });
      const result = await db.prepare(
        "INSERT INTO leads (lead_type, name, email, phone, details) VALUES (?, ?, ?, ?, ?)"
      ).bind("eligibility", name, email || null, phone, detailsStr).run();
      
      leadId = result.meta?.last_row_id || null;
    } catch (dbErr) {
      console.error("Failed to save lead in D1:", dbErr);
    }

    // Submit lead to Google Sheets & Web3Forms
    const googleSheetUrl = env?.PUBLIC_GOOGLE_SHEET_URL;
    const web3formsAccessKey = env?.WEB3FORMS_ACCESS_KEY || "85242216-06e7-475c-ad35-beb2808b60d7";

    // 1. Submit to Web3Forms
    try {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          name: name,
          email: email,
          phone: phone,
          subject: `Eligibility Finder Match - ${name} 🎯`,
          message: `Eligibility profile submitted by ${name}. Phone: ${phone}. Email: ${email}. Academic Score: ${score}%, IELTS: ${ielts}, Budget: ${budget} Lakhs/yr. Preferred destination: ${destination || "Any"}.`,
          source: "Eligibility Finder Form",
        })
      }).catch(err => console.error("Web3Forms eligibility post failed:", err));
    } catch (err) {
      console.error("Web3Forms eligibility submission failed:", err);
    }

    // 2. Submit to Google Sheets (standard JSON POST, no-cors)
    if (googleSheetUrl) {
      try {
        fetch(googleSheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            "Full Name": name,
            "Email": email,
            "Mobile Number": phone,
            "Counselling Mode": "Eligibility Finder",
            "Preferred Countries": destination || "Any",
            "Comments": `Academic: ${score}%, IELTS: ${ielts}, Budget: ${budget} Lakhs/yr.`,
            "Lead Source": "Eligibility Finder Form",
          })
        }).catch(err => console.error("Google Sheets eligibility post failed:", err));
      } catch (err) {
        console.error("Google Sheets eligibility submission failed:", err);
      }
    }

    // Conversion rate: 1 Lakh INR is approx $1,200 USD (broad average for tuition match)
    const budgetUSD = budgetLakhsNum * 1200;

    // Fetch all universities or filter by destination code
    let dbQuery = "SELECT * FROM universities";
    let dbParams: any[] = [];
    if (destination && destination !== "all") {
      dbQuery += " WHERE code = ?";
      dbParams.push(destination);
    }
    dbQuery += " ORDER BY name ASC";

    const dbRes = await db.prepare(dbQuery).bind(...dbParams).all();
    const allUniversities = dbRes.results || [];

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

    return new Response(JSON.stringify({
      success: true,
      matches: matches,
      reachMatches: reachResults,
      leadId: leadId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Eligibility API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
