import React, { useState, useEffect } from "react";
import { X, Award, MapPin, CheckCircle, GraduationCap, FileText, ArrowRight, Quote } from "lucide-react";

interface StudentProfile {
  id: number;
  name: string;
  avatar: string;
  photo: string;
  destination: string;
  destFlag: string;
  countryCode: string;
  resultType: "IELTS" | "PTE" | "Visa Success";
  resultBadgeColor: string;
  resultDetail: string;
  admittedTo: string;
  beforeLoc: string;
  beforeStatus: string;
  quote: string;
  scores: {
    overall: string;
    sub1Label?: string;
    sub1Val?: string;
    sub2Label?: string;
    sub2Val?: string;
    sub3Label?: string;
    sub3Val?: string;
    sub4Label?: string;
    sub4Val?: string;
  };
  timeline: string[];
}

interface D1Story {
  id: number;
  name: string;
  avatar: string;
  destination: string;
  dest_flag: string;
  before_loc: string;
  before_status: string;
  before_ielts: string;
  after_uni: string;
  after_status: string;
  after_salary: string;
  quote: string;
  timeline: string;
}

export default function StudentCarousel({ stories: d1Stories }: { stories?: D1Story[] }) {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const hardcoded: StudentProfile[] = [
    {
      id: 1,
      name: "Aarav Patel",
      avatar: "👨‍🎓",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
      destination: "Canada",
      destFlag: "🇨🇦",
      countryCode: "ca",
      resultType: "IELTS",
      resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      resultDetail: "8.0 Band (IELTS)",
      admittedTo: "University of Waterloo (M.Eng in IT)",
      beforeLoc: "Surat, Gujarat",
      beforeStatus: "B.Tech IT Graduate, 1 yr visa gap",
      quote: "I had a previous visa refusal from another agency. TESCA thoroughly audited my file, pinpointed the explanation gaps, and helped me secure both my Waterloo admission and Canadian visa approval in just 12 days.",
      scores: {
        overall: "8.0",
        sub1Label: "Listening", sub1Val: "8.5",
        sub2Label: "Reading", sub2Val: "8.0",
        sub3Label: "Writing", sub3Val: "7.0",
        sub4Label: "Speaking", sub4Val: "8.0"
      },
      timeline: ["Visa Refused (Late 2024)", "Joined TESCA (Jan 2025)", "Waterloo Admission (Mar 2025)", "Canada SDS Visa Approved"]
    },
    {
      id: 2,
      name: "Sneha Reddy",
      avatar: "👩‍💻",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      destination: "Australia",
      destFlag: "🇦🇺",
      countryCode: "au",
      resultType: "PTE",
      resultBadgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      resultDetail: "84 Score (PTE Academic)",
      admittedTo: "University of Melbourne (MS Data Science)",
      beforeLoc: "Hyderabad, Telangana",
      beforeStatus: "BCA Graduate, fresh candidate",
      quote: "The PTE training at TESCA was outstanding! Their mock tests and automated audio analysis helped me fix my speaking speed and pronunciation errors. Scoring 84 overall was beyond my expectations.",
      scores: {
        overall: "84",
        sub1Label: "Speaking", sub1Val: "87",
        sub2Label: "Listening", sub2Val: "83",
        sub3Label: "Reading", sub3Val: "85",
        sub4Label: "Writing", sub4Val: "81"
      },
      timeline: ["PTE Diagnostic (62 Score)", "TESCA PTE Coaching (8 weeks)", "Scored 84 Overall", "Admitted with Partial Waiver"]
    },
    {
      id: 3,
      name: "Vikram Malhotra",
      avatar: "👨‍💼",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      destination: "United Kingdom",
      destFlag: "🇬🇧",
      countryCode: "gb",
      resultType: "Visa Success",
      resultBadgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      resultDetail: "UK Study Visa Approved",
      admittedTo: "Coventry University (MSc Business Management)",
      beforeLoc: "Vadodara, Gujarat",
      beforeStatus: "B.Com Graduate, 3-year career gap",
      quote: "My 3-year career gap made me highly anxious about my UK visa. TESCA's dedicated writing team structured my Statement of Purpose beautifully to justify my work and internship history. Visa arrived in 9 days!",
      scores: {
        overall: "Approved",
        sub1Label: "Intake", sub1Val: "Sept 2025",
        sub2Label: "Duration", sub2Val: "1 Year",
        sub3Label: "Interview", sub3Val: "Waived",
        sub4Label: "Processing", sub4Val: "9 Days"
      },
      timeline: ["SOP Preparation", "Fintech Loan Approval", "CAS Received (Coventry)", "Priority Visa Submission", "Visa Approved"]
    },
    {
      id: 4,
      name: "Meera Krishnan",
      avatar: "👩‍🔬",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
      destination: "Germany",
      destFlag: "🇩🇪",
      countryCode: "de",
      resultType: "IELTS",
      resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      resultDetail: "7.5 Band (IELTS)",
      admittedTo: "Technical University of Munich (MS Informatics)",
      beforeLoc: "Chennai, Tamil Nadu",
      beforeStatus: "B.Sc CS, academic distinction",
      quote: "Navigating the German APS certification and setting up the Blocked Account (Sperrkonto) seemed extremely complicated. TESCA guided me step-by-step through the German system and audited my admissions documents.",
      scores: {
        overall: "7.5",
        sub1Label: "Listening", sub1Val: "8.0",
        sub2Label: "Reading", sub2Val: "7.5",
        sub3Label: "Writing", sub3Val: "6.5",
        sub4Label: "Speaking", sub4Val: "7.5"
      },
      timeline: ["APS Registration", "IELTS Preparation", "TUM Admission Letter", "Blocked Account Setup", "German Student Visa Approved"]
    },
    {
      id: 5,
      name: "Kabir Mehra",
      avatar: "👨‍💻",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      destination: "United States",
      destFlag: "🇺🇸",
      countryCode: "us",
      resultType: "PTE",
      resultBadgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      resultDetail: "79 Score (PTE Academic)",
      admittedTo: "Northeastern University (MS Information Systems)",
      beforeLoc: "Mumbai, Maharashtra",
      beforeStatus: "BE Electrical, 1.5 yrs work exp",
      quote: "Securing a US F1 visa felt like a huge barrier due to the visa interview. TESCA held 4 rounds of realistic mock visa interviews with senior visa experts. That practice kept me confident, and I cleared it on my first attempt.",
      scores: {
        overall: "79",
        sub1Label: "Speaking", sub1Val: "83",
        sub2Label: "Listening", sub2Val: "77",
        sub3Label: "Reading", sub3Val: "80",
        sub4Label: "Writing", sub4Val: "76"
      },
      timeline: ["I-20 Form Received", "Mock Visa Drills", "SEVIS Fee Lodgement", "F1 Interview (Mumbai Cons.)", "Visa Approved"]
    },
    {
      id: 6,
      name: "Jaspreet Kaur",
      avatar: "👩‍🎓",
      photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
      destination: "Canada",
      destFlag: "🇨🇦",
      countryCode: "ca",
      resultType: "Visa Success",
      resultBadgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      resultDetail: "Canada SDS Visa Approved",
      admittedTo: "Seneca College (PG Diploma in Project Management)",
      beforeLoc: "Amritsar, Punjab",
      beforeStatus: "BBA Graduate, tight timeline",
      quote: "TESCA's CRM portal and responsive consultants kept me updated constantly. They took care of everything from SDS tuition fee transfer to setting up my GIC account, making the entire journey completely stress-free.",
      scores: {
        overall: "Approved",
        sub1Label: "Category", sub1Val: "SDS",
        sub2Label: "College", sub2Val: "Seneca",
        sub3Label: "GIC Status", sub3Val: "Cleared",
        sub4Label: "Biometrics", sub4Val: "Completed"
      },
      timeline: ["College Admission Match", "GIC Account Setup", "SDS File Preparation", "Biometrics Appointment", "Passport Stamped (11 Days)"]
    },
    {
      id: 7,
      name: "Rohit Verma",
      avatar: "👨‍🎓",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
      destination: "Ireland",
      destFlag: "🇮🇪",
      countryCode: "ie",
      resultType: "IELTS",
      resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      resultDetail: "7.0 Band (IELTS)",
      admittedTo: "Trinity College Dublin (MSc Finance)",
      beforeLoc: "Pune, Maharashtra",
      beforeStatus: "BAF Graduate, profile with sports merits",
      quote: "I wanted to study in Ireland but didn't know how to secure funding. TESCA helped me build a stellar application that secured a €5,000 sports merit scholarship at Trinity College, and handled my visa filing flawlessly.",
      scores: {
        overall: "7.0",
        sub1Label: "Listening", sub1Val: "7.5",
        sub2Label: "Reading", sub2Val: "7.0",
        sub3Label: "Writing", sub3Val: "6.5",
        sub4Label: "Speaking", sub4Val: "7.0"
      },
      timeline: ["Profile Selection", "Trinity Application Submission", "€5,000 Scholarship Award", "Irish Visa Submission", "Visa Stamped"]
    },
    {
      id: 8,
      name: "Ananya Sen",
      avatar: "👩‍💼",
      photo: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop",
      destination: "United Kingdom",
      destFlag: "🇬🇧",
      countryCode: "gb",
      resultType: "Visa Success",
      resultBadgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      resultDetail: "UK Student & Spouse Visa Approved",
      admittedTo: "University of East London (MBA with Placement Year)",
      beforeLoc: "Kolkata, West Bengal",
      beforeStatus: "HR Professional, married applicant",
      quote: "Applying for a study visa as a married student requires double caution to avoid refusals. TESCA guided us through the complex joint financial proofs and filed our applications together. Both visas approved in 3 weeks!",
      scores: {
        overall: "Approved",
        sub1Label: "Type", sub1Val: "Joint (Spouse)",
        sub2Label: "Course", sub2Val: "MBA",
        sub3Label: "Work Rights", sub3Val: "Included",
        sub4Label: "Processing", sub4Val: "18 Days"
      },
      timeline: ["Joint Financial Auditing", "MBA Admission Offer", "Spouse Dependency Filing", "Biometrics Appointment", "Dual Visas Approved"]
    }
  ];

  const students: StudentProfile[] = d1Stories && d1Stories.length > 0
    ? d1Stories.map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0A7880&color=fff&size=200`,
        destination: s.destination,
        destFlag: s.dest_flag,
        countryCode: s.destination.slice(0, 2).toLowerCase(),
        resultType: "Visa Success" as const,
        resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        resultDetail: s.after_status,
        admittedTo: s.after_uni,
        beforeLoc: s.before_loc,
        beforeStatus: s.before_status,
        quote: s.quote,
        scores: { overall: "Approved", sub1Label: "IELTS", sub1Val: s.before_ielts, sub2Label: "Status", sub2Val: s.after_status, sub3Label: "Salary", sub3Val: s.after_salary },
        timeline: JSON.parse(s.timeline || "[]")
      }))
    : hardcoded;

  const handleCardClick = (student: StudentProfile) => {
    setSelectedStudent(student);
  };

  useEffect(() => {
    if (selectedStudent) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [selectedStudent]);

  const closeModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="w-full py-16 bg-white overflow-hidden font-sans border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10 text-center">
        <span className="text-xs font-semibold tracking-wider text-[#F08A00] uppercase bg-[#FFE5CC] px-4 py-1.5 rounded-full border border-[#F08A00]/20 font-sans">
          TESCA Success Stories
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-800 mt-4 tracking-tight">
         Real Students. Real Approvals. Real Futures.
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto font-sans font-normal mt-2 leading-relaxed">
          Explore recent visa approvals, IELTS/PTE achievements, and inspiring journeys from students who made their global dreams a reality.
        </p>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-full overflow-hidden select-none py-2">
        {/* Soft fading overlays on left and right borders for premium glass-depth look */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling wrapper */}
        <div className="flex w-max gap-6 animate-scroll hover:[animation-play-state:paused]">
          {/* Double map for seamless loop */}
          {[...students, ...students].map((student, idx) => (
            <div
              key={`${student.id}-${idx}`}
              onClick={() => handleCardClick(student)}
              className="flex-shrink-0 w-[230px] rounded-[1.5rem] border border-slate-200 bg-white hover:border-[#0A7880]/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left relative group shadow-sm flex flex-col overflow-hidden"
            >
              {/* Photo Box Container (medium size) */}
              <div className="relative w-full h-[160px] overflow-hidden bg-slate-50 shrink-0">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none"
                  loading="lazy"
                />
                
                {/* Country Flag overlay on Top Right corner */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-[2px] p-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center justify-center">
                  <img
                    src={`https://flagcdn.com/w40/${student.countryCode}.png`}
                    alt={`${student.destination} flag`}
                    className="w-5 h-3.5 rounded-xs object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Info Text Area (at bottom) */}
              <div className="p-4 flex flex-col justify-between flex-grow bg-white border-t border-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 font-display truncate leading-snug group-hover:text-[#0A7880] transition-colors">
                    {student.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {student.admittedTo.split(" (")[0]}
                  </p>
                </div>

                {/* Score and verification details (exact match design concept) */}
                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
                  {/* Score / Result */}
                  <span className="text-[12px] font-extrabold text-[#0A7880] font-display">
                    {student.resultType === "Visa Success" ? "Approved" : student.scores.overall}
                  </span>
                  
                  {/* Metric details label */}
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                    {student.resultType}
                  </span>
                  
                  {/* Highlight green badge */}
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                    {student.resultType === "Visa Success" ? "97% SLA" : "Verified"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 py-6 animate-fade-in transition-all">
          {/* Modal Backdrop Close trigger */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={closeModal}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          ></div>

          {/* Modal Card */}
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 transform transition-all duration-300 overflow-y-auto max-h-[90vh] z-10 text-left animate-zoom-in"
            style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm shrink-0 border border-slate-100"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center gap-2">
                    {selectedStudent.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedStudent.beforeLoc}</span>
                    <span>•</span>
                    <span className="italic">{selectedStudent.beforeStatus}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-4 py-1.5 rounded-full self-start sm:self-auto">
                <span className="text-lg">{selectedStudent.destFlag}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Study in {selectedStudent.destination}</span>
              </div>
            </div>

            {/* Score & Academic Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
              {/* Score breakdown (7 cols) */}
              <div className="md:col-span-7 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-[#0A7880]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Test Score Breakdown</h4>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-[#0A7880] font-display">{selectedStudent.scores.overall}</span>
                  <span className="text-xs font-semibold text-slate-500">Overall {selectedStudent.resultType}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedStudent.scores.sub1Label && (
                    <div className="bg-white border border-slate-100 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400 font-medium">{selectedStudent.scores.sub1Label}</span>
                      <span className="font-bold text-slate-800">{selectedStudent.scores.sub1Val}</span>
                    </div>
                  )}
                  {selectedStudent.scores.sub2Label && (
                    <div className="bg-white border border-slate-100 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400 font-medium">{selectedStudent.scores.sub2Label}</span>
                      <span className="font-bold text-slate-800">{selectedStudent.scores.sub2Val}</span>
                    </div>
                  )}
                  {selectedStudent.scores.sub3Label && (
                    <div className="bg-white border border-slate-100 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400 font-medium">{selectedStudent.scores.sub3Label}</span>
                      <span className="font-bold text-slate-800">{selectedStudent.scores.sub3Val}</span>
                    </div>
                  )}
                  {selectedStudent.scores.sub4Label && (
                    <div className="bg-white border border-slate-100 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400 font-medium">{selectedStudent.scores.sub4Label}</span>
                      <span className="font-bold text-slate-800">{selectedStudent.scores.sub4Val}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admissions (5 cols) */}
              <div className="md:col-span-5 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#F08A00]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Placement Target</h4>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Admitted University</span>
                    <span className="text-sm font-bold text-slate-800 leading-snug font-display block mt-0.5">
                      {selectedStudent.admittedTo.split(" (")[0]}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">
                      {selectedStudent.admittedTo.includes("(") ? selectedStudent.admittedTo.slice(selectedStudent.admittedTo.indexOf("(")) : ""}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Admissions & Visa 97% SLA</span>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-[#0A7880]/5 border border-[#0A7880]/10 italic text-sm text-slate-600 leading-relaxed mb-6">
              <Quote className="absolute top-2 right-2 w-10 h-10 text-[#0A7880]/10 pointer-events-none" />
              "{selectedStudent.quote}"
            </div>

            {/* Milestones / Timeline */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0A7880]" />
                <span>Process Timeline</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                {selectedStudent.timeline.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-between min-h-[80px]">
                    <span className="text-[10px] font-bold text-[#0A7880] uppercase tracking-wider">Step {idx + 1}</span>
                    <span className="text-xs font-semibold text-slate-700 mt-2 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  closeModal();
                  (window as any).openCounsellorForm?.();
                }}
                className="flex-grow py-3 rounded-full bg-[#0A7880] hover:bg-[#075E64] text-white font-semibold text-sm transition-all text-center justify-center flex items-center gap-2 cursor-pointer shadow-sm shadow-[#0A7880]/20"
              >
                <span>Consult for This Pathway</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={closeModal}
                className="py-3 px-6 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all cursor-pointer text-center"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
