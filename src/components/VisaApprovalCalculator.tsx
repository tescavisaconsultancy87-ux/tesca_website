import React, { useState, useMemo } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, MessageCircle, PhoneCall } from 'lucide-react';

interface CalculationResult {
  score: number;
  rating: 'Exceptional' | 'High Approval' | 'Moderate Risk' | 'Needs Profile Building';
  badgeColor: string;
  gaugeColor: string;
  insights: string[];
  recommendations: string[];
}

export default function VisaApprovalCalculator() {
  const [country, setCountry] = useState<string>('Canada');
  const [education, setEducation] = useState<string>('Bachelors');
  const [academics, setAcademics] = useState<string>('65-75');
  const [ielts, setIelts] = useState<string>('6.5');
  const [studyGap, setStudyGap] = useState<string>('0-1');
  const [fundStatus, setFundStatus] = useState<string>('ready');

  const result: CalculationResult = useMemo(() => {
    let score = 70;
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Academics impact
    if (academics === '75+') {
      score += 15;
      insights.push('Academic record meets top-tier university scholarship criteria');
    } else if (academics === '65-75') {
      score += 10;
      insights.push('Strong academic standing for direct university entry');
    } else if (academics === '55-65') {
      score += 3;
      recommendations.push('Consider universities with flexible GPA cutoffs or pathway options');
    } else {
      score -= 8;
      recommendations.push('A strong SOP highlighting practical experience will be required');
    }

    // IELTS / English proficiency impact
    if (ielts === '7.5+') {
      score += 12;
      insights.push('Ideal IELTS band score for maximum visa officer confidence');
    } else if (ielts === '6.5-7.0') {
      score += 8;
      insights.push('Meets standard SDS & Direct Entry requirements for most destinations');
    } else if (ielts === '6.0') {
      score += 2;
      recommendations.push('Target universities offering single band 5.5 waivers');
    } else {
      score -= 10;
      recommendations.push('TESCA fast-track 3-week IELTS/PTE coaching recommended');
    }

    // Study Gap impact
    if (studyGap === '0-1') {
      score += 8;
      insights.push('Recent graduate profile — zero visa risk from study gap');
    } else if (studyGap === '1-3') {
      score -= 2;
      recommendations.push('Prepare work experience letters or salary slips for gap justification');
    } else {
      score -= 10;
      recommendations.push('Comprehensive career progression affidavit & SOP justification needed');
    }

    // Fund status impact
    if (fundStatus === 'ready') {
      score += 10;
      insights.push('Sufficient financial proof reduces visa rejection risk significantly');
    } else if (fundStatus === 'loan-needed') {
      score += 5;
      insights.push('TESCA banking team can assist with instant SBI/HDFC pre-approved loan letters');
    } else {
      recommendations.push('Guidance needed on blocked accounts, sponsor affidavits & liquid funds');
    }

    // Country specific boosts/adjustments
    if (country === 'Germany' && ielts !== 'none') {
      insights.push('Germany public universities offer near ZERO tuition fee pathways');
    } else if (country === 'UK' && studyGap !== '3+') {
      insights.push('Eligible for 2-Year Post Study Work (PSW) Graduate Route');
    } else if (country === 'Australia') {
      insights.push('Genuine Student (GS) criteria assessment included in your profile');
    }

    // Clamp score between 45 and 98
    score = Math.min(Math.max(score, 45), 98);

    let rating: CalculationResult['rating'] = 'High Approval';
    let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let gaugeColor = '#059669'; // Emerald

    if (score >= 90) {
      rating = 'Exceptional';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      gaugeColor = '#047857';
    } else if (score >= 78) {
      rating = 'High Approval';
      badgeColor = 'bg-teal-50 text-teal-800 border-teal-200';
      gaugeColor = '#0A7880';
    } else if (score >= 65) {
      rating = 'Moderate Risk';
      badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
      gaugeColor = '#D97706';
    } else {
      rating = 'Needs Profile Building';
      badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
      gaugeColor = '#E11D48';
    }

    return {
      score,
      rating,
      badgeColor,
      gaugeColor,
      insights: insights.slice(0, 3),
      recommendations: recommendations.slice(0, 2)
    };
  }, [country, education, academics, ielts, studyGap, fundStatus]);

  const whatsappMessage = encodeURIComponent(
    `Hi TESCA Visa Consultancy!\n\nI just evaluated my visa profile on your website:\n- Target Country: ${country}\n- Qualification: ${education} (${academics}%)\n- IELTS/PTE Score: ${ielts}\n- Calculated Approval Rating: ${result.score}% (${result.rating})\n\nCan I speak with a senior case officer to confirm my university options?`
  );

  const whatsappUrl = `https://wa.me/919824152731?text=${whatsappMessage}`;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-cyan text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 2026 AI Profile Evaluator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instant Visa Approval Odds Calculator
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Answer 5 quick profile questions to generate your personalized visa success score and university eligibility insights.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs text-white shrink-0">
            <ShieldCheck className="w-5 h-5 text-accent-cyan shrink-0" />
            <div>
              <div className="font-bold text-white">20+ Years Experience</div>
              <div className="text-slate-300 text-[11px]">97% Verified Approval Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
        
        {/* Left Side: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target Country Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Select Target Country
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['Canada', 'UK', 'Australia', 'USA', 'Germany', 'Europe'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountry(c)}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                    country === c
                      ? 'bg-accent-blue text-white border-accent-blue shadow-md scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Qualification & Academics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Highest Qualification
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
              >
                <option value="12th">12th Standard / HSC</option>
                <option value="Bachelors">Bachelor's Degree</option>
                <option value="Masters">Master's Degree</option>
                <option value="Diploma">Polytechnic / Diploma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Overall Academics (%)
              </label>
              <select
                value={academics}
                onChange={(e) => setAcademics(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
              >
                <option value="75+">Above 75% (Distinction)</option>
                <option value="65-75">65% – 75% (First Class)</option>
                <option value="55-65">55% – 65% (Second Class)</option>
                <option value="45-55">45% – 55% (Pass Class)</option>
              </select>
            </div>
          </div>

          {/* IELTS / PTE Score & Study Gap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                4. IELTS / PTE Band Score
              </label>
              <select
                value={ielts}
                onChange={(e) => setIelts(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
              >
                <option value="7.5+">IELTS 7.5+ / PTE 73+</option>
                <option value="6.5-7.0">IELTS 6.5 – 7.0 / PTE 65 – 72</option>
                <option value="6.0">IELTS 6.0 / PTE 58 – 64</option>
                <option value="none">Not Taken Yet / Planning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                5. Study / Work Gap
              </label>
              <select
                value={studyGap}
                onChange={(e) => setStudyGap(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
              >
                <option value="0-1">0 – 1 Year (No Gap)</option>
                <option value="1-3">1 – 3 Years (With Job/Experience)</option>
                <option value="3+">3+ Years (Senior Work Experience)</option>
              </select>
            </div>
          </div>

          {/* Financial Readiness */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              6. Financial / Bank Proof Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'ready', label: 'Ready in Bank' },
                { id: 'loan-needed', label: 'Education Loan Needed' },
                { id: 'guidance', label: 'Need Financial Advice' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFundStatus(f.id)}
                  className={`py-2.5 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer text-center ${
                    fundStatus === f.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Score Gauge & Action Box (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
          
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Estimated Approval Probability
            </span>

            {/* Circular Gauge Display */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="76"
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="76"
                  stroke={result.gaugeColor}
                  strokeWidth="14"
                  strokeDasharray={477.5}
                  strokeDashoffset={477.5 - (477.5 * result.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 font-display">
                  {result.score}%
                </span>
                <span className={`inline-block mt-1 px-3 py-0.5 text-[11px] font-bold rounded-full border ${result.badgeColor}`}>
                  {result.rating}
                </span>
              </div>
            </div>

            {/* Key Insights List */}
            <div className="space-y-2 text-left bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Profile Strengths & Key Factors:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 pl-5 list-disc">
                {result.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
                {result.recommendations.map((rec, idx) => (
                  <li key={`rec-${idx}`} className="text-amber-700 font-medium">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <MessageCircle className="w-4 h-4" />
              Verify My Profile on WhatsApp →
            </a>

            <button
              type="button"
              onClick={() => {
                if (typeof (window as any).openCounsellorForm === 'function') {
                  (window as any).openCounsellorForm();
                }
              }}
              className="w-full py-3 px-4 bg-accent-blue hover:bg-accent-indigo text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              Book Free Senior Case Officer Review
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
