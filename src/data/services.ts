import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  detailedContent: string[];
}

export const SERVICES: Service[] = [
  {
    id: "counselling",
    title: "Expert Counselling",
    desc: "Personalized profiling session matching you with elite institutions based on GPA, GRE scores, and aspirations.",
    icon: "User",
    color: "text-slate-800 bg-accent-blue/5",
    detailedContent: [
      "1-on-1 profiling session with senior study abroad consultants.",
      "Detailed analysis of GPA, academic history, test scores, and research publications.",
      "Personalized country, course, and university shortlisting targeting Reach, Match, and Safe options.",
      "Career path mapping and guidance on post-graduation work opportunities."
    ]
  },
  {
    id: "admission",
    title: "University Admission Process",
    desc: "Algorithmic screening of DLI/SEVIS lists, managing direct application filings, and coordinating school offers.",
    icon: "GraduationCap",
    color: "text-accent-indigo bg-accent-indigo/5",
    detailedContent: [
      "End-to-end management of university application portals and fee waivers.",
      "Rigorous verification of application packets, including transcripts and credentials.",
      "Direct liaison with university admission offices to expedite application processing.",
      "Dedicated support for responding to and accepting offer letters (CAS/i-20 request processing)."
    ]
  },
  {
    id: "sop",
    title: "SOP & Documentation",
    desc: "Expert structural auditing of your Statement of Purpose (SOP), Letters of Recommendation (LORs), and CVs.",
    icon: "FileText",
    color: "text-highlight-purple bg-highlight-purple/5",
    detailedContent: [
      "Comprehensive review and structural auditing of Statements of Purpose (SOPs).",
      "Guidance and templates for drafting professional Letters of Recommendation (LORs).",
      "Resume and CV optimization to highlight academic achievements, projects, and internships.",
      "Strict alignment check with country-specific student visa statement requirements."
    ]
  },
  {
    id: "scholarships",
    title: "Scholarship Guidance",
    desc: "Automated analysis of merit grants, assistantships, and tuition waivers, yielding maximum funding support.",
    icon: "Award",
    color: "text-accent-cyan bg-accent-cyan/5",
    detailedContent: [
      "Access to an updated database of institutional, governmental, and external scholarships.",
      "Assistance with application documentation for merit-based and need-based financial aid.",
      "Coaching on scholarship essay writing to maximize your chances of winning funding.",
      "Strategies to secure Graduate Assistantships (TA/RA) and tuition fee waivers."
    ]
  },
  {
    id: "testprep",
    title: "Test Prep & Coaching",
    desc: "Coaching modules for IELTS, TOEFL, and GRE exams using diagnostic tools to score above standard thresholds.",
    icon: "BookOpen",
    color: "text-slate-800 bg-accent-blue/5",
    detailedContent: [
      "Highly structured prep classes led by certified, experienced educators.",
      "Diagnostic mock tests simulating actual exam conditions with detailed score analysis.",
      "Customized drills for Listening, Reading, Writing, Speaking, and Quantitative sections.",
      "Exclusive preparation material, grammar guides, and vocabulary building tools."
    ]
  },
  {
    id: "visa",
    title: "Expert Visa Assistance",
    desc: "Complete documentation audits, biometrics scheduling, and predictive checkup tools checking visa success SLA.",
    icon: "Briefcase",
    color: "text-accent-indigo bg-accent-indigo/5",
    detailedContent: [
      "Step-by-step guidance on student visa filings (e.g., US F-1, UK Student Visa, Canada Study Permit).",
      "Comprehensive review of financial documents, sponsor affidavits, and fund source declarations.",
      "Interactive mock visa interview sessions to build confidence and refine responses.",
      "Pre-checking documentation against the latest immigration and visa compliance laws."
    ]
  },
  {
    id: "insurance",
    title: "Health Insurance",
    desc: "Compliance checks for regional health coverages like OSHC (Australia) and provincial plans (Canada/Germany).",
    icon: "Heart",
    color: "text-highlight-purple bg-highlight-purple/5",
    detailedContent: [
      "Sourcing and comparison of mandatory student health covers (e.g., OSHC, German statutory insurance).",
      "Tailored plans balancing premium costs, deductible limits, and coverage scopes.",
      "Fast-tracked policy registration and digital insurance card issuance.",
      "Detailed briefings on claims filing, medical networks, and student health support."
    ]
  },
  {
    id: "financial",
    title: "Financial Guidance & Loans",
    desc: "Integration with banking partners to verify blocked accounts and structure pre-approved educational loans.",
    icon: "Landmark",
    color: "text-accent-cyan bg-accent-cyan/5",
    detailedContent: [
      "Tie-ups with leading banks for collateral-free and collateral-based educational loans.",
      "Streamlined processing of blocked accounts required for Germany and Canada.",
      "Assistance in structuring financial declarations, sponsor letters, and liquid asset proofs.",
      "Preferential forex exchange rates for tuition fee transfers and international drafts."
    ]
  },
  {
    id: "accommodation",
    title: "Accommodation Assistance",
    desc: "Coordination of on-campus residence bookings and regional housing partners close to target university campuses.",
    icon: "Home",
    color: "text-slate-800 bg-accent-blue/5",
    detailedContent: [
      "Guidance on securing on-campus dormitories and university residences.",
      "Access to verified off-campus student housing partners, studios, and shared apartments.",
      "Support in reviewing tenancy agreements, rental terms, and deposit payment structures.",
      "Connections with student community networks for roommate matching and local navigation."
    ]
  },
  {
    id: "departure",
    title: "Pre & Post Departure Services",
    desc: "Pre-departure briefings, biometrics support, flight options matching, and airport landing assistance.",
    icon: "Plane",
    color: "text-accent-indigo bg-accent-indigo/5",
    detailedContent: [
      "Comprehensive pre-departure orientations detailing lifestyle, compliance, and academic norms.",
      "Guidelines on currency, international SIM cards, packing essentials, and customs regulations.",
      "Assistance with airport pick-up scheduling and booking temporary stays.",
      "Post-arrival setup support including local bank accounts, transport passes, and student IDs."
    ]
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(s => s.id === slug);
}
