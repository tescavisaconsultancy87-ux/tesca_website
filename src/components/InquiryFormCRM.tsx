import React, { useState, useEffect, useRef } from "react";
import { 
  Check, ChevronLeft, ChevronRight, Search, User, Phone, 
  Mail, Calendar, MapPin, GraduationCap, Info, Lock, X, 
  AlertCircle, CheckCircle, Clock, MessageSquare, Shield, Loader2
} from "lucide-react";

// Types
interface FormData {
  leadId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  leadSource: string;
  refName: string;
  refMobile: string;
  inquiryType: string[]; // checkboxes
  maritalStatus: string;
  passportAvailable: string;
  passportExpiry: string;
  // 10th
  tenthYear: string;
  tenthPercent: string;
  tenthBoard: string;
  tenthStream: string;
  // 12th
  completedTwelfth: string; // "Yes" or "No"
  twelfthYear: string;
  twelfthPercent: string;
  twelfthBoard: string;
  twelfthStream: string;
  // College
  collegeYear: string;
  collegeGpa: string;
  collegeUni: string;
  collegeCourse: string;
  highest: string;
  preferredCountries: string[];
  preferredUniversities: string[];
  languageTestType: string;
  languageTestScore: string;
  visaRefusal: string;
  refusalCountry: string;
  refusalDate: string;
  refusalReason: string;
  comments: string;
  contactMethod: string;
  contactTime: string;
}

const INITIAL_STATE: FormData = {
  leadId: "",
  fullName: "",
  mobileNumber: "",
  email: "",
  dob: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  leadSource: "",
  refName: "",
  refMobile: "",
  inquiryType: [],
  maritalStatus: "Single",
  passportAvailable: "No",
  passportExpiry: "",
  tenthYear: "",
  tenthPercent: "",
  tenthBoard: "",
  tenthStream: "",
  completedTwelfth: "Yes",
  twelfthYear: "",
  twelfthPercent: "",
  twelfthBoard: "",
  twelfthStream: "",
  collegeYear: "",
  collegeGpa: "",
  collegeUni: "",
  collegeCourse: "",
  highest: "",
  preferredCountries: [],
  preferredUniversities: [],
  languageTestType: "",
  languageTestScore: "",
  visaRefusal: "No",
  refusalCountry: "",
  refusalDate: "",
  refusalReason: "",
  comments: "",
  contactMethod: "WhatsApp",
  contactTime: "Morning"
};

const UK_UNIVERSITIES = [
  "Coventry University",
  "University of Hertfordshire",
  "University of East London",
  "University of Bedfordshire",
  "University of West London",
  "University of Greenwich",
  "Anglia Ruskin University",
  "Middlesex University",
  "Northumbria University",
  "Teesside University",
  "University of Central Lancashire",
  "University of Essex",
  "Nottingham Trent University",
  "De Montfort University",
  "University of Lincoln",
  "University of York",
  "University of Leicester",
  "Aston University",
  "Swansea University",
  "University of Roehampton",
  "The University of Law"
];

const COUNTRIES_LIST = [
  { name: "Canada", code: "ca", flag: "🇨🇦" },
  { name: "United Kingdom", code: "gb", flag: "🇬🇧" },
  { name: "USA", code: "us", flag: "🇺🇸" },
  { name: "Germany", code: "de", flag: "🇩🇪" },
  { name: "Australia", code: "au", flag: "🇦🇺" },
  { name: "New Zealand", code: "nz", flag: "🇳🇿" },
  { name: "Singapore", code: "sg", flag: "🇸🇬" },
  { name: "Finland", code: "fi", flag: "🇫🇮" },
  { name: "Europe", code: "eu", flag: "🇪🇺" },
  { name: "Russia", code: "ru", flag: "🇷🇺" },
  { name: "Other", code: "other", flag: "🌎" }
];

const STEPS = [
  "👤 Personal Information",
  "📢 Lead Source",
  "🎯 Inquiry Type",
  "❤️ Personal Details",
  "📚 Qualifications",
  "🌍 Country Preference",
  "📝 Language Test",
  "🚫 Visa History",
  "💬 Additional Info"
];

export default function InquiryFormCRM() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate Lead ID
  const generateLeadId = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}${mm}${dd}`;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TESCA-${dateStr}-${randomPart}`;
  };

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("tesca_crm_inquiry");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.leadId) {
          parsed.leadId = generateLeadId();
        }
        setFormData(parsed);
      } catch (e) {
        console.error("Error parsing saved form data", e);
      }
    } else {
      setFormData(prev => ({ ...prev, leadId: generateLeadId() }));
    }
  }, []);

  // Save to local storage on change
  const updateField = (fields: Partial<FormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("tesca_crm_inquiry", JSON.stringify(updated));
      return updated;
    });
    // Clear validation error when editing field
    setErrors(prev => {
      const next = { ...prev };
      Object.keys(fields).forEach(key => delete next[key]);
      return next;
    });
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUniDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate active step
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
      if (!formData.mobileNumber.trim()) {
        errs.mobileNumber = "Mobile Number is required";
      } else if (formData.mobileNumber.replace(/\D/g, "").length !== 10) {
        errs.mobileNumber = "Enter a valid 10-digit mobile number";
      }
      if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = "Enter a valid email address";
      }
    }

    if (step === 2) {
      if (!formData.leadSource) {
        errs.leadSource = "Please select how you heard about us";
      }
      if (formData.leadSource === "Reference") {
        if (!formData.refName.trim()) errs.refName = "Reference Name is required";
        if (!formData.refMobile.trim()) {
          errs.refMobile = "Reference Mobile Number is required";
        } else if (formData.refMobile.replace(/\D/g, "").length !== 10) {
          errs.refMobile = "Enter a valid 10-digit reference phone number";
        }
      }
    }

    if (step === 3) {
      if (formData.inquiryType.length === 0) {
        errs.inquiryType = "Please select at least one visa type";
      }
    }

    if (step === 4) {
      if (!formData.maritalStatus) errs.maritalStatus = "Marital Status is required";
      if (!formData.passportAvailable) errs.passportAvailable = "Please specify passport availability";
    }

    if (step === 5) {
      if (!formData.tenthYear) errs.tenthYear = "Passing Year is required";
      if (!formData.tenthPercent) errs.tenthPercent = "Percentage is required";
      if (!formData.tenthBoard) errs.tenthBoard = "Board / School is required";

      if (formData.completedTwelfth === "Yes") {
        if (!formData.twelfthYear) errs.twelfthYear = "Passing Year is required";
        if (!formData.twelfthPercent) errs.twelfthPercent = "Percentage is required";
        if (!formData.twelfthBoard) errs.twelfthBoard = "Board / School is required";
        if (!formData.twelfthStream) errs.twelfthStream = "Stream is required";

        if (formData.tenthYear && formData.twelfthYear) {
          if (parseInt(formData.twelfthYear) < parseInt(formData.tenthYear)) {
            errs.twelfthYear = "12th passing year cannot be less than 10th passing year";
          }
        }
      }

      if (formData.collegeYear) {
        const collegeYr = parseInt(formData.collegeYear);
        if (formData.completedTwelfth === "Yes" && formData.twelfthYear) {
          if (collegeYr < parseInt(formData.twelfthYear)) {
            errs.collegeYear = "College passing year cannot be less than 12th passing year";
          }
        } else if (formData.tenthYear) {
          if (collegeYr < parseInt(formData.tenthYear)) {
            errs.collegeYear = "College passing year cannot be less than 10th passing year";
          }
        }
      }

      if (!formData.highest) errs.highest = "Highest Qualification is required";
    }

    if (step === 6) {
      if (formData.preferredCountries.length === 0) {
        errs.preferredCountries = "Please select at least one country preference";
      }
    }

    if (step === 7) {
      if (!formData.languageTestType) {
        errs.languageTestType = "Please select a language test";
      }
      if (formData.languageTestType && formData.languageTestType !== "None" && !formData.languageTestScore.trim()) {
        errs.languageTestScore = "Please enter your exam score";
      }
    }

    if (step === 8) {
      if (!formData.visaRefusal) errs.visaRefusal = "Please specify visa refusal history";
      if (formData.visaRefusal === "Yes") {
        if (!formData.refusalCountry.trim()) errs.refusalCountry = "Country name is required";
        if (!formData.refusalDate) errs.refusalDate = "Refusal date is required";
        if (!formData.refusalReason.trim()) errs.refusalReason = "Refusal reason is required";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 9));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Google Sheets Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(9)) return;
    setIsSubmitting(true);

    const addressStr = `${formData.address || ""}, ${formData.city || ""}, ${formData.state || ""}, ${formData.country || ""}`.replace(/^,\s*/, "");
    const educationStr = `Highest: ${formData.highest} | 10th: ${formData.tenthYear} (${formData.tenthPercent}%, ${formData.tenthBoard}${formData.tenthStream ? `, ${formData.tenthStream}` : ""})` + (formData.completedTwelfth === "Yes" ? ` | 12th: ${formData.twelfthYear} (${formData.twelfthPercent}%, ${formData.twelfthBoard}, ${formData.twelfthStream})` : " | 12th: Not Completed") + (formData.collegeYear ? ` | College: ${formData.collegeYear} (${formData.collegeGpa} GPA, ${formData.collegeUni}, ${formData.collegeCourse})` : "");
    const countriesStr = formData.preferredCountries.join(", ");
    const universitiesStr = formData.preferredUniversities.join(", ");
    const languageStr = formData.languageTestType ? `${formData.languageTestType}: ${formData.languageTestScore}` : "None";
    const refusalStr = formData.visaRefusal === "Yes" ? `Yes (${formData.refusalCountry}, Date: ${formData.refusalDate}, Reason: ${formData.refusalReason})` : "No";

    const detailedMessage = `🚨 CRM Lead Capture Form Submission
---------------------------------------
Lead ID: ${formData.leadId}
Full Name: ${formData.fullName}
Mobile/WhatsApp: ${formData.mobileNumber}
Email: ${formData.email}
Address: ${addressStr || "Not provided"}
City: ${formData.city || "Not provided"}
State: ${formData.state || "Not provided"}
Country: ${formData.country || "Not provided"}
Lead Source: ${formData.leadSource === "Reference" ? `Reference (${formData.refName} - ${formData.refMobile})` : formData.leadSource}
Inquiry/Visa Type: ${formData.inquiryType.join(", ")}
Education: ${educationStr}
Preferred Countries: ${countriesStr || "None"}
Preferred Universities: ${universitiesStr || "None"}
Language Test: ${languageStr}
Visa Refusal History: ${refusalStr}
Comments: ${formData.comments || "None"}`;

    // Keys match createHeaders() / doPost column order exactly — do not reorder
    const sheetPayload = {
      "Timestamp":              new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      "Lead ID":                formData.leadId,
      "Full Name":              formData.fullName,
      "Mobile Number":          formData.mobileNumber,
      "Email":                  formData.email,
      "Address":                addressStr,
      "City":                   formData.city,
      "State":                  formData.state,
      "Country":                formData.country,
      "Lead Source":            formData.leadSource === "Reference"
                                  ? `Reference (${formData.refName} - ${formData.refMobile})`
                                  : formData.leadSource,
      "Inquiry Type":           formData.inquiryType.join(", "),
      "Education Details":      educationStr,
      "Preferred Countries":    countriesStr || "None",
      "Preferred Universities": universitiesStr || "None",
      "Language Test Details":  languageStr,
      "Visa Refusal Details":   refusalStr,
      "Comments":               formData.comments || "None",
    };

    try {
      const sheetUrl = import.meta.env.PUBLIC_GOOGLE_SHEET_URL;
      if (sheetUrl) {
        // Must use text/plain to avoid CORS preflight on Apps Script
        await fetch(sheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(sheetPayload),
        });
      }

      // Submit to Web3Forms for email routing
      const web3Key = import.meta.env.WEB3FORMS_ACCESS_KEY || "85242216-06e7-475c-ad35-beb2808b60d7";
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: web3Key,
          name:    formData.fullName,
          email:   formData.email,
          subject: `🚨 CRM Assessment Lead: ${formData.fullName} [${formData.leadId}]`,
          message: detailedMessage,
          source:  "CRM Lead Capture Form",
        }),
      });

      // Success
      setIsSuccess(true);
      localStorage.removeItem("tesca_crm_inquiry");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission encountered an error. We are still attempting to route your inquiry. Please contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle university selections
  const toggleUniversity = (uniName: string) => {
    const isSelected = formData.preferredUniversities.includes(uniName);
    const updated = isSelected 
      ? formData.preferredUniversities.filter(u => u !== uniName)
      : [...formData.preferredUniversities, uniName];
    updateField({ preferredUniversities: updated });
  };

  // Toggle country selections
  const toggleCountry = (countryName: string) => {
    const isSelected = formData.preferredCountries.includes(countryName);
    const updated = isSelected 
      ? formData.preferredCountries.filter(c => c !== countryName)
      : [...formData.preferredCountries, countryName];
    updateField({ preferredCountries: updated });
  };

  // Toggle Inquiry type checkboxes
  const toggleInquiryType = (type: string) => {
    const isSelected = formData.inquiryType.includes(type);
    const updated = isSelected 
      ? formData.inquiryType.filter(t => t !== type)
      : [...formData.inquiryType, type];
    updateField({ inquiryType: updated });
  };

  const filteredUnis = UK_UNIVERSITIES.filter(u => 
    u.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const completionPercentage = Math.round((currentStep / 9) * 100);

  if (isSuccess) {
    return (
      <div className="w-full max-w-[850px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold font-display text-[#0F4C81] tracking-tight">
          ✅ Thank You For Your Inquiry
        </h2>
        <div className="text-sm bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-mono text-slate-500">
          Lead ID: {formData.leadId}
        </div>
        <p className="text-base md:text-lg text-slate-600 font-sans font-normal leading-relaxed max-w-lg">
          Our senior counselor will review your academic and visa profile and contact you within 24 hours.
        </p>
        <div className="pt-6 border-t border-slate-100 w-full max-w-md flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-[#0F4C81] hover:bg-[#0c3c66] text-white font-semibold text-sm rounded-full transition-all text-center shadow-md cursor-pointer"
          >
            Go to Home
          </a>
          <a
            href="https://wa.me/919824152731"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#1ea855] text-white font-semibold text-sm rounded-full transition-all text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            WhatsApp Counselor
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] bg-white rounded-[2rem] shadow-2xl border border-slate-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] relative text-left">
      
      {/* Left Sidebar (Desktop) */}
      <div className="hidden md:flex md:col-span-4 bg-gradient-to-br from-slate-50 to-[#0F4C81]/5 border-r border-slate-100 p-8 flex-col justify-between select-none">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-wider text-[#0F4C81] font-display">
              TESCA
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F4C81]/60 bg-[#0F4C81]/10 px-2.5 py-1 rounded-full font-sans border border-[#0F4C81]/10">
              Est. 2005
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-display">Assessment Progress</h3>
            <div className="space-y-2.5">
              {STEPS.map((stepName, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;
                return (
                  <div key={stepNum} className="flex items-center gap-2 text-xs">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans border shrink-0 transition-colors ${
                      isCompleted 
                        ? "bg-green-500 border-green-500 text-white" 
                        : isActive 
                          ? "bg-[#0F4C81] border-[#0F4C81] text-white shadow-sm" 
                          : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : stepNum}
                    </div>
                    <span className={`font-semibold font-sans truncate ${
                      isActive 
                        ? "text-[#0F4C81] font-bold" 
                        : isCompleted 
                          ? "text-slate-500" 
                          : "text-slate-400 font-normal"
                    }`}>
                      {stepName.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100/80 space-y-2 text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Guarantee</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium font-sans">
            <Shield className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>256-bit SSL Data Encryption</span>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="col-span-1 md:col-span-8 p-6 md:p-10 flex flex-col justify-between min-h-[500px]">
        <div>
          {/* Top Form Branding */}
          <div className="pb-5 border-b border-slate-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold font-display text-[#0F4C81]">TESCA Visa Consultancy</h1>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200/50 rounded font-sans uppercase">Since 2005</span>
              </div>
              <h2 className="text-sm font-bold text-slate-700 font-sans">"-Be Genius, Be with Genius"</h2>
              <p className="text-xs text-slate-400 font-sans font-normal mt-1 leading-normal">
                Please complete the form below and our counselor will call you in some times.
              </p>
            </div>
            {/* Sticky Step Progress Indicator */}
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold text-[#0F4C81] font-sans">Step {currentStep} of 9</span>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                  className="h-full bg-gradient-to-r from-[#0F4C81] to-[#0F4C81]/80 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form Step Contents */}
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            
            {/* STEP 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">👤 Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={formData.fullName} 
                        onChange={e => updateField({ fullName: e.target.value })}
                        placeholder="John Doe" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.fullName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]/15'} rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-sans`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Mobile Number / Whastapp Number*</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="tel" 
                        value={formData.mobileNumber} 
                        onChange={e => updateField({ mobileNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        placeholder="10-digit mobile number" 
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.mobileNumber ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]/15'} rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-sans`}
                      />
                    </div>
                    {errors.mobileNumber && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.mobileNumber}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => updateField({ email: e.target.value })}
                        placeholder="john.doe@email.com (optional)" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]/15'} rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans`}
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="date" 
                        value={formData.dob} 
                        onChange={e => updateField({ dob: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm focus:outline-none transition-all font-sans text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Present Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={formData.address} 
                        onChange={e => updateField({ address: e.target.value })}
                        placeholder="Building name, Street" 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">City</label>
                    <input 
                      type="text" 
                      value={formData.city} 
                      onChange={e => updateField({ city: e.target.value })}
                      placeholder="Surat" 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">State</label>
                    <input 
                      type="text" 
                      value={formData.state} 
                      onChange={e => updateField({ state: e.target.value })}
                      placeholder="Gujarat" 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Country</label>
                    <input 
                      type="text" 
                      value={formData.country} 
                      onChange={e => updateField({ country: e.target.value })}
                      placeholder="India" 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Lead Source */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">📢 How Did You Hear About Us?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Facebook", "Instagram", "Google", "Direct Visit", "Friend", "Existing Student", "Reference"].map((source) => {
                    const isSelected = formData.leadSource === source;
                    return (
                      <button
                        key={source}
                        type="button"
                        onClick={() => updateField({ leadSource: source })}
                        className={`px-3 py-3 border text-xs font-semibold rounded-xl text-left transition-all cursor-pointer font-sans ${
                          isSelected 
                            ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {source}
                      </button>
                    );
                  })}
                </div>
                {errors.leadSource && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.leadSource}</p>}

                {formData.leadSource === "Reference" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 animate-[fadeIn_0.3s_ease-out]">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Reference Name *</label>
                      <input 
                        type="text" 
                        value={formData.refName} 
                        onChange={e => updateField({ refName: e.target.value })}
                        placeholder="Enter reference's full name" 
                        className={`w-full px-4 py-2.5 bg-white border ${errors.refName ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81]'} rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans`}
                      />
                      {errors.refName && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.refName}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Reference Mobile Number *</label>
                      <input 
                        type="tel" 
                        value={formData.refMobile} 
                        onChange={e => updateField({ refMobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        placeholder="Reference's 10-digit mobile" 
                        maxLength={10}
                        className={`w-full px-4 py-2.5 bg-white border ${errors.refMobile ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81]'} rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans`}
                      />
                      {errors.refMobile && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.refMobile}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Inquiry Type */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">🎯 Inquiry Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Student Visa", "Visitor Visa", "Dependent Visa", "Business Visa", "PR"].map((type) => {
                    const isSelected = formData.inquiryType.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleInquiryType(type)}
                        className={`px-4 py-3 border text-sm font-semibold rounded-xl text-left transition-all cursor-pointer flex items-center justify-between font-sans ${
                          isSelected 
                            ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81] font-bold" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{type}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#0F4C81] border-[#0F4C81] text-white" : "border-slate-300 bg-white"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.inquiryType && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.inquiryType}</p>}
              </div>
            )}

            {/* STEP 4: Personal Details */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">❤️ Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Marital Status *</label>
                    <div className="flex gap-3">
                      {["Single", "Married"].map((status) => {
                        const isSel = formData.maritalStatus === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateField({ maritalStatus: status })}
                            className={`flex-1 px-4 py-2.5 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans ${
                              isSel 
                                ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                    {errors.maritalStatus && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.maritalStatus}</p>}
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Passport Available? *</label>
                    <div className="flex gap-3">
                      {["Yes", "No"].map((avail) => {
                        const isSel = formData.passportAvailable === avail;
                        return (
                          <button
                            key={avail}
                            type="button"
                            onClick={() => updateField({ passportAvailable: avail })}
                            className={`flex-1 px-4 py-2.5 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans ${
                              isSel 
                                ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {avail}
                          </button>
                        );
                      })}
                    </div>
                    {errors.passportAvailable && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.passportAvailable}</p>}
                  </div>
                </div>


              </div>
            )}

            {/* STEP 5: Educational Qualifications */}
            {currentStep === 5 && (
              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2 animate-[slideIn_0.35s_ease-out] text-left">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">📚 Educational Qualifications</h3>
                
                {/* 10th Qualification */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] font-sans">10th Qualification</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Passing Year *</label>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.tenthYear} 
                        onChange={e => updateField({ tenthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        placeholder="YYYY" 
                        className={`w-full px-3 py-2 bg-white border ${errors.tenthYear ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                      />
                      {errors.tenthYear && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.tenthYear}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Percentage / Grade *</label>
                      <input 
                        type="text" 
                        value={formData.tenthPercent} 
                        onChange={e => updateField({ tenthPercent: e.target.value })}
                        placeholder="e.g. 85%" 
                        className={`w-full px-3 py-2 bg-white border ${errors.tenthPercent ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                      />
                      {errors.tenthPercent && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.tenthPercent}</p>}
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Board / School *</label>
                      <input 
                        type="text" 
                        value={formData.tenthBoard} 
                        onChange={e => updateField({ tenthBoard: e.target.value })}
                        placeholder="e.g. CBSE / GSEB" 
                        className={`w-full px-3 py-2 bg-white border ${errors.tenthBoard ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                      />
                      {errors.tenthBoard && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.tenthBoard}</p>}
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Stream (optional)</label>
                    <input 
                      type="text" 
                      value={formData.tenthStream} 
                      onChange={e => updateField({ tenthStream: e.target.value })}
                      placeholder="General (optional)" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* 12th Completion Question */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Have you completed 12th (HSC)? *</label>
                  <div className="flex gap-3 max-w-xs">
                    {["Yes", "No"].map((choice) => {
                      const isSel = formData.completedTwelfth === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => {
                            updateField({ 
                              completedTwelfth: choice,
                              ...(choice === "No" ? {
                                twelfthYear: "",
                                twelfthPercent: "",
                                twelfthBoard: "",
                                twelfthStream: ""
                              } : {})
                            });
                          }}
                          className={`flex-1 px-4 py-2 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans ${
                            isSel 
                              ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 12th Qualification */}
                {formData.completedTwelfth === "Yes" && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-[fadeIn_0.35s_ease-out]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] font-sans">12th Qualification</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Passing Year *</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formData.twelfthYear} 
                          onChange={e => updateField({ twelfthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="YYYY" 
                          className={`w-full px-3 py-2 bg-white border ${errors.twelfthYear ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                        />
                        {errors.twelfthYear && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.twelfthYear}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Percentage / Grade *</label>
                        <input 
                          type="text" 
                          value={formData.twelfthPercent} 
                          onChange={e => updateField({ twelfthPercent: e.target.value })}
                          placeholder="e.g. 78%" 
                          className={`w-full px-3 py-2 bg-white border ${errors.twelfthPercent ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                        />
                        {errors.twelfthPercent && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.twelfthPercent}</p>}
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Board / School *</label>
                        <input 
                          type="text" 
                          value={formData.twelfthBoard} 
                          onChange={e => updateField({ twelfthBoard: e.target.value })}
                          placeholder="e.g. GSHSEB / ISC" 
                          className={`w-full px-3 py-2 bg-white border ${errors.twelfthBoard ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                        />
                        {errors.twelfthBoard && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.twelfthBoard}</p>}
                      </div>
                    </div>
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Stream *</label>
                      <input 
                        type="text" 
                        value={formData.twelfthStream} 
                        onChange={e => updateField({ twelfthStream: e.target.value })}
                        placeholder="e.g. Science / Commerce / Arts" 
                        className={`w-full px-3 py-2 bg-white border ${errors.twelfthStream ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                      />
                      {errors.twelfthStream && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.twelfthStream}</p>}
                    </div>
                  </div>
                )}

                {/* College Qualification (Optional) */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] font-sans flex items-center justify-between">
                    <span>College Qualification</span>
                    <span className="text-[9px] font-medium text-slate-400 lowercase font-sans">(optional)</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Passing Year</label>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.collegeYear} 
                        onChange={e => updateField({ collegeYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        placeholder="YYYY" 
                        className={`w-full px-3 py-2 bg-white border ${errors.collegeYear ? 'border-red-400' : 'border-slate-200'} rounded-lg text-xs focus:outline-none font-sans`}
                      />
                      {errors.collegeYear && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.collegeYear}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Percentage / GPA</label>
                      <input 
                        type="text" 
                        value={formData.collegeGpa} 
                        onChange={e => updateField({ collegeGpa: e.target.value })}
                        placeholder="e.g. 8.2 CGPA" 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none font-sans"
                      />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">University / College Name</label>
                      <input 
                        type="text" 
                        value={formData.collegeUni} 
                        onChange={e => updateField({ collegeUni: e.target.value })}
                        placeholder="e.g. GTU / Nirma" 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Course Name</label>
                    <input 
                      type="text" 
                      value={formData.collegeCourse} 
                      onChange={e => updateField({ collegeCourse: e.target.value })}
                      placeholder="e.g. B.Tech IT / BBA" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Highest Qualification */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Highest Qualification *</label>
                  <div className="flex flex-wrap gap-2">
                    {["10th", "12th", "Diploma", "Bachelor's", "Master's", "PhD"].map((q) => {
                      const isSel = formData.highest === q;
                      return (
                        <button
                          key={q}
                          type="button"
                          onClick={() => updateField({ highest: q })}
                          className={`px-4 py-2 border text-xs font-semibold rounded-full transition-all cursor-pointer font-sans ${
                            isSel 
                              ? "bg-[#0F4C81] border-[#0F4C81] text-white" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>
                  {errors.highest && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.highest}</p>}
                </div>
              </div>
            )}

            {/* STEP 6: Country Preference */}
            {currentStep === 6 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out] text-left">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">🌍 Country Preference</h3>
                <p className="text-xs text-slate-500 font-sans">Select one or more destination countries you are interested in.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COUNTRIES_LIST.map((c) => {
                    const isSelected = formData.preferredCountries.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => toggleCountry(c.name)}
                        className={`p-3 border rounded-2xl flex items-center gap-2.5 transition-all text-xs font-bold cursor-pointer font-sans ${
                          isSelected 
                            ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81] shadow-sm scale-[1.01]" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-lg leading-none select-none">{c.flag}</span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.preferredCountries && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.preferredCountries}</p>}
              </div>
            )}



            {/* STEP 7: Language Test Details */}
            {currentStep === 7 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out] text-left">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">📝 Language Test Details</h3>
                <p className="text-xs text-slate-500 font-sans">Select the language test you have appeared for.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {["IELTS", "PTE", "TOEFL", "Duolingo", "German Language Test", "None"].map((test) => {
                    const isSelected = test === "None"
                      ? formData.languageTestType === "None"
                      : formData.languageTestType === test;
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => {
                          if (test === "None") {
                            updateField({ languageTestType: "None", languageTestScore: "" });
                          } else {
                            updateField({ languageTestType: test });
                          }
                        }}
                        className={`px-3 py-3 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans text-center leading-tight ${
                          isSelected 
                            ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {test}
                      </button>
                    );
                  })}
                </div>
                {errors.languageTestType && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.languageTestType}</p>}

                {formData.languageTestType && formData.languageTestType !== "None" && (
                  <div className="max-w-xs space-y-1 animate-[fadeIn_0.3s_ease-out]">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Exam Score *</label>
                    <input 
                      type="text"
                      value={formData.languageTestScore}
                      onChange={e => updateField({ languageTestScore: e.target.value })}
                      placeholder="e.g. Overall 7.5 (L:7, R:7, W:7, S:7.5)"
                      className={`w-full px-4 py-2.5 bg-white border ${errors.languageTestScore ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81]'} focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans`}
                    />
                    {errors.languageTestScore && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.languageTestScore}</p>}
                  </div>
                )}
              </div>
            )}

            {/* STEP 8: Visa History */}
            {currentStep === 8 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out] text-left">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">🚫 Visa History</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Any Country Refusal? *</label>
                  <div className="flex gap-3 max-w-xs">
                    {["Yes", "No"].map((ref) => {
                      const isSel = formData.visaRefusal === ref;
                      return (
                        <button
                          key={ref}
                          type="button"
                          onClick={() => {
                            if (ref === "No") {
                              updateField({ visaRefusal: "No", refusalCountry: "", refusalDate: "", refusalReason: "" });
                            } else {
                              updateField({ visaRefusal: "Yes" });
                            }
                          }}
                          className={`flex-1 px-4 py-2.5 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans ${
                            isSel 
                              ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {ref}
                        </button>
                      );
                    })}
                  </div>
                  {errors.visaRefusal && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.visaRefusal}</p>}
                </div>

                {formData.visaRefusal === "Yes" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-[fadeIn_0.3s_ease-out]">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Country Name *</label>
                      <input 
                        type="text" 
                        value={formData.refusalCountry}
                        onChange={e => updateField({ refusalCountry: e.target.value })}
                        placeholder="e.g. Canada" 
                        className={`w-full px-4 py-2.5 bg-white border ${errors.refusalCountry ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81]'} rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans`}
                      />
                      {errors.refusalCountry && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.refusalCountry}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Refusal Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input 
                          type="date" 
                          value={formData.refusalDate}
                          onChange={e => updateField({ refusalDate: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.refusalDate ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81]'} rounded-xl text-sm focus:outline-none transition-all font-sans text-slate-700`}
                        />
                      </div>
                      {errors.refusalDate && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.refusalDate}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Refusal Reason *</label>
                      <input 
                        type="text" 
                        value={formData.refusalReason}
                        onChange={e => updateField({ refusalReason: e.target.value })}
                        placeholder="e.g. Financials / Purpose of Visit" 
                        className={`w-full px-4 py-2.5 bg-white border ${errors.refusalReason ? 'border-red-400' : 'border-slate-200 focus:border-[#0F4C81]'} rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans`}
                      />
                      {errors.refusalReason && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.refusalReason}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 9: Additional Information */}
            {currentStep === 9 && (
              <div className="space-y-4 animate-[slideIn_0.35s_ease-out] text-left">
                <h3 className="text-lg font-bold text-slate-800 font-display border-b border-slate-100 pb-2">💬 Additional Information</h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Questions or Comments</label>
                  <textarea 
                    rows={3}
                    value={formData.comments}
                    onChange={e => updateField({ comments: e.target.value })}
                    placeholder="Type any questions, timelines, or context for the counselor..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all font-sans resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Preferred Contact Method *</label>
                    <div className="flex gap-2">
                      {["Call", "WhatsApp", "Email"].map((method) => {
                        const isSel = formData.contactMethod === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => updateField({ contactMethod: method })}
                            className={`flex-1 px-3 py-2 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans ${
                              isSel 
                                ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Best Time To Contact *</label>
                    <div className="flex gap-2">
                      {["Morning", "Afternoon", "Evening"].map((time) => {
                        const isSel = formData.contactTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => updateField({ contactTime: time })}
                            className={`flex-1 px-3 py-2 border text-xs font-bold rounded-xl transition-all cursor-pointer font-sans ${
                              isSel 
                                ? "bg-[#0F4C81]/5 border-[#0F4C81] text-[#0F4C81]" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </form>
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-sm bg-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>

          {currentStep < 9 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#0F4C81] hover:bg-[#0c3c66] text-white font-semibold text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md text-center"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-amber-500/60 text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  🚀 Submit Inquiry
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}