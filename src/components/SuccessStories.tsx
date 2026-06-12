import React, { useState } from "react";
import { ArrowRight, Quote, Award, Sparkles, MapPin } from "lucide-react";

interface Story {
  id: number;
  name: string;
  avatar: string;
  destination: string;
  destFlag: string;
  beforeLoc: string;
  beforeStatus: string;
  beforeIelts: string;
  afterUni: string;
  afterStatus: string;
  afterSalary: string;
  quote: string;
  timeline: string[];
}

export default function SuccessStories() {
  const stories: Story[] = [
    {
      id: 1,
      name: "Aarav Patel",
      avatar: "👨‍💻",
      destination: "Canada",
      destFlag: "🇨🇦",
      beforeLoc: "Ahmedabad, Gujarat",
      beforeStatus: "B.Tech Graduate, 1 yr gap, visa refused once",
      beforeIelts: "6.5 IELTS (speaking 5.5)",
      afterUni: "University of Waterloo (M.Eng)",
      afterStatus: "Cloud Engineer at AWS, Vancouver",
      afterSalary: "$105,000/yr",
      quote: "TESCA restructured my visa filing, highlighted my STEM projects, and automated my applications. The mock visa interviews with AI feedback were a game-changer.",
      timeline: ["Visa Refusal (2024)", "TESCA Match (Jan 2025)", "Waterloo Offer (Mar 2025)", "Visa Approved in 12 Days", "AWS Internship (2025)"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "👩‍🔬",
      destination: "United States",
      destFlag: "🇺🇸",
      beforeLoc: "Ludhiana, Punjab",
      beforeStatus: "B.Sc Biotech, tight budget constraints",
      beforeIelts: "318 GRE, 7.5 IELTS",
      afterUni: "Boston University (Biomedical MS)",
      afterStatus: "Research Associate at Pfizer, Boston",
      afterSalary: "$92,000/yr",
      quote: "I thought the US was unaffordable. TESCA's scholarship match algorithm found a 70% tuition waiver assistantship that I didn't even know existed on BU's portal.",
      timeline: ["High tuition fear", "TESCA Aid search", "BU $45k Assist. matching", "Visa Approved (F1)", "Hired at Pfizer"]
    },
    {
      id: 3,
      name: "Rohan Das",
      avatar: "👨‍💼",
      destination: "United Kingdom",
      destFlag: "🇬🇧",
      beforeLoc: "Kolkata, West Bengal",
      beforeStatus: "B.Com, 3 years non-tech experience",
      beforeIelts: "7.0 IELTS",
      afterUni: "London School of Economics (MS Finance)",
      afterStatus: "Investment Analyst at Barclays, London",
      afterSalary: "£55,000/yr",
      quote: "The financial documentation requirements for the UK are strict. TESCA's fintech widget checked my loan details, matching me with pre-approved banking partners instantly.",
      timeline: ["Consulting traditional agents", "Platform loan approval", "LSE Admission", "Biometrics cleared", "London placement"]
    }
  ];

  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const active = stories[activeStoryIdx];

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-gradient-to-b from-primary-navy to-primary-dark p-6 md:p-10 shadow-lg overflow-hidden">
      
      {/* Background glow (very soft) */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-highlight-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header and counter stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
        <div className="space-y-3 text-left">
          <span className="text-sm font-semibold tracking-wider text-highlight-purple uppercase bg-highlight-purple/10 px-4 py-1.5 rounded-full border border-highlight-purple/20 font-sans">
            Validated Student Journeys
          </span>
          <h3 className="text-3xl md:text-4xl font-bold font-display text-support-white tracking-tight">
            Student Journeys Redefined
          </h3>
          <p className="text-sm text-support-gray max-w-md font-sans font-normal leading-relaxed">
            Watch real outcomes from students who moved beyond generic consultancies to data-driven global careers.
          </p>
        </div>

        {/* Counter Stats Box */}
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm backdrop-blur-md font-sans">
          <div className="text-center px-4 border-r border-slate-100">
            <span className="block text-[10px] font-semibold text-support-gray/60 uppercase tracking-wider font-sans">Placements</span>
            <span className="text-xl md:text-2xl font-extrabold font-display text-support-white">{active.destFlag === "🇨🇦" ? "4,820+" : "4,820+"}</span>
          </div>
          <div className="text-center px-4 border-r border-slate-100">
            <span className="block text-[10px] font-semibold text-support-gray/60 uppercase tracking-wider font-sans">Avg Scholarship</span>
            <span className="text-xl md:text-2xl font-extrabold font-display text-accent-blue">$38.4K</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[10px] font-semibold text-support-gray/60 uppercase tracking-wider font-sans">Success SLA</span>
            <span className="text-xl md:text-2xl font-extrabold font-display text-highlight-purple">99.4%</span>
          </div>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
        
        {/* Journey Card before/after (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between space-y-8 text-left">
          
          {/* Header student profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-sans">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-indigo to-accent-cyan flex items-center justify-center text-2xl shadow-sm">
                {active.avatar}
              </div>
              <div>
                <h4 className="text-lg font-bold font-display text-support-white tracking-tight">{active.name}</h4>
                <p className="text-xs text-support-gray/50 font-sans font-normal">TESCA Student ID #104{active.id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 font-sans">
              <span className="text-xs">{active.destFlag}</span>
              <span className="text-xs font-medium text-support-slate">{active.destination}</span>
            </div>
          </div>

          {/* Before vs After Split grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative font-sans">
            {/* Center line separator for md+ */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-100"></div>

            {/* Before (Gujarat/Punjab) */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 uppercase tracking-wider font-sans">
                <MapPin className="w-3.5 h-3.5" /> Before
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-support-white">{active.beforeLoc}</div>
                <div className="text-xs text-support-gray/80 leading-relaxed font-normal">{active.beforeStatus}</div>
                <div className="text-xs text-support-gray/50 font-sans font-normal italic">Test Prep: {active.beforeIelts}</div>
              </div>
            </div>

            {/* After (Global University / Job) */}
            <div className="space-y-3 md:pl-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 uppercase tracking-wider font-sans">
                <Award className="w-3.5 h-3.5" /> After (TESCA path)
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-support-white font-sans">{active.afterUni}</div>
                <div className="text-xs text-support-gray/80 leading-relaxed font-normal">{active.afterStatus}</div>
                <div className="text-xs text-accent-blue font-semibold font-sans">Income Index: {active.afterSalary}</div>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative p-5 rounded-xl bg-slate-50 border border-slate-100 italic text-sm text-support-gray font-sans font-normal leading-relaxed">
            <Quote className="absolute top-2 right-2 w-10 h-10 text-slate-300/30 pointer-events-none" />
            "{active.quote}"
          </div>
        </div>

        {/* Interactive Milestone Timeline Widget (5 cols) */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between space-y-6 text-left font-sans">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-support-white font-display">Journey Milestones</h4>
              <p className="text-xs text-support-gray/50 font-sans font-normal">Process velocity mapping</p>
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-5 my-2">
            {active.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 relative">
                {/* Step Connector Line */}
                {idx < active.timeline.length - 1 && (
                  <div className="absolute left-[9px] top-6 bottom-[-20px] w-[2px] bg-slate-100"></div>
                )}
                
                {/* Check circle */}
                <div className="w-5 h-5 rounded-full border border-accent-blue/40 bg-white flex items-center justify-center text-[10px] font-bold text-accent-blue mt-0.5 shrink-0 font-sans">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-support-gray/80 leading-relaxed pt-0.5 font-sans">{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert("Launching Student Journey Simulator Console...")}
            className="w-full py-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-xs font-semibold text-support-white flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
          >
            <span>Preview Journey Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Netflix Horizontal Row SELECTOR */}
      <div className="text-left font-sans">
        <span className="block text-[10px] font-semibold text-support-gray/50 uppercase tracking-widest font-sans mb-4">
          Select Student Journey Records
        </span>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIdx(idx)}
              className={`flex-shrink-0 w-[240px] p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                idx === activeStoryIdx
                  ? "bg-accent-blue/5 border-accent-blue/30 shadow-sm"
                  : "bg-white border-slate-200/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-support-white font-display truncate pr-2">{story.name}</span>
                <span className="text-xs">{story.destFlag}</span>
              </div>
              <div className="text-[11px] text-support-gray/60 mt-1 truncate font-sans font-normal">{story.beforeLoc}</div>
              <div className="text-[11px] text-accent-blue font-semibold mt-2 flex items-center gap-1.5 font-sans">
                <span>View Path</span> <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
