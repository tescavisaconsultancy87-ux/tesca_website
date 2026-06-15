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
      const result = await db.prepare(
        "INSERT INTO leads (name, email, phone, academic_score, ielts_score, budget) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(name, email, phone, academicScoreNum, ieltsScoreNum, budgetLakhsNum).run();
      
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

    let query = "SELECT * FROM universities WHERE tuition_fee_max <= ? AND min_gpa_percent <= ? AND min_ielts <= ?";
    let params: any[] = [budgetUSD, academicScoreNum, ieltsScoreNum];

    if (destination && destination !== "all") {
      query += " AND code = ?";
      params.push(destination);
    }

    query += " ORDER BY rank ASC LIMIT 15";

    const { results } = await db.prepare(query).bind(...params).all();

    // Reach universities fallback if no direct matches
    let reachResults: any[] = [];
    if (results.length === 0) {
      let reachQuery = "SELECT * FROM universities WHERE tuition_fee_max <= ? AND min_gpa_percent <= ? AND min_ielts <= ?";
      let reachParams: any[] = [budgetUSD * 1.35, academicScoreNum * 1.15, ieltsScoreNum + 0.5];

      if (destination && destination !== "all") {
        reachQuery += " AND code = ?";
        reachParams.push(destination);
      }
      reachQuery += " ORDER BY rank ASC LIMIT 5";
      
      const { results: reach } = await db.prepare(reachQuery).bind(...reachParams).all();
      reachResults = reach;
    }

    return new Response(JSON.stringify({
      success: true,
      matches: results,
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
