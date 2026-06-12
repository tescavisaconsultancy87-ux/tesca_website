import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false; // Ensure this endpoint is rendered on-demand (SSR)

// Cache variables for PDF context to optimize performance
let cachedPdfText = '';
let cachedPdfMtime = 0;
let lastCheckTime = 0;

async function getPdfContext(): Promise<string> {
  const now = Date.now();
  // Check the file system at most once every 10 seconds to reduce disk I/O overhead
  if (now - lastCheckTime < 10000 && cachedPdfText) {
    return cachedPdfText;
  }
  lastCheckTime = now;

  try {
    const rootDir = process.cwd();
    const files = fs.readdirSync(rootDir);
    const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

    if (!pdfFile) {
      // Clear cache if PDF is deleted
      cachedPdfText = '';
      cachedPdfMtime = 0;
      return '';
    }

    const pdfPath = path.join(rootDir, pdfFile);
    const stat = fs.statSync(pdfPath);
    const mtime = stat.mtimeMs;

    // Return cache if file has not been modified
    if (mtime === cachedPdfMtime && cachedPdfText) {
      return cachedPdfText;
    }

    console.log(`[AI Chat] Parsing PDF file: ${pdfFile}...`);
    const buffer = fs.readFileSync(pdfPath);
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    cachedPdfText = result.text || '';
    cachedPdfMtime = mtime;
    console.log(`[AI Chat] PDF parsed successfully. Character length: ${cachedPdfText.length}`);
    return cachedPdfText;
  } catch (error) {
    console.error("[AI Chat] Error loading PDF context:", error);
    return cachedPdfText; // Fall back to previous cache if error occurs
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, history } = await request.json();
    const apiKey = import.meta.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Load dynamic PDF training context
    const pdfContext = await getPdfContext();

    const systemInstruction = `
You are TESCA AI, a premium, friendly, and expert study abroad and visa compliance consultant for TESCA Visa Consultancy.
Your purpose is to assist prospective students with inquiries about:
- Study Destinations: USA, UK, Canada, Australia, New Zealand, Ireland, Germany, Dubai, Singapore, and Europe.
- Services: Expert Counselling, Admissions Process, SOP & Documentation, Scholarship Guidance, IELTS/PTE Coaching, Visa Assistance, Blocked Accounts/Loans, and Accommodation.
- Trust Indicators: 99% Visa Success Rate SLA, ISO 9001 Certified, Established in 2005.

${pdfContext ? `---
ADDITIONAL TRAINING CONTEXT (LOADED FROM UPLOADED PDF):
${pdfContext}
---` : 'Note: No external training PDF loaded. Please use your general knowledge of study abroad and TESCA services.'}

CRITICAL RULES:
1. Always format responses using clean Markdown. Use headings, bullet points, and bold text for readability.
2. Be professional, reassuring, and helpful.
3. NEVER tell the user that you are having technical trouble, that you cannot help, or that you are an AI with limitations. If you are unsure, if the PDF context is missing, or if you cannot answer a query, instead guide the user to book a consultation with our senior advisor. Ask them directly to provide their Name, Email, and Phone number in the chat so we can book the appointment for them.
4. If they provide their details, say "Thank you! I have booked your priority consultation. Our senior advisor will reach out to you shortly."
5. If the query is complex or indicates strong intent to enroll, politely suggest booking a 1-on-1 expert consultation using the form or by contacting TESCA directly.
6. Keep answers concise, clear, and relevant. Do not hallucinate details not present in the context or general consultant knowledge.
7. If the user asks about something unrelated to study abroad, guide them back to university admissions and visa consultancy.
    `.trim();

    // Map history to match the Gemini contents payload format
    // Ensure roles are mapped to 'user' and 'model'
    const formattedContents = [
      ...history.map((h: any) => ({
        role: h.role === 'model' || h.role === 'ai' ? 'model' : 'user',
        parts: [{ text: h.parts?.[0]?.text || h.text || "" }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Call Gemini 2.5 Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[AI Chat] Gemini API returned error:", errorData);
      return new Response(
        JSON.stringify({ error: `Gemini API returned error: ${response.statusText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate an answer right now. Please try again.";

    return new Response(
      JSON.stringify({ reply: replyText }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("[AI Chat] Server error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
