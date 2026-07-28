import { getSupabaseAdmin } from './supabase';

export interface CountryRule {
  code: string;
  country_name: string;
  allowed_tests: string[]; // e.g. ["IELTS", "PTE", "TOEFL", "DUOLINGO", "MOI", "GERMAN"]
  moi_status: 'accepted' | 'conditional' | 'not_accepted';
  moi_policy_note: string;
  min_ug_ielts: number;
  min_pg_ielts: number;
  transparency_note: string;
}

export const DEFAULT_COUNTRY_RULES: Record<string, CountryRule> = {
  uk: {
    code: "uk",
    country_name: "United Kingdom",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "DUOLINGO", "MOI"],
    moi_status: "accepted",
    moi_policy_note: "Accepted by select UK universities if student scored 70%+ in High School English or holds an English-medium degree.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "UK universities widely accept IELTS, PTE, Duolingo, and MOI waiver certificates for eligible boards (CBSE/ICSE/State boards with 70%+)."
  },
  us: {
    code: "us",
    country_name: "USA",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "DUOLINGO"],
    moi_status: "not_accepted",
    moi_policy_note: "Direct admission to US universities & F-1 visa approval strictly require standardized English test scores (TOEFL / IELTS / Duolingo / PTE).",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "US universities do not accept MOI for direct degree entry. Standardized tests (TOEFL/IELTS/Duolingo) are mandatory."
  },
  ca: {
    code: "ca",
    country_name: "Canada",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "DUOLINGO"],
    moi_status: "not_accepted",
    moi_policy_note: "IRCC study permit and Canadian DLI universities require official IELTS Academic (min 6.0) or PTE Academic scores.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "Canada SDS and University admissions require official IELTS Academic or PTE Academic. MOI is not accepted for study permits."
  },
  au: {
    code: "au",
    country_name: "Australia",
    allowed_tests: ["IELTS", "PTE", "TOEFL"],
    moi_status: "not_accepted",
    moi_policy_note: "Australian Department of Home Affairs requires official IELTS or PTE score reports for student visa processing.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "Australia strictly requires IELTS (6.0+ UG, 6.5+ PG) or PTE Academic (50+ UG, 58+ PG). MOI waiver is not accepted for visas."
  },
  de: {
    code: "de",
    country_name: "Germany",
    allowed_tests: ["IELTS", "TOEFL", "PTE", "GERMAN"],
    moi_status: "conditional",
    moi_policy_note: "German public universities require official English test scores (IELTS/TOEFL) for English-taught degrees, or Goethe/TestDaF for German programs.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "German English-taught degrees require IELTS (6.5+) or TOEFL iBT (80+). German-taught programs require Goethe B2/C1 certificates."
  },
  nz: {
    code: "nz",
    country_name: "New Zealand",
    allowed_tests: ["IELTS", "PTE", "TOEFL"],
    moi_status: "not_accepted",
    moi_policy_note: "NZQA and New Zealand universities require formal IELTS Academic (6.0+) or PTE score reports.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "New Zealand universities require official IELTS Academic or PTE Academic. MOI is not accepted."
  },
  ie: {
    code: "ie",
    country_name: "Ireland",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "DUOLINGO", "MOI"],
    moi_status: "conditional",
    moi_policy_note: "Irish universities accept IELTS, PTE, and Duolingo. Select institutes accept MOI if secondary education was in English.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "Ireland accepts IELTS, PTE Academic, and Duolingo. MOI is accepted conditionally by specific partner universities."
  },
  sg: {
    code: "sg",
    country_name: "Singapore",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "MOI"],
    moi_status: "conditional",
    moi_policy_note: "Singapore universities evaluate medium of instruction for Indian boards or require IELTS/TOEFL.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "Singapore universities accept official IELTS/TOEFL scores. MOI is accepted for select recognized Indian English-medium curricula."
  },
  ch: {
    code: "ch",
    country_name: "Switzerland",
    allowed_tests: ["IELTS", "TOEFL", "PTE"],
    moi_status: "not_accepted",
    moi_policy_note: "Swiss universities require official IELTS or TOEFL score reports for English-taught master & hospitality degrees.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "Swiss universities require official IELTS or TOEFL test reports."
  },
  my: {
    code: "my",
    country_name: "Malaysia",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "MOI"],
    moi_status: "accepted",
    moi_policy_note: "Malaysian universities widely accept MOI certificates from English-medium schools and degrees.",
    min_ug_ielts: 5.5,
    min_pg_ielts: 6.0,
    transparency_note: "Malaysia widely accepts Medium of Instruction (MOI) certificates as well as IELTS, PTE, and TOEFL."
  },
  ae: {
    code: "ae",
    country_name: "Dubai",
    allowed_tests: ["IELTS", "PTE", "TOEFL", "DUOLINGO", "MOI"],
    moi_status: "accepted",
    moi_policy_note: "Dubai branch campuses accept MOI certificates or standard English test scores.",
    min_ug_ielts: 5.5,
    min_pg_ielts: 6.0,
    transparency_note: "Dubai branch campuses (UK/US/Australian universities in Dubai) accept MOI, IELTS, PTE, and Duolingo."
  },
  eu: {
    code: "eu",
    country_name: "Europe",
    allowed_tests: ["IELTS", "TOEFL", "PTE", "DUOLINGO", "MOI"],
    moi_status: "conditional",
    moi_policy_note: "European universities accept IELTS, TOEFL, PTE, and MOI depending on host country and institution.",
    min_ug_ielts: 6.0,
    min_pg_ielts: 6.5,
    transparency_note: "European study options support multiple language proofs. Check university specific rules."
  }
};

// Convert non-IELTS scores to equivalent IELTS Band for university threshold evaluation
export function convertToIeltsEquivalency(testType: string, scoreStr: string): number {
  const val = parseFloat(scoreStr);
  if (isNaN(val) || val <= 0) return 0;

  switch (testType.toUpperCase()) {
    case 'IELTS':
      return val;
    case 'PTE':
      if (val >= 79) return 8.0;
      if (val >= 73) return 7.5;
      if (val >= 65) return 7.0;
      if (val >= 58) return 6.5;
      if (val >= 50) return 6.0;
      if (val >= 42) return 5.5;
      if (val >= 36) return 5.0;
      return 4.5;
    case 'TOEFL':
      if (val >= 110) return 8.0;
      if (val >= 100) return 7.5;
      if (val >= 94) return 7.0;
      if (val >= 79) return 6.5;
      if (val >= 60) return 6.0;
      if (val >= 46) return 5.5;
      return 5.0;
    case 'DUOLINGO':
    case 'DET':
      if (val >= 140) return 8.0;
      if (val >= 130) return 7.5;
      if (val >= 120) return 7.0;
      if (val >= 110) return 6.5;
      if (val >= 100) return 6.0;
      if (val >= 90) return 5.5;
      return 5.0;
    case 'GERMAN':
      // German level (B2/C1)
      return 6.5;
    case 'MOI':
      return 6.5;
    default:
      return val <= 9 ? val : 6.0;
  }
}
