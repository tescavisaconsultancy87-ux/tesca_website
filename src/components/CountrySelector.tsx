import React, { useState } from "react";
import { DollarSign, Calendar, Briefcase, ChevronRight, ShieldAlert } from "lucide-react";

interface CountryData {
  id: string;
  name: string;
  flag: string;
  tuition: number;
  living: number;
  visaDays: number;
  prPathway: string;
  prScore: number;
  hiringSectors: string[];
  avgSalary: string;
  tagline: string;
  color: string;
}

export default function CountrySelector() {
  const countries: CountryData[] = [
    {
      id: "us",
      name: "United States",
      flag: "us",
      tuition: 45000,
      living: 18000,
      visaDays: 15,
      prPathway: "H1B to Green Card (STEM extensions active)",
      prScore: 55,
      hiringSectors: ["AI & Software Engineering", "Investment Banking & Fintech", "Biomedical Systems"],
      avgSalary: "$98,000/yr",
      tagline: "The global hub for tech innovation and startup capital.",
      color: "from-blue-50 to-indigo-50/30 border-blue-200"
    },
    {
      id: "uk",
      name: "United Kingdom",
      flag: "gb",
      tuition: 28000,
      living: 14000,
      visaDays: 21,
      prPathway: "Graduate Route (2-year post-study work visa)",
      prScore: 70,
      hiringSectors: ["Fintech & Finance", "Healthcare & Biotech", "Management Consulting"],
      avgSalary: "£46,000/yr",
      tagline: "Historic universities meets rapid European commercial centers.",
      color: "from-indigo-55 to-purple-50/30 border-indigo-200"
    },
    {
      id: "ca",
      name: "Canada",
      flag: "ca",
      tuition: 32000,
      living: 15000,
      visaDays: 35,
      prPathway: "Express Entry (highly structured, PGWP up to 3 years)",
      prScore: 88,
      hiringSectors: ["Cloud Infrastructure", "Renewable Energy", "Civil & Construction Systems"],
      avgSalary: "C$72,000/yr",
      tagline: "Most stable immigration policies with massive tech presence.",
      color: "from-cyan-50 to-teal-50/30 border-cyan-200"
    },
    {
      id: "au",
      name: "Australia",
      flag: "au",
      tuition: 34000,
      living: 16000,
      visaDays: 28,
      prPathway: "Subclass 189/190 (Points-based regional pathways)",
      prScore: 82,
      hiringSectors: ["Mining & Infrastructure", "Data Science & Statistics", "Automated Systems"],
      avgSalary: "A$78,000/yr",
      tagline: "Incredible quality of life with strong regional work pathways.",
      color: "from-violet-50 to-pink-50/30 border-violet-200"
    },
    {
      id: "de",
      name: "Germany",
      flag: "de",
      tuition: 1500,
      living: 12000,
      visaDays: 45,
      prPathway: "Blue Card (Fast-track citizenship, 18-month job search)",
      prScore: 85,
      hiringSectors: ["Automotive Engineering", "Industrial IoT Systems", "Embedded Hardware"],
      avgSalary: "€54,000/yr",
      tagline: "Virtually zero tuition fees in the powerhouse of European manufacturing.",
      color: "from-purple-50 to-pink-50/30 border-purple-200"
    }
  ];

  const [activeTab, setActiveTab] = useState<string>("us");
  const selected = countries.find(c => c.id === activeTab) || countries[0];

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-gradient-to-b from-primary-navy to-primary-dark p-6 md:p-10 shadow-lg overflow-hidden">
      
      {/* Aurora (very soft) */}
      <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-accent-cyan/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <span className="text-sm font-semibold tracking-wider text-slate-800 uppercase bg-accent-blue/10 px-4 py-1.5 rounded-full border border-accent-blue/20 font-sans">
          TOP STUDY DESTINATIONS
        </span>
        <h3 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-support-white">
        Find the Right Country for Your Future
        </h3>
        <p className="text-sm md:text-base text-support-gray leading-relaxed font-sans font-normal">
          Compare study costs, visa pathways, work opportunities, and post-study benefits across the world's most popular destinations.        </p>
      </div>

      {/* Floating Countries Selection Track */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {countries.map(c => {
          const isActive = c.id === activeTab;
          return (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`relative overflow-hidden p-5 rounded-2xl border text-left transition-all duration-500 group outline-none focus-visible:ring-2 focus-visible:ring-accent-blue cursor-pointer ${
                isActive
                  ? `bg-gradient-to-b ${c.color} shadow-sm border-accent-blue/30 scale-[1.02]`
                  : "bg-white border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.01]"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent animate-pulse"></div>
              )}
              
              <div className="flex items-center justify-between">
                <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt={`${c.name} flag`} className="w-8 h-6 rounded-sm object-cover shadow-sm" />
                <span className="text-[10px] font-semibold text-slate-800 bg-accent-blue/10 px-2 py-0.5 rounded-full border border-accent-blue/20 font-sans">
                  {c.id.toUpperCase()}
                </span>
              </div>
              <h4 className="text-base font-bold font-display text-support-white mt-4 flex items-center gap-1 group-hover:text-accent-blue transition-colors">
                {c.name}
              </h4>
              <span className="text-xs text-support-gray/80 line-clamp-1 mt-1 font-display font-bold">
                {c.avgSalary} Avg Salary
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Analytics Dashboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Cost & Tuition Widget (6 cols) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-indigo">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-support-white font-display">Financial Model Index</h4>
                <p className="text-xs text-support-gray/50 font-sans font-normal">Annual Tuition vs Living Costs</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-support-white bg-slate-100 px-2.5 py-1 rounded-md font-sans">
              USD Equivalents
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4 pt-2 font-sans">
            <div>
              <div className="flex justify-between text-xs text-support-gray mb-1.5 font-semibold">
                <span>Average Annual Tuition</span>
                <span className="text-support-white font-display font-bold">${selected.tuition.toLocaleString()} /yr</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-indigo rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (selected.tuition / 50000) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-support-gray mb-1.5 font-semibold">
                <span>Average Living & Meal Expenses</span>
                <span className="text-support-white font-display font-bold">${selected.living.toLocaleString()} /yr</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (selected.living / 25000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Alert box */}
          <div className="p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/10 text-xs text-support-gray leading-relaxed flex gap-2.5 items-start">
            <ShieldAlert className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
            <span>
              <strong>TESCA Advantage:</strong> Over 45% of our candidates get institutional tuition waivers or state aid, lowering average yearly costs.
            </span>
          </div>
        </div>

        {/* Visa, PR & Job Market Analytics (6 cols) */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-sans">
          
          {/* Visa & PR Gauge */}
          <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent-indigo/10 text-accent-indigo">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-support-white font-display">Visa & Citizenship</h4>
                <p className="text-xs text-support-gray/50 font-sans font-normal">Process index & PR pathway</p>
              </div>
            </div>

            {/* Circular score gauge */}
            <div className="flex items-center gap-5 my-2">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(15,23,42,0.05)" strokeWidth="5" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke="#2563EB" strokeWidth="5" fill="transparent"
                    strokeDasharray={175}
                    strokeDashoffset={175 - (175 * selected.prScore) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-support-white font-display">
                  {selected.prScore}%
                </div>
              </div>
              <div className="space-y-1 flex-grow">
                <div className="text-[10px] font-semibold text-accent-blue uppercase tracking-wider font-sans">PR Success Score</div>
                <div className="text-xs text-support-gray leading-normal font-sans font-normal">
                  {selected.prPathway}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-4 font-sans font-normal">
              <span className="text-support-gray">Average processing time</span>
              <span className="font-bold text-support-white font-display text-sm">{selected.visaDays} Days SLA</span>
            </div>
          </div>

          {/* Job Opportunities */}
          <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-highlight-purple/10 text-highlight-purple">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-support-white font-display">Job Market Index</h4>
                <p className="text-xs text-support-gray/50 font-sans font-normal">In-demand hiring vectors</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-highlight-purple uppercase tracking-wider font-sans">High-Demand Sectors</div>
              <div className="flex flex-col gap-1.5">
                {selected.hiringSectors.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-support-gray font-sans font-normal">
                    <span className="w-1.5 h-1.5 bg-highlight-purple rounded-full"></span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-4 font-sans font-normal">
              <span className="text-support-gray">Average entry income</span>
              <span className="font-bold text-support-white font-display text-sm">{selected.avgSalary}</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Top Banner Tagline */}
      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <p className="text-sm text-support-gray/95 font-sans font-normal">
          <strong className="text-support-white">{selected.name}:</strong> {selected.tagline}
        </p>
        <a href="/countries" className="text-xs font-semibold text-accent-blue flex items-center gap-1 group/btn hover:underline whitespace-nowrap font-sans">
          Read full immigration policy <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
