import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Award, Globe, Phone, Mail, User, 
  ArrowRight, ArrowLeft, Loader2, Star, MapPin, Sparkles, AlertCircle, X, ShieldCheck, Check, Info
} from "lucide-react";

interface University {
  id: number;
  name: string;
  country: string;
  code: string;
  min_cgpa_percent: string;
  
  // Backward compatibility fields
  tuition_fees?: string | null;
  intake?: string | null;
  ielts_pte_req?: string | null;
  moi_accepted?: string | null;
  courses?: string | null;
  photo?: string | null;
  ug_fees?: string | null;
  pg_fees?: string | null;
  ug_ielts_pte_req?: string | null;
  pg_ielts_pte_req?: string | null;
  ug_moi_accepted?: string | null;
  pg_moi_accepted?: string | null;
  ug_intake?: string | null;
  pg_intake?: string | null;

  // New schema fields
  image_url?: string | null;
  ug_tuition_fees?: string | null;
  ug_intakes?: string | null;
  ug_ielts_pte?: string | null;
  ug_moi?: string | null;
  ug_courses?: string | null;
  pg_tuition_fees?: string | null;
  pg_intakes?: string | null;
  pg_ielts_pte?: string | null;
  pg_moi?: string | null;
  pg_courses?: string | null;
}

const countriesList = [
  { code: "us", name: "USA" },
  { code: "uk", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "de", name: "Germany" },
  { code: "nz", name: "New Zealand" },
  { code: "ie", name: "Ireland" },
  { code: "sg", name: "Singapore" },
  { code: "ch", name: "Switzerland" },
  { code: "my", name: "Malaysia" },
  { code: "ae", name: "Dubai" },
  { code: "eu", name: "Europe" }
];

const countryLabels: Record<string, string> = {
  us: "USA", uk: "United Kingdom", ca: "Canada", au: "Australia",
  de: "Germany", nz: "New Zealand", ie: "Ireland", sg: "Singapore",
  ch: "Switzerland", my: "Malaysia", ae: "Dubai", eu: "Europe",
};

const universityDomainMap: Record<string, string> = {
  "Stanford University": "stanford.edu",
  "Massachusetts Institute of Technology": "mit.edu",
  "Harvard University": "harvard.edu",
  "University of California, Berkeley": "berkeley.edu",
  "California Institute of Technology": "caltech.edu",
  "University of Oxford": "ox.ac.uk",
  "University of Cambridge": "cam.ac.uk",
  "Imperial College London": "imperial.ac.uk",
  "London School of Economics": "lse.ac.uk",
  "UCL": "ucl.ac.uk",
  "Leeds Beckett University": "leedsbeckett.ac.uk",
  "London Metropolitan University": "londonmet.ac.uk",
  "University of East London": "uel.ac.uk",
  "University of Wales Trinity Saint David": "uwtsd.ac.uk",
  "University of Hertfordshire": "herts.ac.uk",
  "University of West London": "uwl.ac.uk",
  "University of Hull": "hull.ac.uk",
  "University of Bedfordshire": "beds.ac.uk",
  "Birmingham City University": "bcu.ac.uk",
  "Brunel University of London": "brunel.ac.uk",
  "Glasgow Caledonian University": "gcu.ac.uk",
  "London South Bank University": "lsbu.ac.uk",
  "Nottingham Trent University": "ntu.ac.uk",
  "University of Essex": "essex.ac.uk",
  "University of Central Lancashire (UCLan)": "uclan.ac.uk",
  "University of Lincoln": "lincoln.ac.uk",
  "University of Wolverhampton": "wlv.ac.uk",
  "De Montfort University": "dmu.ac.uk",
  "University of Bradford": "bradford.ac.uk",
  "Arden University": "arden.ac.uk",
  "University of Greenwich": "gre.ac.uk",
  "Coventry University": "coventry.ac.uk",
  "Anglia Ruskin University": "aru.ac.uk",
  "Ravensbourne University London": "ravensbourne.ac.uk",
  "Edinburgh Napier University": "napier.ac.uk",
  "University of East Anglia": "uea.ac.uk",
  "University of York": "york.ac.uk",
  "University of Gloucestershire": "glos.ac.uk",
  "University of Sunderland": "sunderland.ac.uk",
  "University of Leicester": "le.ac.uk",
  "Teesside University": "tees.ac.uk",
  "Regent College London": "rcl.ac.uk",
  "University of Chester": "chester.ac.uk",
  "University of the West of Scotland": "uws.ac.uk",
  "University of Northampton": "northampton.ac.uk",
  "Swansea University": "swansea.ac.uk",
  "Southampton Solent University": "solent.ac.uk",
  "Aston University": "aston.ac.uk",
  "University of Roehampton": "roehampton.ac.uk",
  "Buckinghamshire New University": "bucks.ac.uk",
  "Northumbria University": "northumbria.ac.uk",
  "Royal Holloway, University of London": "royalholloway.ac.uk",
  "Middlesex University": "mdx.ac.uk",
  "Ulster University": "ulster.ac.uk",
  "University of Huddersfield": "hud.ac.uk",
  "The University of Law": "law.ac.uk",
  "University of Toronto": "utoronto.ca",
  "University of Waterloo": "uwaterloo.ca",
  "University of British Columbia": "ubc.ca",
  "McGill University": "mcgill.ca",
  "University of Alberta": "ualberta.ca",
  "University of Melbourne": "unimelb.edu.au",
  "University of Sydney": "sydney.edu.au",
  "Australian National University": "anu.edu.au",
  "UNSW Sydney": "unsw.edu.au",
  "Monash University": "monash.edu",
  "Technical University of Munich": "tum.de",
  "Heidelberg University": "uni-heidelberg.de",
  "RWTH Aachen University": "rwth-aachen.de",
  "LMU Munich": "lmu.de",
  "Karlsruhe Institute of Technology": "kit.edu",
  "University of Auckland": "auckland.ac.nz",
  "University of Otago": "otago.ac.nz",
  "Victoria University of Wellington": "wgtn.ac.nz",
  "Trinity College Dublin": "tcd.ie",
  "University College Dublin": "ucd.ie",
  "University of Galway": "universityofgalway.ie",
  "National University of Singapore": "nus.edu.sg",
  "Nanyang Technological University": "ntu.edu.sg",
  "ETH Zurich": "ethz.ch",
  "EPFL": "epfl.ch",
  "University of Zurich": "uzh.ch",
  "University of Malaya": "um.edu.my",
  "Universiti Kebangsaan Malaysia": "ukm.edu.my",
  "Universiti Sains Malaysia": "usm.my",
  "University of Dubai": "ud.ac.ae",
  "Khalifa University": "ku.ac.ae",
  "University of Amsterdam": "uva.nl",
  "Delft University of Technology": "tudelft.nl",
  "University of Copenhagen": "ku.dk"
};

function resolveUniversityDomain(name: string): string {
  if (universityDomainMap[name]) {
    return universityDomainMap[name];
  }
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return clean.split(/\s+/).slice(0, 2).join("") + ".edu";
}

function UniversityLogo({ domain, name }: { domain: string; name: string }) {
  const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${domain}`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`);
      setHasError(true);
    } else {
      setImgSrc("");
    }
  };

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${name} logo`}
        className="w-full h-full object-contain p-2"
        onError={handleError}
      />
    );
  }

  return (
    <span className="text-lg font-bold text-accent-blue font-display">
      {name.charAt(0)}
    </span>
  );
}

// Requirements Parsing Helpers
function parseMinScore(reqStr: string | null | undefined): number {
  if (!reqStr) return 0;
  const percentMatch = reqStr.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return parseFloat(percentMatch[1]);
  
  const cgpaMatch = reqStr.match(/(\d+(?:\.\d+)?)\s*(?:CGPA|GPA)/i);
  if (cgpaMatch) return parseFloat(cgpaMatch[1]) * 10;
  
  const numMatch = reqStr.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    return val <= 10 ? val * 10 : val;
  }
  return 0;
}

function parseIelts(reqStr: string | null | undefined): number {
  if (!reqStr) return 0;
  const match = reqStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function parsePte(reqStr: string | null | undefined): number {
  if (!reqStr) return 0;
  const match = reqStr.match(/PTE\s*(\d+)/i);
  if (match) return parseInt(match[1], 10);
  
  const ieltsVal = parseIelts(reqStr);
  if (ieltsVal <= 5.0) return 36;
  if (ieltsVal <= 5.5) return 42;
  if (ieltsVal <= 6.0) return 50;
  if (ieltsVal <= 6.5) return 58;
  if (ieltsVal <= 7.0) return 65;
  if (ieltsVal <= 7.5) return 73;
  return 80;
}

export default function EligibilityForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'UG' | 'PG' | null>(null);
  const [englishType, setEnglishType] = useState<'MOI' | 'IELTS' | null>(null);
  const [englishScoreType, setEnglishScoreType] = useState<'IELTS' | 'PTE'>('IELTS');
  const [englishScore, setEnglishScore] = useState<string>("");
  const [isCgpa, setIsCgpa] = useState<boolean>(false);
  const [academicScore, setAcademicScore] = useState<string>("");
  
  // Lead Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Results
  const [matchingUnis, setMatchingUnis] = useState<University[]>([]);
  const [reachUnis, setReachUnis] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  useEffect(() => {
    if (selectedUniversity) {
      document.body.style.overflow = "hidden";
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = "";
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      (window as any).lenis?.start();
    };
  }, [selectedUniversity]);

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(code);
    setTimeout(() => setStep(2), 250);
  };

  const handleLevelSelect = (level: 'UG' | 'PG') => {
    setSelectedLevel(level);
    setTimeout(() => setStep(3), 250);
  };

  const handleEnglishSelect = (type: 'MOI' | 'IELTS') => {
    setEnglishType(type);
    setTimeout(() => setStep(4), 250);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleScoresSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseFloat(academicScore);
    if (isNaN(scoreVal) || scoreVal <= 0) return;
    
    if (englishType === 'IELTS') {
      const engVal = parseFloat(englishScore);
      if (isNaN(engVal) || engVal <= 0) return;
    }
    
    setStep(5);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phone.replace(/[^\d]/g, "");
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      alert("Please enter a valid phone number (between 8 and 15 digits).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Fetch universities for the selected country
      const uniRes = await fetch(`/api/universities?country=${selectedCountry}`);
      if (!uniRes.ok) throw new Error("Failed to load universities");
      const universities: University[] = await uniRes.json();

      // 2. Submit lead details to backend eligibility route
      const leadBody = {
        name,
        email,
        phone,
        score: academicScore,
        ielts: englishType === 'MOI' ? "0" : englishScore,
        budget: "30",
        destination: selectedCountry
      };
      
      const elRes = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadBody)
      });
      const elData = await elRes.json();
      if (!elRes.ok || !elData.success) {
        throw new Error(elData.error || elData.message || "Failed to submit eligibility profile");
      }

      // 3. Client-side evaluation
      const parsedUserScore = isCgpa ? parseFloat(academicScore) * 10 : parseFloat(academicScore);
      const parsedUserEngScore = parseFloat(englishScore) || 0;

      const directMatches: University[] = [];
      const reachMatches: University[] = [];

      universities.forEach(uni => {
        const minReqScore = parseMinScore(uni.min_cgpa_percent);
        const academicMatchesDirect = parsedUserScore >= minReqScore;
        const academicMatchesReach = parsedUserScore >= (minReqScore - 10);

        let englishMatchesDirect = false;
        let englishMatchesReach = false;

        if (englishType === 'MOI') {
          // Verify if MOI is accepted for selected level
          const moiStr = selectedLevel === 'UG'
            ? (uni.ug_moi || uni.ug_moi_accepted || uni.moi_accepted || "")
            : (uni.pg_moi || uni.pg_moi_accepted || uni.moi_accepted || "")
          const acceptsMoi = moiStr.toLowerCase() === "yes";
          
          englishMatchesDirect = acceptsMoi;
          englishMatchesReach = acceptsMoi;
        } else {
          // IELTS/PTE
          const reqStr = selectedLevel === 'UG'
            ? (uni.ug_ielts_pte || uni.ug_ielts_pte_req || uni.ielts_pte_req || "")
            : (uni.pg_ielts_pte || uni.pg_ielts_pte_req || uni.ielts_pte_req || "")
          
          if (englishScoreType === 'IELTS') {
            const reqIelts = parseIelts(reqStr);
            englishMatchesDirect = parsedUserEngScore >= reqIelts;
            englishMatchesReach = parsedUserEngScore >= (reqIelts - 0.5);
          } else {
            const reqPte = parsePte(reqStr);
            englishMatchesDirect = parsedUserEngScore >= reqPte;
            englishMatchesReach = parsedUserEngScore >= (reqPte - 5);
          }
        }

        if (academicMatchesDirect && englishMatchesDirect) {
          directMatches.push(uni);
        } else if (academicMatchesReach && englishMatchesReach) {
          reachMatches.push(uni);
        }
      });

      setMatchingUnis(directMatches);
      setReachUnis(reachMatches);
      setStep(6);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCountry(null);
    setSelectedLevel(null);
    setEnglishType(null);
    setEnglishScore("");
    setAcademicScore("");
    setMatchingUnis([]);
    setReachUnis([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[500px]">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: CHOOSE DESTINATION COUNTRY */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Step 1 of 5</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">Choose Your Study Destination</h2>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-sans mb-8">
              Select your target country to search for admissions matching your eligibility constraints.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {countriesList.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountrySelect(c.code)}
                  className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 text-center group hover:-translate-y-0.5 ${
                    selectedCountry === c.code 
                      ? "bg-accent-blue/10 border-accent-blue shadow-md"
                      : "bg-white border-slate-200 hover:border-accent-blue hover:shadow-md"
                  }`}
                >
                  <div className="relative w-16 h-11 rounded-lg overflow-hidden border border-slate-100 shadow-sm shrink-0">
                    <img
                      src={`https://flagcdn.com/w80/${c.code === "uk" ? "gb" : c.code}.png`}
                      alt={`${c.name} flag`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-bold text-slate-800 text-sm font-display group-hover:text-accent-blue transition-colors">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: CHOOSE STUDY LEVEL */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-sans">Step 2 of 5</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">Select Study Level</h2>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-sans mb-8">
              Are you looking for Undergraduate (Bachelors/Diplomas) or Postgraduate (Masters/MBA) studies?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => handleLevelSelect('UG')}
                className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 text-center group hover:-translate-y-1 ${
                  selectedLevel === 'UG'
                    ? "bg-indigo-50/50 border-indigo-500 shadow-md"
                    : "bg-white border-slate-200 hover:border-indigo-500 hover:shadow-lg"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg font-display">Undergraduate (UG)</h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">Bachelors, Diplomas, and Foundation courses</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLevelSelect('PG')}
                className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 text-center group hover:-translate-y-1 ${
                  selectedLevel === 'PG'
                    ? "bg-emerald-50/50 border-emerald-500 shadow-md"
                    : "bg-white border-slate-200 hover:border-emerald-500 hover:shadow-lg"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg font-display">Postgraduate (PG)</h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">Masters, MBA, and PhD courses</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ENGLISH PROFICIENCY WAIVER OR EXAM */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-sans">Step 3 of 5</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">English Proficiency Option</h2>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-sans mb-8">
              Select how you would like to prove your English language proficiency.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => handleEnglishSelect('MOI')}
                className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 text-center group hover:-translate-y-1 ${
                  englishType === 'MOI'
                    ? "bg-amber-50/50 border-amber-500 shadow-md"
                    : "bg-white border-slate-200 hover:border-amber-500 hover:shadow-lg"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg font-display">MOI Waiver Accepted</h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">Check universities accepting Medium of Instruction waiver certificate</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleEnglishSelect('IELTS')}
                className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 text-center group hover:-translate-y-1 ${
                  englishType === 'IELTS'
                    ? "bg-cyan-50/50 border-cyan-500 shadow-md"
                    : "bg-white border-slate-200 hover:border-cyan-500 hover:shadow-lg"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg font-display">IELTS / PTE Academic</h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">Input your overall test score to evaluate specific university thresholds</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: ENTER SCORES */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-sans">Step 4 of 5</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">Enter Your Scores</h2>
              </div>
            </div>

            <form onSubmit={handleScoresSubmit} className="space-y-6">
              
              {/* If English Exam selected, show exam scores */}
              {englishType === 'IELTS' && (
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans block">Select English Test & Score</label>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEnglishScoreType('IELTS'); setEnglishScore(""); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        englishScoreType === 'IELTS'
                          ? "bg-accent-blue text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      IELTS Academic
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEnglishScoreType('PTE'); setEnglishScore(""); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        englishScoreType === 'PTE'
                          ? "bg-accent-blue text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      PTE Academic
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="english-score" className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {englishScoreType === 'IELTS' ? "Overall IELTS Band Score (e.g. 6.5)" : "Overall PTE Academic Score (e.g. 58)"}
                    </label>
                    <input
                      id="english-score"
                      type="number"
                      step={englishScoreType === 'IELTS' ? "0.5" : "1"}
                      min={englishScoreType === 'IELTS' ? "4.0" : "10"}
                      max={englishScoreType === 'IELTS' ? "9.0" : "90"}
                      value={englishScore}
                      onChange={(e) => setEnglishScore(e.target.value)}
                      placeholder={englishScoreType === 'IELTS' ? "6.5" : "58"}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                </div>
              )}

              {/* Academic Score details */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans block">Academic Score</label>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsCgpa(false); setAcademicScore(""); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      !isCgpa
                        ? "bg-accent-blue text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCgpa(true); setAcademicScore(""); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      isCgpa
                        ? "bg-accent-blue text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    CGPA / GPA (10 pt)
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="academic-score" className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {!isCgpa ? "Academic Score Percentage (e.g. 75)" : "CGPA Score (e.g. 7.5)"}
                  </label>
                  <input
                    id="academic-score"
                    type="number"
                    step="0.01"
                    min="0"
                    max={!isCgpa ? "100" : "10"}
                    value={academicScore}
                    onChange={(e) => setAcademicScore(e.target.value)}
                    placeholder={!isCgpa ? "75" : "7.5"}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F08A00] hover:bg-[#C06E00] text-white font-bold text-sm rounded-full shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide"
              >
                <span>Continue to Contact Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </motion.div>
        )}

        {/* STEP 5: CAPTURE LEAD AND MATCH */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-sans">Step 5 of 5</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">Where should we send your matches?</h2>
              </div>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="lead-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="lead-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all font-sans"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="lead-email" className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="lead-email"
                    type="email"
                    required
                    placeholder="john.doe@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all font-sans"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label htmlFor="lead-phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    maxLength={15}
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 15))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all font-sans"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/3 py-3 rounded-full border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow py-3 bg-[#F08A00] hover:bg-[#C06E00] disabled:bg-[#F08A00]/60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Matching Profile...
                    </>
                  ) : (
                    <>
                      <span>Find Eligible Universities</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        )}

        {/* STEP 6: MATCH RESULTS DASHBOARD */}
        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="space-y-10 text-left"
          >
            {/* Header Result Summary Banner */}
            <div className="glass-card rounded-[2rem] p-8 bg-gradient-to-br from-[#E6F2F3] to-white border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 font-sans animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  Profile Matches Evaluated
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-800 tracking-tight leading-none">
                  Your Eligible Partner Universities
                </h2>
                <p className="text-sm text-slate-500 font-sans max-w-xl">
                  Matched for {selectedLevel === 'UG' ? 'Undergraduate' : 'Postgraduate'} programs in <strong className="text-slate-800">{countryLabels[selectedCountry || ""]}</strong> based on your academic score of <strong className="text-slate-800">{academicScore}{isCgpa ? " CGPA" : "%"}</strong> and English preference <strong className="text-slate-800">{englishType === 'MOI' ? "MOI Waiver" : `${englishScore} ${englishScoreType}`}</strong>.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-sm shrink-0 font-sans cursor-pointer hover:scale-[1.02]"
              >
                Re-calculate Profile
              </button>
            </div>

            {/* Direct matches list */}
            {matchingUnis.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-cyan fill-accent-cyan animate-pulse" />
                  <h3 className="text-lg font-bold font-display text-slate-800">Direct Admission Matches ({matchingUnis.length})</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingUnis.map(uni => {
                    const fees = selectedLevel === 'UG' 
                      ? (uni.ug_tuition_fees || uni.ug_fees || uni.tuition_fees || "N/A") 
                      : (uni.pg_tuition_fees || uni.pg_fees || "N/A");
                    const intake = selectedLevel === 'UG' 
                      ? (uni.ug_intakes || uni.ug_intake || uni.intake || "N/A") 
                      : (uni.pg_intakes || uni.pg_intake || "N/A");
                    const ielts = selectedLevel === 'UG' 
                      ? (uni.ug_ielts_pte || uni.ug_ielts_pte_req || uni.ielts_pte_req || "N/A") 
                      : (uni.pg_ielts_pte || uni.pg_ielts_pte_req || "N/A");
                    const moi = selectedLevel === 'UG' 
                      ? (uni.ug_moi || uni.ug_moi_accepted || uni.moi_accepted || "Yes") 
                      : (uni.pg_moi || uni.pg_moi_accepted || "Yes");
                    const courses = selectedLevel === 'UG' 
                      ? (uni.ug_courses || uni.courses || "") 
                      : (uni.pg_courses || "");

                    return (
                      <div key={uni.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full group">
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white p-1">
                                <UniversityLogo domain={resolveUniversityDomain(uni.name)} name={uni.name} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold font-display text-slate-800 leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">{uni.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <img
                                    src={`https://flagcdn.com/w20/${uni.code === "uk" ? "gb" : uni.code}.png`}
                                    alt="Flag"
                                    className="w-4 h-3 rounded-sm object-cover"
                                  />
                                  <span className="text-[11px] text-slate-500 font-sans truncate">{uni.country}</span>
                                </div>
                              </div>
                            </div>

                            {/* Requirements Grid */}
                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] font-sans text-slate-600 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Tuition Fees</span>
                                <span className="font-bold text-slate-700 truncate block">{fees}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Intake</span>
                                <span className="font-bold text-slate-700 truncate block">{intake}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Min Score</span>
                                <span className="font-bold text-slate-700 truncate block">{uni.min_cgpa_percent}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">MOI Waiver</span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold mt-0.5 ${
                                  moi.toLowerCase() === "yes" 
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                                }`}>
                                  {moi}
                                </span>
                              </div>
                              <div className="col-span-2 border-t border-slate-100 pt-2">
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">English Limit</span>
                                <span className="font-bold text-slate-700 block whitespace-normal truncate">{ielts}</span>
                              </div>
                            </div>

                            {courses && (
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide mb-1">Key Courses</span>
                                <div className="flex flex-wrap gap-1">
                                  {courses.split(",").slice(0, 3).map((c, i) => (
                                    <span key={i} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                      {c.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedUniversity(uni)}
                              className="text-xs font-semibold text-accent-blue hover:underline inline-flex items-center gap-1 font-sans bg-transparent border-0 p-0 cursor-pointer"
                            >
                              View details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Empty matched state
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-10 text-center space-y-4 max-w-xl mx-auto font-sans">
                <AlertCircle className="w-16 h-16 text-[#F08A00] mx-auto animate-pulse" />
                <h3 className="text-xl font-bold font-display text-slate-700">No Direct Matches Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find partner universities matching your exact scores or waivers in this destination. Check our reach recommendations below or consult with our advisors.
                </p>
              </div>
            )}

            {/* Reach matches list */}
            {reachUnis.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-blue animate-pulse" />
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-800">Reach Recommendations ({reachUnis.length})</h3>
                    <p className="text-[11px] text-slate-400 font-sans">These universities are slightly above your score or require minor test modifications, offering premium options.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
                  {reachUnis.map(uni => {
                    const fees = selectedLevel === 'UG' 
                      ? (uni.ug_tuition_fees || uni.ug_fees || uni.tuition_fees || "N/A") 
                      : (uni.pg_tuition_fees || uni.pg_fees || "N/A");
                    const intake = selectedLevel === 'UG' 
                      ? (uni.ug_intakes || uni.ug_intake || uni.intake || "N/A") 
                      : (uni.pg_intakes || uni.pg_intake || "N/A");
                    const ielts = selectedLevel === 'UG' 
                      ? (uni.ug_ielts_pte || uni.ug_ielts_pte_req || uni.ielts_pte_req || "N/A") 
                      : (uni.pg_ielts_pte || uni.pg_ielts_pte_req || "N/A");
                    const moi = selectedLevel === 'UG' 
                      ? (uni.ug_moi || uni.ug_moi_accepted || uni.moi_accepted || "Yes") 
                      : (uni.pg_moi || uni.pg_moi_accepted || "Yes");
                    const courses = selectedLevel === 'UG' 
                      ? (uni.ug_courses || uni.courses || "") 
                      : (uni.pg_courses || "");

                    return (
                      <div key={uni.id} className="rounded-3xl border border-slate-200 bg-amber-50/10 shadow-xs flex flex-col h-full group">
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white p-1">
                                <UniversityLogo domain={resolveUniversityDomain(uni.name)} name={uni.name} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold font-display text-slate-800 leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">{uni.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <img
                                    src={`https://flagcdn.com/w20/${uni.code === "uk" ? "gb" : uni.code}.png`}
                                    alt="Flag"
                                    className="w-4 h-3 rounded-sm object-cover"
                                  />
                                  <span className="text-[11px] text-slate-500 font-sans truncate">{uni.country}</span>
                                </div>
                              </div>
                            </div>

                            {/* Requirements Grid */}
                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] font-sans text-slate-600 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Tuition Fees</span>
                                <span className="font-bold text-slate-700 truncate block">{fees}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Intake</span>
                                <span className="font-bold text-slate-700 truncate block">{intake}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Min Score</span>
                                <span className="font-bold text-slate-700 truncate block">{uni.min_cgpa_percent}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">MOI Waiver</span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold mt-0.5 ${
                                  moi.toLowerCase() === "yes" 
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                    : "bg-rose-50 text-rose-600 border border-rose-100"
                                }`}>
                                  {moi}
                                </span>
                              </div>
                              <div className="col-span-2 border-t border-slate-100 pt-2">
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">English Limit</span>
                                <span className="font-bold text-slate-700 block whitespace-normal truncate">{ielts}</span>
                              </div>
                            </div>

                            {courses && (
                              <div>
                                <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide mb-1">Key Courses</span>
                                <div className="flex flex-wrap gap-1">
                                  {courses.split(",").slice(0, 3).map((c, i) => (
                                    <span key={i} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                      {c.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedUniversity(uni)}
                              className="text-xs font-semibold text-accent-blue hover:underline inline-flex items-center gap-1 font-sans bg-transparent border-0 p-0 cursor-pointer"
                            >
                              View details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Final CTA Banner */}
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 shadow-lg text-center text-white relative overflow-hidden font-sans">
              <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-accent-blue/10 to-transparent pointer-events-none"></div>
              <div className="space-y-4 relative z-10">
                <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight leading-tight">
                  Unlock your global pathway with personalized guidance
                </h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                  Every application has unique opportunities. Our expert counsellors help students secure visa approvals, negotiate scholarships, and compile stellar profiles.
                </p>
                <button
                  onClick={() => (window as any).openCounsellorForm?.()}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#F08A00] hover:bg-[#C06E00] text-white font-semibold text-sm rounded-full shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] font-sans"
                >
                  Speak to Our Counsellor <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* University Detail Modal Overlay */}
      {selectedUniversity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" data-lenis-prevent>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal close */}
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100/85 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer border border-transparent hover:scale-105"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* University Cover & Logo */}
            <div className="h-48 relative bg-slate-100 border-b border-slate-100">
              {selectedUniversity.image_url || selectedUniversity.photo ? (
                <img
                  src={selectedUniversity.image_url || selectedUniversity.photo || ""}
                  alt={selectedUniversity.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-slate-50 flex items-center justify-center text-indigo-500">
                  <GraduationCap className="w-16 h-16 text-accent-blue" />
                </div>
              )}
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-6">
                <div className="flex items-center gap-4 relative z-10 w-full">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/50 flex items-center justify-center shrink-0 overflow-hidden shadow-lg p-1.5">
                    <UniversityLogo domain={resolveUniversityDomain(selectedUniversity.name)} name={selectedUniversity.name} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={`https://flagcdn.com/w20/${selectedUniversity.code === "uk" ? "gb" : selectedUniversity.code}.png`}
                        alt="Flag"
                        className="w-4 h-3 rounded-sm object-cover"
                      />
                      <span className="text-[10px] text-white font-bold tracking-wider uppercase">{selectedUniversity.country}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">{selectedUniversity.name}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-left" data-lenis-prevent>
              {/* General criteria */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Standard General Minimum Score Req</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedUniversity.min_cgpa_percent}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-medium block">Destination Code</span>
                  <span className="font-bold text-slate-800 text-sm uppercase">{selectedUniversity.code}</span>
                </div>
              </div>

              {/* Side-by-side UG & PG details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* UG info */}
                <div className="space-y-3 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-800 text-xs font-display flex items-center gap-1.5 pb-2 border-b border-indigo-100/30">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Undergraduate (UG) Details
                  </h4>
                  <ul className="space-y-2 text-xs font-sans">
                    <li className="flex justify-between"><span className="text-slate-500">Tuition Fees:</span> <span className="font-bold text-slate-700">{selectedUniversity.ug_tuition_fees || selectedUniversity.ug_fees || selectedUniversity.tuition_fees || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Intakes:</span> <span className="font-bold text-slate-700">{selectedUniversity.ug_intakes || selectedUniversity.ug_intake || selectedUniversity.intake || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">IELTS/PTE Limit:</span> <span className="font-bold text-slate-700">{selectedUniversity.ug_ielts_pte || selectedUniversity.ug_ielts_pte_req || selectedUniversity.ielts_pte_req || "N/A"}</span></li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">MOI Accepted:</span> 
                      <span className={`font-bold ${(selectedUniversity.ug_moi || selectedUniversity.ug_moi_accepted || selectedUniversity.moi_accepted)?.toLowerCase() === 'no' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedUniversity.ug_moi || selectedUniversity.ug_moi_accepted || selectedUniversity.moi_accepted || "N/A"}
                      </span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1 font-sans">UG Key Course pathways</span>
                    <div className="flex flex-wrap gap-1">
                      {(selectedUniversity.ug_courses || selectedUniversity.courses || "").split(",").map((c, i) => (
                        <span key={i} className="text-[9px] font-semibold bg-white border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-sans">
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PG info */}
                <div className="space-y-3 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-800 text-xs font-display flex items-center gap-1.5 pb-2 border-b border-emerald-100/30">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Postgraduate (PG) Details
                  </h4>
                  <ul className="space-y-2 text-xs font-sans">
                    <li className="flex justify-between"><span className="text-slate-500">Tuition Fees:</span> <span className="font-bold text-slate-700">{selectedUniversity.pg_tuition_fees || selectedUniversity.pg_fees || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Intakes:</span> <span className="font-bold text-slate-700">{selectedUniversity.pg_intakes || selectedUniversity.pg_intake || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">IELTS/PTE Limit:</span> <span className="font-bold text-slate-700">{selectedUniversity.pg_ielts_pte || selectedUniversity.pg_ielts_pte_req || "N/A"}</span></li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">MOI Accepted:</span> 
                      <span className={`font-bold ${(selectedUniversity.pg_moi || selectedUniversity.pg_moi_accepted)?.toLowerCase() === 'no' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedUniversity.pg_moi || selectedUniversity.pg_moi_accepted || "N/A"}
                      </span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1 font-sans">PG Key Course pathways</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedUniversity.pg_courses ? (
                        selectedUniversity.pg_courses.split(",").map((c, i) => (
                          <span key={i} className="text-[9px] font-semibold bg-white border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-sans">
                            {c.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic font-sans">No Postgraduate details specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left font-sans">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Direct Inquiry Desk</span>
                <span className="text-xs font-bold text-slate-700">Need specific requirements clarified?</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedUniversity(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center font-sans"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUniversity(null);
                    (window as any).openCounsellorForm?.();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:scale-[1.02] cursor-pointer text-center font-sans"
                >
                  Speak to Counsellor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
