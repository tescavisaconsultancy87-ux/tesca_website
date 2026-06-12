import React, { useState } from "react";
import { 
  FolderOpen, Award, Landmark, ClipboardList, ChevronRight, UserCheck, ShieldAlert
} from "lucide-react";

export default function DashboardPreview() {
  const [activePortalTab, setActivePortalTab] = useState<"apps" | "visa" | "funding">("apps");

  const apps = [
    {
      id: 1,
      uni: "University of Toronto",
      country: "Canada 🇨🇦",
      program: "M.Sc in Applied Computing",
      status: "Offer Received",
      statusColor: "bg-green-100 border-green-200 text-green-700",
      deadline: "Completed",
      scholarship: "$15,000 merit award matched",
      date: "Received 3 days ago"
    },
    {
      id: 2,
      uni: "Stanford University",
      country: "United States 🇺🇸",
      program: "M.S. in Computer Science",
      status: "Interview Scheduled",
      statusColor: "bg-yellow-100 border-yellow-200 text-yellow-700",
      deadline: "June 25, 2026",
      scholarship: "Pending evaluation",
      date: "Scheduled for June 18"
    },
    {
      id: 3,
      uni: "Imperial College London",
      country: "United Kingdom 🇬🇧",
      program: "M.Sc in Advanced Computing",
      status: "Under Review",
      statusColor: "bg-blue-100 border-blue-200 text-blue-700",
      deadline: "Completed",
      scholarship: "Applied (Commonwealth)",
      date: "Submitted 14 days ago"
    }
  ];

  const visaSteps = [
    { name: "Certified Admission Offer (DLI/I-20)", status: "done", date: "May 12, 2026" },
    { name: "Financing Proof & Blocked Account Setup", status: "done", date: "May 20, 2026" },
    { name: "Biometrics Appointment Booking", status: "active", date: "Scheduled: June 15, 2026" },
    { name: "Passport Verification & Courier Dispatch", status: "pending", date: "Estimated 7 days post-appointment" }
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-gradient-to-b from-primary-navy to-primary-dark shadow-lg overflow-hidden text-left">
      
      {/* Dynamic Aura background (soft pastel) */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Portal Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[550px]">
        
        {/* Left Side: Mock portal menu (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header User info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-cyan flex items-center justify-center font-bold text-white shadow-sm">
                PS
              </div>
              <div>
                <h4 className="text-sm font-bold text-support-white font-display">Priyesh Shah</h4>
                <p className="text-[10px] text-green-600 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Portal Online
                </p>
              </div>
            </div>

            {/* Navigation options */}
            <div className="flex flex-col gap-1.5 pt-4">
              <button
                onClick={() => setActivePortalTab("apps")}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium font-sans text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activePortalTab === "apps" 
                    ? "bg-white border border-slate-200 text-accent-blue font-semibold shadow-sm" 
                    : "text-support-gray hover:text-slate-800"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>Applications Tracker</span>
              </button>

              <button
                onClick={() => setActivePortalTab("visa")}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium font-sans text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activePortalTab === "visa" 
                    ? "bg-white border border-slate-200 text-accent-blue font-semibold shadow-sm" 
                    : "text-support-gray hover:text-slate-800"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Visa Processing SLA</span>
              </button>

              <button
                onClick={() => setActivePortalTab("funding")}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium font-sans text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activePortalTab === "funding" 
                    ? "bg-white border border-slate-200 text-accent-blue font-semibold shadow-sm" 
                    : "text-support-gray hover:text-slate-800"
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Scholarship & Loans</span>
              </button>
            </div>
          </div>

          {/* Bottom compliance indicator */}
          <div className="p-3.5 rounded-xl bg-accent-blue/5 border border-accent-blue/10 text-xs text-support-gray/70 leading-relaxed font-sans font-normal">
            <span className="font-semibold text-support-white block mb-1 font-sans">SYSTEM COMPLIANCE</span>
            99.4% success index maintained. Auto-refreshed 2 mins ago.
          </div>
        </div>

        {/* Right Side: Tab View details (9 cols) */}
        <div className="lg:col-span-9 p-6 md:p-8 flex flex-col justify-between">
          
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-semibold text-accent-blue uppercase tracking-wider font-sans">TESCA Portal Console v1.2</span>
                <h3 className="text-xl font-bold text-support-white font-display mt-0.5">
                  {activePortalTab === "apps" && "Active University Shortlist"}
                  {activePortalTab === "visa" && "Visa Progress & Compliance Timeline"}
                  {activePortalTab === "funding" && "Institutional Scholarship & Loan Ledger"}
                </h3>
              </div>
              <span className="text-xs text-support-gray/50 font-sans font-medium">Candidate ID: TSC-9812</span>
            </div>

            {/* TAB CONTENT: Apps tracker */}
            {activePortalTab === "apps" && (
              <div className="space-y-4">
                {apps.map(a => (
                  <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors shadow-sm font-sans">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-support-white font-display tracking-tight">{a.uni}</span>
                        <span className="text-xs text-support-gray/60 font-sans">({a.country})</span>
                      </div>
                      <p className="text-xs text-support-gray font-sans font-normal">{a.program}</p>
                      <p className="text-xs text-accent-blue font-sans font-semibold mt-1">{a.scholarship}</p>
                    </div>

                    <div className="sm:text-right space-y-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border font-sans ${a.statusColor}`}>
                        {a.status}
                      </span>
                      <p className="text-xs text-support-gray/40 font-sans font-normal">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Visa Tracking */}
            {activePortalTab === "visa" && (
              <div className="space-y-6 my-2">
                <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6">
                  {visaSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Left timeline indicator node */}
                      <span className={`absolute left-[-31px] top-1 w-4 h-4 rounded-full border flex items-center justify-center ${
                        step.status === "done" 
                          ? "bg-green-500 border-green-500 text-white"
                          : step.status === "active"
                            ? "bg-accent-blue border-accent-blue text-white"
                            : "bg-white border-slate-200 text-slate-300"
                      }`}>
                        {step.status === "done" && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        {step.status === "active" && <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>}
                      </span>
                      
                      <div className="space-y-0.5 font-sans">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold ${
                            step.status === "done" ? "text-support-white" : step.status === "active" ? "text-accent-blue" : "text-support-gray/50"
                          }`}>{step.name}</h4>
                          {step.status === "active" && (
                            <span className="text-[9px] font-semibold text-accent-indigo bg-accent-blue/10 px-1.5 py-0.2 rounded border border-accent-blue/20">
                              ACTIVE TARGET
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-support-gray/40 font-sans font-normal">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Funding & Loans */}
            {activePortalTab === "funding" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                
                {/* Scholarship matches */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold font-display text-support-white">
                    <Award className="w-4 h-4 text-accent-blue" />
                    <span>Tuition Aid Ledger</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-support-gray font-normal">Secured Merit Grants</span>
                      <span className="font-extrabold text-green-600 font-display text-base">$15,000 /yr</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-support-gray font-normal">Work Study (TA/RA) Allowance</span>
                      <span className="font-extrabold text-accent-blue font-display text-base">$8,500 /yr</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-blue w-[68%]"></div>
                    </div>
                    <p className="text-[10px] text-support-gray/40 font-sans font-normal">68% of targeted institutional budget secured for current cycle.</p>
                  </div>
                </div>

                {/* Pre-approved Loan limits */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold font-display text-support-white">
                    <Landmark className="w-4 h-4 text-highlight-purple" />
                    <span>TESCA Financed Loan Limits</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-support-gray font-normal">Pre-approved Credit Limit</span>
                      <span className="font-extrabold text-support-white font-display text-base">$45,000 Max</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-support-gray font-normal">Fixed Rate APR</span>
                      <span className="font-extrabold text-accent-blue font-display text-base">8.25% (No collateral)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-support-gray font-normal">Verification status</span>
                      <span className="text-green-600 font-semibold flex items-center gap-1 text-xs">
                        <UserCheck className="w-3.5 h-3.5" /> Approved
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Simulated Dashboard Footer actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <div className="flex items-center gap-2 text-xs text-support-gray/60 font-sans font-normal">
              <ShieldAlert className="w-4 h-4 text-accent-blue" />
              <span>SLA visa guarantee applies to all current active applications.</span>
            </div>
            
            <button
              onClick={() => alert("Launching Student Portal Full Console...")}
              className="text-sm font-semibold text-accent-blue flex items-center gap-1 group hover:underline cursor-pointer font-sans"
            >
              Access student portal dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
