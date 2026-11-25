/**
 * Domain knowledge profiles & evergreen fallback topic bank for zero-AI daily auto-blogging.
 * Used by scripts/auto-publish-blog.mjs.
 */

export const TAG_COLORS = {
  blue: "bg-blue-50 border-blue-100 text-blue-700",
  purple: "bg-purple-50 border-purple-100 text-purple-700",
  emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  red: "bg-red-50 border-red-100 text-red-700",
  indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
  amber: "bg-amber-50 border-amber-100 text-amber-700",
  rose: "bg-rose-50 border-rose-100 text-rose-700",
  cyan: "bg-cyan-50 border-cyan-100 text-cyan-700",
};

export const RSS_TOPICS = [
  {
    key: "uk",
    country: "United Kingdom",
    tag: "UK VISA",
    color: "blue",
    guidePath: "/study-abroad/uk",
    query: "UK student visa graduate route Indian students",
  },
  {
    key: "canada",
    country: "Canada",
    tag: "CANADA VISA",
    color: "red",
    guidePath: "/study-abroad/canada",
    query: "Canada study permit PGWP Indian students",
  },
  {
    key: "australia",
    country: "Australia",
    tag: "AUSTRALIA VISA",
    color: "emerald",
    guidePath: "/study-abroad/australia",
    query: "Australia student visa subclass 500 Indian students",
  },
  {
    key: "germany",
    country: "Germany",
    tag: "GERMANY GUIDE",
    color: "emerald",
    guidePath: "/study-abroad/germany",
    query: "Germany student visa Opportunity Card Chancenkarte India",
  },
  {
    key: "usa",
    country: "United States",
    tag: "USA VISA",
    color: "indigo",
    guidePath: "/study-abroad/usa",
    query: "USA F1 student visa interview India",
  },
  {
    key: "ielts",
    country: "IELTS & Test Prep",
    tag: "TEST PREP",
    color: "blue",
    guidePath: "/ielts-classes-in-surat",
    query: "IELTS PTE Duolingo study abroad India update",
  },
  {
    key: "ireland",
    country: "Ireland",
    tag: "IRELAND STUDY",
    color: "cyan",
    guidePath: "/study-abroad/ireland",
    query: "Ireland student visa Indian students stay back",
  },
  {
    key: "new-zealand",
    country: "New Zealand",
    tag: "NZ STUDY",
    color: "amber",
    guidePath: "/study-abroad/new-zealand",
    query: "New Zealand student visa post study work India",
  },
  {
    key: "europe",
    country: "Europe & Schengen",
    tag: "EUROPE STUDY",
    color: "purple",
    guidePath: "/study-abroad/europe",
    query: "Europe Schengen student visa Indian students",
  },
  {
    key: "dubai",
    country: "Dubai (UAE)",
    tag: "DUBAI STUDY",
    color: "rose",
    guidePath: "/study-abroad/dubai",
    query: "Study in Dubai UAE student visa Indian students",
  },
];

export const COUNTRY_PROFILES = {
  uk: {
    country: "United Kingdom",
    visaName: "UK Student Route (Tier 4) & Graduate Route",
    financialRule: "Tuition balance plus 9 months of maintenance funds (held continuously for 28 consecutive days before filing)",
    englishRule: "IELTS Academic 6.0–6.5, PTE, or university MOI waiver where eligible",
    workRule: "Up to 20 hours/week during term and full-time during vacations, followed by the Graduate Route (PSW)",
    checklist: [
      "Unconditional Offer & Confirmation of Acceptance for Studies (CAS)",
      "28-day seasoned bank statement or sanctioned education loan letter",
      "Approved TB test certificate from an IOM/UKVI clinic in India",
      "Academic transcripts, degree certificates, and credible interview preparation",
    ],
    faqs: [
      {
        q: "How long must funds be held for a UK Student Visa?",
        a: "Maintenance and remaining tuition funds must remain untouched in an approved bank account for at least 28 consecutive days prior to visa application.",
      },
      {
        q: "Can Indian students work after graduating in the UK?",
        a: "Yes, eligible graduates can apply for the UK Graduate Route post-study work visa before transitioning to Skilled Worker sponsorship.",
      },
    ],
  },
  canada: {
    country: "Canada",
    visaName: "Canadian Study Permit & PGWP",
    financialRule: "First-year tuition payment plus CAD 20,635 GIC / liquid living-cost proof",
    englishRule: "IELTS Academic / PTE Academic meeting DLI program requirements",
    workRule: "Off-campus part-time work during semesters and Post-Graduation Work Permit (PGWP) for eligible DLI programs",
    checklist: [
      "Letter of Acceptance (LOA) from a recognized Designated Learning Institution (DLI)",
      "Provincial Attestation Letter (PAL) where required for the intake",
      "GIC certificate plus tuition payment receipt and sponsor ITRs",
      "Detailed Statement of Purpose (SOP) explaining career progression and home ties",
    ],
    faqs: [
      {
        q: "Is a Provincial Attestation Letter (PAL) mandatory for Canada?",
        a: "Most undergraduate, diploma, and graduate certificate applicants require a PAL from the province unless they fall under an exempt category.",
      },
      {
        q: "What makes a Canada Study Permit SOP strong?",
        a: "A strong SOP clearly links your past academics and work experience to your chosen Canadian program and realistic career outcomes in India.",
      },
    ],
  },
  australia: {
    country: "Australia",
    visaName: "Australia Subclass 500 Student Visa",
    financialRule: "First-year tuition, travel funds, and annual living-capacity proof via seasoned savings or approved bank loan",
    englishRule: "IELTS 6.0–6.5 or PTE Academic equivalent meeting Genuine Student (GS) norms",
    workRule: "Up to 48 hours per fortnight during study periods and Temporary Graduate (Subclass 485) post-study work rights",
    checklist: [
      "Confirmation of Enrolment (CoE) from an Australian CRICOS institution",
      "Genuine Student (GS) statement responses backed by verifiable evidence",
      "Overseas Student Health Cover (OSHC) for the full visa duration",
      "Financial capacity proofs, sponsor income ITRs, and upfront medicals",
    ],
    faqs: [
      {
        q: "What replaced the GTE requirement in Australia?",
        a: "Australia replaced the GTE essay with the structured Genuine Student (GS) questions focusing on academic rationale, course relevance, and economic circumstances.",
      },
      {
        q: "How many hours can international students work in Australia?",
        a: "Subclass 500 holders can generally work up to 48 hours per fortnight while classes are in session and unlimited hours during scheduled breaks.",
      },
    ],
  },
  germany: {
    country: "Germany",
    visaName: "German National Student Visa & Opportunity Card",
    financialRule: "Blocked Account (Sperrkonto) showing annual living funds (approx. €11,904+ depending on current threshold)",
    englishRule: "IELTS/TOEFL for English-taught programs or TestDaF/Goethe for German-taught tracks",
    workRule: "140 full days (or 280 half days) per year during studies plus an 18-month job-seeker residence permit after graduation",
    checklist: [
      "APS (Academic Evaluation Centre) certificate for Indian applicants",
      "University admit or Uni-Assist confirmation",
      "Blocked Account (Sperrkonto) confirmation + German health insurance",
      "Passport, SOP/motivation letter, and VFS appointment dossier",
    ],
    faqs: [
      {
        q: "Is an APS certificate mandatory for Germany from India?",
        a: "Yes, Indian students applying for most German degree programs need an APS certificate before booking their student visa appointment.",
      },
      {
        q: "Are public universities in Germany still tuition-free?",
        a: "Most German public universities charge only a modest semester contribution (€150–€350), though Baden-Württemberg and select programs have tuition fees.",
      },
    ],
  },
  usa: {
    country: "United States",
    visaName: "USA F-1 Student Visa",
    financialRule: "Liquid funds covering at least the first year of I-20 tuition and living costs via bank balance or loan sanction",
    englishRule: "IELTS, TOEFL iBT, or Duolingo English Test as accepted by the US university",
    workRule: "On-campus work up to 20 hours/week, CPT during study, and 12–36 months OPT/STEM OPT after graduation",
    checklist: [
      "Signed Form I-20 from a SEVP-certified US university",
      "DS-160 confirmation and I-901 SEVIS fee payment receipt",
      "Liquid sponsor financial documents matching the I-20 amount",
      "Focused 2-minute F-1 visa interview preparation explaining university fit",
    ],
    faqs: [
      {
        q: "What is the most important part of a US F-1 visa?",
        a: "The in-person consular interview, where you must concisely demonstrate genuine study intent, funding readiness, and strong ties to India.",
      },
      {
        q: "How long can STEM graduates work in the USA?",
        a: "Eligible F-1 STEM graduates can receive 12 months of standard OPT plus a 24-month STEM OPT extension (36 months total).",
      },
    ],
  },
  ielts: {
    country: "IELTS & Test Prep",
    visaName: "IELTS, PTE & Duolingo Language Qualification",
    financialRule: "Avoid costly test retakes by targeting your required band (6.5+ / 7.5+) on the first sitting",
    englishRule: "Listening, Reading, Writing, and Speaking module balance with zero weak-band drops",
    workRule: "Stronger English scores unlock scholarships, faster SDS/GS approvals, and PR migration points",
    checklist: [
      "Diagnostic mock test to benchmark Listening, Reading, Writing, and Speaking",
      "Daily timed reading and listening drills targeting common trap patterns",
      "Structured Task 1 & Task 2 essay templates checked by certified trainers",
      "1-on-1 speaking interviews to eliminate hesitation and improve lexical range",
    ],
    faqs: [
      {
        q: "Which test is easier for Indian students: IELTS or PTE?",
        a: "IELTS suits candidates comfortable with human speaking interviews, while PTE suits students who prefer computer-evaluated speaking and typing.",
      },
      {
        q: "How early should I finish IELTS before my target intake?",
        a: "Complete your IELTS or PTE at least 6 to 8 months before your intake deadline so you have time for university applications and visa filing.",
      },
    ],
  },
  ireland: {
    country: "Ireland",
    visaName: "Ireland Stamp 2 Student Visa & Stay-Back",
    financialRule: "Full first-year tuition payment receipt plus €10,000 living-cost proof",
    englishRule: "IELTS 6.0–6.5, PTE, or Duolingo accepted across major Irish universities",
    workRule: "20 hours/week during term, 40 hours/week in holidays, and 1–2 year Third Level Graduate Scheme stay-back",
    checklist: [
      "Official Irish university Offer Letter and tuition fee payment receipt",
      "€10,000 accessible funds or education loan documentation",
      "Private medical insurance and Police Clearance Certificate (PCC)",
      "Clear SOP addressing course relevance and post-study career plan",
    ],
    faqs: [
      {
        q: "How long is the post-study stay-back in Ireland?",
        a: "Master's graduates (NFQ Level 9) qualify for up to 24 months of stay-back permission under Ireland's Third Level Graduate Scheme.",
      },
      {
        q: "Is Ireland good for IT, Pharma, and Data roles?",
        a: "Yes, Dublin and Cork host European headquarters for leading global tech, cloud, and pharmaceutical employers.",
      },
    ],
  },
  "new-zealand": {
    country: "New Zealand",
    visaName: "New Zealand Fee-Paying Student Visa",
    financialRule: "First-year tuition plus NZD 20,000/year living-expense proof (or FTS scheme)",
    englishRule: "IELTS Academic 6.0–6.5 or PTE equivalent meeting NZQA level rules",
    workRule: "Up to 20 hours/week during term and up to 3-year Post Study Work Visa for eligible Master's/Bachelor's degrees",
    checklist: [
      "Offer of Place from an NZQA-approved university or institute",
      "Funds Transfer Scheme (FTS) or verified 6-month liquid sponsor funds",
      "Panel physician medical + Police Clearance Certificate",
      "Clear Statement of Purpose and academic gap justification if any",
    ],
    faqs: [
      {
        q: "What is the FTS scheme for New Zealand?",
        a: "The Funds Transfer Scheme (FTS) locks NZD 20,000+ in a New Zealand bank account and releases monthly living allowances, boosting visa transparency.",
      },
      {
        q: "Can Master's students get a 3-year work visa in New Zealand?",
        a: "Yes, full-time Master's and Doctoral graduates who meet duration rules are generally eligible for up to 3 years of post-study work rights.",
      },
    ],
  },
  europe: {
    country: "Europe & Schengen",
    visaName: "European National Long-Stay (Type D) Study Visa",
    financialRule: "Low public tuition (€1,000–€4,500/year) plus country-specific annual living funds (€7,000–€12,000)",
    englishRule: "IELTS 6.0 or MOI accepted by many English-taught European programs",
    workRule: "20 hours/week part-time work during study and 9–18 month job-search residence options post-graduation",
    checklist: [
      "University admission letter and apostilled academic transcripts",
      "Proof of accommodation and Schengen travel/health insurance",
      "Seasoned sponsor bank balance or blocked account confirmation",
      "Embassy/VFS file verification and mock interview readiness",
    ],
    faqs: [
      {
        q: "Which European countries offer affordable English-taught degrees?",
        a: "Germany, France, Italy, Finland, Poland, and Hungary offer strong English-taught programs at significantly lower tuition than the US or UK.",
      },
      {
        q: "Do I need to apostille my Indian degree documents for Europe?",
        a: "Yes, several European countries require MEA apostille and legalized translations before issuing a Type D student visa.",
      },
    ],
  },
  dubai: {
    country: "Dubai (UAE)",
    visaName: "UAE University-Sponsored Student Residence Visa",
    financialRule: "Flexible semester-wise tuition installments with no heavy upfront blocked account requirement",
    englishRule: "MOI / internal English placement or IELTS 5.5–6.0 depending on university",
    workRule: "On-campus/internship work permissions and strong post-study transition to UAE Employment or Golden Visa pathways",
    checklist: [
      "Offer letter from a KHDA-accredited or international branch campus in Dubai",
      "Passport copy, photographs, and attested academic marksheets",
      "University visa sponsorship fee and Emirates ID / medical fitness steps",
      "Housing booking or student residence confirmation",
    ],
    faqs: [
      {
        q: "Can I study in Dubai without IELTS?",
        a: "Many international campuses and pathway institutions in Dubai accept Medium of Instruction (MOI) letters or internal English tests.",
      },
      {
        q: "Are study gaps accepted for Dubai admissions?",
        a: "Yes, Dubai universities frequently accept legitimate study or work gaps when supported by experience letters or clear academic intent.",
      },
    ],
  },
};

export const EVERGREEN_TOPICS = [
  {
    key: "evergreen-uk-28-day-fund-rule",
    countryKey: "uk",
    title: "UK Student Visa 28-Day Financial Rule: Mistakes That Cause Refusals",
    desc: "Avoid last-minute UKVI refusals by understanding exact 28-day bank statement seasoning, acceptable banks, and loan letter formatting.",
    tag: "UK VISA",
    color: "blue",
  },
  {
    key: "evergreen-canada-pal-and-sop-guide",
    countryKey: "canada",
    title: "Canada Study Permit 2026: Aligning PAL, GIC, and SOP for First-Time Approval",
    desc: "Learn how Canadian visa officers verify Provincial Attestation Letters, GIC funding, and career progression in your SOP.",
    tag: "CANADA VISA",
    color: "red",
  },
  {
    key: "evergreen-germany-aps-timeline",
    countryKey: "germany",
    title: "Germany APS Certificate Timeline: When Indian Students Must Apply",
    desc: "A step-by-step timeline for APS verification, Uni-Assist deadlines, and Sperrkonto setup so you never miss a German intake.",
    tag: "GERMANY GUIDE",
    color: "emerald",
  },
  {
    key: "evergreen-australia-gs-statement-answers",
    countryKey: "australia",
    title: "How to Answer Australia's Genuine Student (GS) Questions Effectively",
    desc: "Understand what Australian case officers look for in the GS questions and how to back up your claims with documents.",
    tag: "AUSTRALIA VISA",
    color: "emerald",
  },
  {
    key: "evergreen-usa-f1-interview-214b",
    countryKey: "usa",
    title: "How to Overcome Section 214(b) Risk in Your USA F-1 Visa Interview",
    desc: "Practical framing tips to demonstrate university fit, financial clarity, and strong home ties during your 2-minute US visa interview.",
    tag: "USA VISA",
    color: "indigo",
  },
  {
    key: "evergreen-ielts-writing-task-2-band-7",
    countryKey: "ielts",
    title: "IELTS Writing Task 2: How to Jump from Band 6.0 to 7.5",
    desc: "Fix the four hidden scoring bottlenecks in Task Response, Coherence, Lexical Resource, and Grammatical Accuracy.",
    tag: "TEST PREP",
    color: "blue",
  },
  {
    key: "evergreen-ireland-stamp-2-budget",
    countryKey: "ireland",
    title: "Studying in Ireland from India: Tuition, Living Costs, and Stamp 2 Checklist",
    desc: "Complete cost breakdown and financial documentation guide for Indian Master's applicants targeting Dublin, Cork, and Galway.",
    tag: "IRELAND STUDY",
    color: "cyan",
  },
  {
    key: "evergreen-new-zealand-fts-guide",
    countryKey: "new-zealand",
    title: "New Zealand Student Visa: How the Funds Transfer Scheme (FTS) Boosts Approval",
    desc: "See how NZ's Funds Transfer Scheme works, what documents sponsors need, and how post-study work rights apply.",
    tag: "NZ STUDY",
    color: "amber",
  },
  {
    key: "evergreen-europe-apostille-checklist",
    countryKey: "europe",
    title: "Europe Study Visa Document Legalization & MEA Apostille Guide for Indians",
    desc: "Don't let unverified transcripts delay your Type D visa—learn the exact sequence for university attestation and MEA apostille.",
    tag: "EUROPE STUDY",
    color: "purple",
  },
  {
    key: "evergreen-dubai-uk-degree-transfer",
    countryKey: "dubai",
    title: "Study in Dubai for UK & Australian Degrees at Half the Cost",
    desc: "Explore accredited international branch campuses in Dubai offering credit transfers, flexible gaps, and streamlined UAE student visas.",
    tag: "DUBAI STUDY",
    color: "rose",
  },
  {
    key: "evergreen-study-gap-justification",
    countryKey: "uk",
    title: "How to Justify a 2-to-5 Year Study Gap for UK, Canada & Australia Visas",
    desc: "Learn which employment, freelance, or exam proofs legally satisfy embassy officers when you have a gap after 12th or graduation.",
    tag: "VISA GUIDES",
    color: "purple",
  },
  {
    key: "evergreen-education-loan-vs-savings",
    countryKey: "canada",
    title: "Education Loan vs. Bank Savings: Which Financial Proof Wins Faster Visa Approvals?",
    desc: "Compare collateral loans, non-collateral NBFC loans, FDs, and seasoned savings across UK, Canada, USA, Germany, and Australia.",
    tag: "FINANCE",
    color: "indigo",
  },
  {
    key: "evergreen-visa-refusal-refile-audit",
    countryKey: "usa",
    title: "Got a Student Visa Refusal? 5-Step Audit Before Re-Applying",
    desc: "Why re-filing immediately with the same paperwork fails—and how GCMS/refusal-letter audits turn rejections into approvals.",
    tag: "REFUSAL HELP",
    color: "red",
  },
  {
    key: "evergreen-september-vs-january-intake",
    countryKey: "uk",
    title: "September vs. January Intake Abroad: Which One Gives Higher Scholarships & Jobs?",
    desc: "Compare course availability, competition levels, internship timelines, and visa turnaround between Fall and Winter intakes.",
    tag: "INTAKE ALERTS",
    color: "amber",
  },
  {
    key: "evergreen-germany-chancenkarte-career",
    countryKey: "germany",
    title: "Germany Opportunity Card (Chancenkarte) After Indian Degree: Complete Roadmap",
    desc: "Check ANABIN recognition, 6-point eligibility scoring, blocked account rules, and how to convert Chancenkarte to an EU Blue Card.",
    tag: "GERMANY CARD",
    color: "emerald",
  },
  {
    key: "evergreen-pte-vs-ielts-2026",
    countryKey: "ielts",
    title: "IELTS vs. PTE Academic: Which Test Should You Pick for Your Target Country?",
    desc: "Compare scoring speed, speaking evaluation, and country-by-country visa acceptance for Canada, Australia, UK, and New Zealand.",
    tag: "TEST PREP",
    color: "blue",
  },
];
