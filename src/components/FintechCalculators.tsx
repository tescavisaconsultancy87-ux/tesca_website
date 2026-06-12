import React, { useState, useEffect } from "react";
import { DollarSign, Landmark, GraduationCap, CheckCircle, ShieldCheck } from "lucide-react";

function CalculatorSkeleton() {
  return (
    <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6 text-left animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-slate-100 shimmer shrink-0" />
        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-slate-100 rounded w-1/3 shimmer" />
          <div className="h-3 bg-slate-100 rounded w-1/2 shimmer" />
        </div>
      </div>

      <div className="space-y-4 py-4 border-t border-b border-slate-100">
        <div className="flex justify-between items-center text-sm pb-3">
          <div className="h-4 bg-slate-100 rounded w-20 shimmer" />
          <div className="h-4 bg-slate-100 rounded w-12 shimmer" />
        </div>
        <div className="flex justify-between items-center text-sm pb-3">
          <div className="h-4 bg-slate-100 rounded w-24 shimmer" />
          <div className="h-4 bg-slate-100 rounded w-12 shimmer" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-slate-100 rounded w-32 shimmer" />
          <div className="h-5 bg-slate-100 rounded w-16 shimmer" />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-100 rounded w-28 shimmer" />
          <div className="h-4 bg-slate-100 rounded w-16 shimmer" />
        </div>
        <div className="h-3.5 bg-slate-100 rounded w-full shimmer" />
        <div className="h-3 bg-slate-100 rounded w-2/3 shimmer" />
      </div>

      <div className="w-full h-12 bg-slate-100 rounded-xl shimmer" />
    </div>
  );
}

export default function FintechCalculators() {
  const [activeTab, setActiveTab] = useState<"cost" | "scholarship" | "visa">("cost");
  const [isLoading, setIsLoading] = useState(false);

  // Tab 1: Cost Calculator state
  const [selectedCountry, setSelectedCountry] = useState<"us" | "uk" | "ca" | "au">("us");
  const [tuitionSlider, setTuitionSlider] = useState<number>(35000);
  const [lifestyle, setLifestyle] = useState<"budget" | "standard" | "premium">("standard");

  const handleTabChange = (tab: "cost" | "scholarship" | "visa") => {
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleCountryChange = (country: "us" | "uk" | "ca" | "au") => {
    setIsLoading(true);
    setSelectedCountry(country);
    setTuitionSlider(country === "us" ? 40000 : country === "uk" ? 28000 : country === "ca" ? 30000 : 32000);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const livingMultiplier = lifestyle === "budget" ? 10000 : lifestyle === "standard" ? 15000 : 22000;
  const yearlyTotal = tuitionSlider + livingMultiplier;
  const threeYearProjected = yearlyTotal * 3;

  const currencySymbols = {
    us: { symbol: "$", code: "USD" },
    uk: { symbol: "£", code: "GBP" },
    ca: { symbol: "C$", code: "CAD" },
    au: { symbol: "A$", code: "AUD" }
  };

  const selectedSymbol = currencySymbols[selectedCountry].symbol;

  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1,
    INR: 83.5,
    GBP: 0.78,
    CAD: 1.37,
    AUD: 1.50,
  });

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(err => console.error("Failed to fetch exchange rates:", err));
  }, []);

  const convertToINR = (amountInLocal: number, countryCode: "us" | "uk" | "ca" | "au") => {
    const rateToUSD = rates[currencySymbols[countryCode].code] || 1;
    const rateToINR = rates.INR || 83.5;
    return (amountInLocal / rateToUSD) * rateToINR;
  };

  // Tab 2: Scholarship Predictor state
  const [gpa, setGpa] = useState<number>(8.5);
  const [ielts, setIelts] = useState<number>(7.0);
  const [hasResearch, setHasResearch] = useState<boolean>(false);
  const [hasWorkExp, setHasWorkExp] = useState<boolean>(false);

  // Prediction formula
  const calculateScholarshipChances = () => {
    let score = 0;
    if (gpa >= 9.0) score += 40;
    else if (gpa >= 8.0) score += 25;
    else score += 10;

    if (ielts >= 7.5) score += 20;
    else if (ielts >= 6.5) score += 10;

    if (hasResearch) score += 25;
    if (hasWorkExp) score += 15;

    return Math.min(98, score);
  };

  const scholarshipProbability = calculateScholarshipChances();

  // Tab 3: Visa Eligibility Checker state
  const [hasOffer, setHasOffer] = useState<boolean>(true);
  const [fundsProof, setFundsProof] = useState<boolean>(false);
  const [cleanAcademic, setCleanAcademic] = useState<boolean>(true);
  const [ieltsPassed, setIeltsPassed] = useState<boolean>(true);

  const calculateVisaStrength = () => {
    let score = 0;
    if (hasOffer) score += 25;
    if (fundsProof) score += 45;
    if (cleanAcademic) score += 15;
    if (ieltsPassed) score += 15;
    return score;
  };

  const visaStrength = calculateVisaStrength();

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-gradient-to-b from-primary-navy to-primary-dark p-6 md:p-10 shadow-lg overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100 mb-8">
        <div className="text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold font-display text-support-white">
            Fintech Estimator Suite
          </h3>
          <p className="text-xs text-support-gray/60 font-mono mt-1">
            Algorithmic predictive modeling tools
          </p>
        </div>

        {/* Tab triggers */}
        <div className="inline-flex p-1.5 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => handleTabChange("cost")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === "cost" ? "bg-accent-blue text-white shadow-sm" : "text-support-gray hover:text-slate-800"
            }`}
          >
            Study Cost Index
          </button>
          <button
            onClick={() => handleTabChange("scholarship")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === "scholarship" ? "bg-accent-blue text-white shadow-sm" : "text-support-gray hover:text-slate-800"
            }`}
          >
            Scholarship Match
          </button>
          <button
            onClick={() => handleTabChange("visa")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === "visa" ? "bg-accent-blue text-white shadow-sm" : "text-support-gray hover:text-slate-800"
            }`}
          >
            Visa Eligibility Dial
          </button>
        </div>
      </div>

      {/* Tab 1: Cost Calculator */}
      {activeTab === "cost" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sliders Input (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <span className="block text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">1. Select Target Country</span>
              <div className="flex gap-2">
                {[
                  { id: "us", name: "United States", flag: "us" },
                  { id: "uk", name: "United Kingdom", flag: "gb" },
                  { id: "ca", name: "Canada", flag: "ca" },
                  { id: "au", name: "Australia", flag: "au" }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleCountryChange(c.id as any)}
                    className={`flex-grow p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedCountry === c.id
                        ? "bg-accent-blue/5 border-accent-blue text-accent-indigo font-bold font-sans"
                        : "bg-white border-slate-200 text-support-gray hover:border-slate-300 hover:bg-slate-50 font-sans"
                    }`}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${c.flag}.png`}
                      alt={`${c.name} flag`}
                      className="w-7 h-5 rounded-sm object-cover shadow-sm mx-auto mb-2"
                    />
                    <span className="text-xs font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tuition Range Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">
                <span>2. Annual Tuition</span>
                <span className="text-accent-blue font-display font-extrabold text-base">{selectedSymbol}{tuitionSlider.toLocaleString()} /yr</span>
              </div>
              <input
                type="range"
                min={selectedCountry === "us" ? 20000 : 15000}
                max={selectedCountry === "us" ? 65000 : 50000}
                step={1000}
                value={tuitionSlider}
                onChange={e => setTuitionSlider(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-xs text-support-gray/40 font-sans">
                <span>Min</span>
                <span>Max</span>
              </div>
            </div>

            {/* Living Cost Selector */}
            <div className="space-y-3">
              <span className="block text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">3. Lifestyle & Accommodation Standard</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "budget", name: "Budget Shared", cost: `${selectedSymbol}10,000/yr`, desc: "Shared apartment, public transit" },
                  { id: "standard", name: "Standard Student", cost: `${selectedSymbol}15,000/yr`, desc: "On-campus dorm, meal plans" },
                  { id: "premium", name: "Premium Private", cost: `${selectedSymbol}22,000/yr`, desc: "Solo apartment, downtown zone" }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLifestyle(l.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      lifestyle === l.id
                        ? "bg-accent-blue/5 border-accent-blue text-accent-indigo font-bold font-sans"
                        : "bg-white border-slate-200 text-support-gray hover:border-slate-300 hover:bg-slate-50 font-sans"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{l.name}</span>
                    <span className="block text-sm font-display text-accent-blue font-extrabold mt-1">{l.cost}</span>
                    <span className="block text-[10px] text-support-gray/50 mt-1 leading-tight">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results dashboard (5 cols) */}
          {isLoading ? (
            <CalculatorSkeleton />
          ) : (
            <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6 text-left font-sans">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-indigo">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-support-white font-display">Financial Forecast</h4>
                  <p className="text-xs text-support-gray/50 font-sans font-normal">Aggregated estimates index</p>
                </div>
              </div>

              {/* Calculations Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-100 font-sans">
                  <span className="text-support-gray font-normal">Tuition /yr</span>
                  <span className="font-bold text-support-white font-display">{selectedSymbol}{tuitionSlider.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-100 font-sans font-normal">
                  <span className="text-support-gray">Living Costs /yr</span>
                  <span className="font-bold text-support-white font-display">{selectedSymbol}{livingMultiplier.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-support-white pt-2 font-sans">
                  <span>Estimated Annual Total</span>
                  <span className="font-extrabold text-accent-blue text-xl font-display">{selectedSymbol}{yearlyTotal.toLocaleString()}</span>
                </div>
                {/* INR Conversion Row */}
                <div className="flex justify-between items-center text-xs text-slate-500 font-sans font-medium bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-xl mt-1">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    INR Equivalent
                  </span>
                  <span className="font-bold text-emerald-800">
                    ₹{Math.round(convertToINR(yearlyTotal, selectedCountry)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cumulative 3 year forecast */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 font-sans">
                <div className="flex justify-between items-center text-sm font-sans">
                  <span className="text-support-gray font-semibold">3-Year Program Estimate</span>
                  <span className="font-bold text-support-white font-display">{selectedSymbol}{threeYearProjected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200/50 pt-2 font-sans font-normal">
                  <span>INR Equivalent</span>
                  <span className="font-semibold text-support-white font-display">
                    ₹{Math.round(convertToINR(threeYearProjected, selectedCountry)).toLocaleString()}
                  </span>
                </div>
                <p className="text-[12px] text-support-gray/50 leading-relaxed font-sans font-normal mt-2">
                  Calculated without scholarships. Over 72% of TESCA candidates reduce this index by 30% through our targeted assistance program.
                </p>
              </div>

              <button
                type="button"
                onClick={() => alert("Redirecting to pre-approved student loan providers...")}
                className="w-full py-3.5 bg-accent-blue text-white font-semibold text-base rounded-xl shadow-md tracking-wide hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
              >
                Check Pre-Approved Loan Limits
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Scholarship Match */}
      {activeTab === "scholarship" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Form Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Academic GPA / Percentage */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">
                <span>1. Academic Score (GPA out of 10)</span>
                <span className="text-accent-blue font-display font-extrabold text-base">{gpa.toFixed(1)} GPA</span>
              </div>
              <input
                type="range"
                min={6.0}
                max={10.0}
                step={0.1}
                value={gpa}
                onChange={e => setGpa(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-xs text-support-gray/40 font-sans">
                <span>6.0 GPA</span>
                <span>10.0 GPA (Perfect)</span>
              </div>
            </div>

            {/* Test prep slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">
                <span>2. IELTS / TOEFL Level</span>
                <span className="text-accent-blue font-display font-extrabold text-base">{ielts.toFixed(1)} Band Equivalent</span>
              </div>
              <input
                type="range"
                min={5.5}
                max={9.0}
                step={0.5}
                value={ielts}
                onChange={e => setIelts(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <div className="flex justify-between text-xs text-support-gray/40 font-sans">
                <span>5.5 Band</span>
                <span>9.0 Band (Maximum)</span>
              </div>
            </div>

            {/* Extra profile boosters */}
            <div className="space-y-3">
              <span className="block text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">3. Profile Boosters (Check all that apply)</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHasResearch(!hasResearch)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    hasResearch ? "bg-accent-blue/5 border-accent-blue text-accent-indigo font-bold font-sans" : "bg-white border-slate-200 text-support-gray hover:bg-slate-50 font-sans"
                  }`}
                >
                  <span className="text-xs font-bold">Research Publication</span>
                  <CheckCircle className={`w-4 h-4 ${hasResearch ? "text-accent-blue" : "text-slate-200"}`} />
                </button>

                <button
                  onClick={() => setHasWorkExp(!hasWorkExp)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    hasWorkExp ? "bg-accent-blue/5 border-accent-blue text-accent-indigo font-bold font-sans" : "bg-white border-slate-200 text-support-gray hover:bg-slate-50 font-sans"
                  }`}
                >
                  <span className="text-xs font-bold">1yr+ Job Experience</span>
                  <CheckCircle className={`w-4 h-4 ${hasWorkExp ? "text-accent-blue" : "text-slate-200"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Probability Dashboard result (5 cols) */}
          {isLoading ? (
            <CalculatorSkeleton />
          ) : (
            <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6 text-left font-sans">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-indigo">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-support-white font-display">Predictive Scholarship Chance</h4>
                  <p className="text-xs text-support-gray/50 font-sans font-normal">Fuzzy probability mapping</p>
                </div>
              </div>

              {/* Probability Score dial */}
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <div className="text-4xl md:text-5xl font-extrabold font-display text-support-white flex items-center">
                  {scholarshipProbability}%
                </div>
                <div className="text-xs font-bold text-accent-blue uppercase tracking-wider font-sans">
                  Matching Probability
                </div>
                <div className="text-[12px] text-support-gray/60 text-center leading-relaxed max-w-[200px] font-sans font-normal">
                  Probability of matching institutional merit packages of <strong className="text-support-white">$10K-$25K/yr</strong>.
                </div>
              </div>

              {/* Performance Tip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-support-gray leading-relaxed flex gap-2 font-sans font-normal">
                <span className="text-yellow-600">💡</span>
                <span>
                  {scholarshipProbability > 75 
                    ? "Outstanding profile! Your chances for institutional research fellowships are very high. Applying early is key."
                    : "Boost chances: Increase your IELTS to 7.5 or add a research paper project statement to increase probability above 75%."}
                </span>
              </div>

              <button
                type="button"
                onClick={() => alert("Launching scholarship matching portal...")}
                className="w-full py-3.5 bg-accent-blue text-white font-semibold text-base rounded-xl shadow-md tracking-wide hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
              >
                Get Custom Scholarship List
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Visa Eligibility Checker */}
      {activeTab === "visa" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Eligibility criteria Checklist (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left font-sans">
            <span className="block text-sm font-semibold text-support-gray/70 uppercase tracking-wider font-sans">
              Mark Completed Verification Pre-requisites
            </span>

            <div className="grid grid-cols-1 gap-3">
              {[
                { 
                  id: "offer", 
                  title: "Validated University Offer Letter", 
                  desc: "Offer letter from a certified SEVIS/DLI educational institution", 
                  checked: hasOffer, 
                  setter: setHasOffer 
                },
                { 
                  id: "funds", 
                  title: "Proof of Liquid Funding Ready", 
                  desc: "Bank balance, sponsor letters, or pre-approved educational loan", 
                  checked: fundsProof, 
                  setter: setFundsProof 
                },
                { 
                  id: "history", 
                  title: "Clear Academic Record", 
                  desc: "Zero unexplained gap years and clear documentation of degrees", 
                  checked: cleanAcademic, 
                  setter: setCleanAcademic 
                },
                { 
                  id: "test", 
                  title: "IELTS/TOEFL Standard MET", 
                  desc: "Completed test prep meeting minimum visa requirements (e.g. 6.0 bands)", 
                  checked: ieltsPassed, 
                  setter: setIeltsPassed 
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => item.setter(!item.checked)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    item.checked ? "bg-accent-blue/5 border-accent-blue" : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block text-sm font-bold text-support-white font-sans">{item.title}</span>
                    <span className="block text-xs text-support-gray/50 leading-tight font-sans font-normal">{item.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    item.checked ? "bg-accent-blue border-accent-blue text-white" : "border-slate-200"
                  }`}>
                    {item.checked && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gauge score card (5 cols) */}
          {isLoading ? (
            <CalculatorSkeleton />
          ) : (
            <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6 text-left font-sans">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-indigo">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-support-white font-display">Visa Approval Strength</h4>
                  <p className="text-xs text-support-gray/50 font-sans font-normal">Real-time dynamic compliance index</p>
                </div>
              </div>

              {/* Large Progress Dial */}
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="text-5xl font-extrabold font-display text-support-white">
                  {visaStrength}%
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  visaStrength >= 80 
                    ? "bg-green-100 border border-green-200 text-green-700"
                    : visaStrength >= 50
                      ? "bg-yellow-100 border border-yellow-200 text-yellow-700"
                      : "bg-red-100 border border-red-200 text-red-700"
                }`}>
                  {visaStrength >= 80 ? "Premium Strong" : visaStrength >= 50 ? "Standard Moderate" : "Insufficient Data"}
                </div>
              </div>

              <p className="text-xs text-support-gray/60 text-center leading-relaxed font-sans font-normal">
                Visa compliance rating uses algorithms checking institutional ratings and financial configurations.
              </p>

              <button
                type="button"
                onClick={() => alert("Filing mock visa evaluation case...")}
                className="w-full py-3.5 bg-accent-blue text-white font-semibold text-base rounded-xl shadow-md tracking-wide hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
              >
                Analyze Visa File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
