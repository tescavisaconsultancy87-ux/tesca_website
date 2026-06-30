import React, { useState, useEffect, useRef } from "react";
import { X, Phone, Mail, User, Globe, CheckCircle, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import IOSPicker from "./IOSPicker";

const COUNTRIES = [
  { value: "Australia", label: "Australia", flag: "au" },
  { value: "New Zealand", label: "New Zealand", flag: "nz" },
  { value: "United Kingdom", label: "United Kingdom", flag: "gb" },
  { value: "Ireland", label: "Ireland", flag: "ie" },
  { value: "Germany", label: "Germany", flag: "de" },
  { value: "Europe", label: "Europe", flag: "eu" },
  { value: "USA", label: "USA", flag: "us" },
  { value: "Canada", label: "Canada", flag: "ca" },
  { value: "Singapore", label: "Singapore", flag: "sg" },
  { value: "Dubai", label: "Dubai", flag: "ae" },
  { value: "Malaysia", label: "Malaysia", flag: "my" },
  { value: "Switzerland", label: "Switzerland", flag: "ch" },
];

// Country calling codes with min/max local digit lengths (excludes country code digits)
const PHONE_COUNTRIES = [
  { code: "IN", dialCode: "+91",  flag: "🇮🇳", name: "India",          minDigits: 10, maxDigits: 10 },
  { code: "US", dialCode: "+1",   flag: "🇺🇸", name: "USA",            minDigits: 10, maxDigits: 10 },
  { code: "GB", dialCode: "+44",  flag: "🇬🇧", name: "United Kingdom", minDigits: 10, maxDigits: 10 },
  { code: "CA", dialCode: "+1",   flag: "🇨🇦", name: "Canada",         minDigits: 10, maxDigits: 10 },
  { code: "AU", dialCode: "+61",  flag: "🇦🇺", name: "Australia",      minDigits: 9,  maxDigits: 9  },
  { code: "NZ", dialCode: "+64",  flag: "🇳🇿", name: "New Zealand",    minDigits: 8,  maxDigits: 10 },
  { code: "DE", dialCode: "+49",  flag: "🇩🇪", name: "Germany",        minDigits: 10, maxDigits: 11 },
  { code: "IE", dialCode: "+353", flag: "🇮🇪", name: "Ireland",        minDigits: 9,  maxDigits: 9  },
  { code: "SG", dialCode: "+65",  flag: "🇸🇬", name: "Singapore",      minDigits: 8,  maxDigits: 8  },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "UAE / Dubai",    minDigits: 9,  maxDigits: 9  },
  { code: "MY", dialCode: "+60",  flag: "🇲🇾", name: "Malaysia",       minDigits: 9,  maxDigits: 10 },
  { code: "CH", dialCode: "+41",  flag: "🇨🇭", name: "Switzerland",    minDigits: 9,  maxDigits: 9  },
  { code: "PK", dialCode: "+92",  flag: "🇵🇰", name: "Pakistan",       minDigits: 10, maxDigits: 10 },
  { code: "BD", dialCode: "+880", flag: "🇧🇩", name: "Bangladesh",     minDigits: 10, maxDigits: 10 },
  { code: "NP", dialCode: "+977", flag: "🇳🇵", name: "Nepal",          minDigits: 10, maxDigits: 10 },
  { code: "LK", dialCode: "+94",  flag: "🇱🇰", name: "Sri Lanka",      minDigits: 9,  maxDigits: 9  },
  { code: "PH", dialCode: "+63",  flag: "🇵🇭", name: "Philippines",    minDigits: 10, maxDigits: 10 },
  { code: "SA", dialCode: "+966", flag: "🇸🇦", name: "Saudi Arabia",   minDigits: 9,  maxDigits: 9  },
  { code: "QA", dialCode: "+974", flag: "🇶🇦", name: "Qatar",          minDigits: 8,  maxDigits: 8  },
  { code: "KW", dialCode: "+965", flag: "🇰🇼", name: "Kuwait",         minDigits: 8,  maxDigits: 8  },
  { code: "OM", dialCode: "+968", flag: "🇴🇲", name: "Oman",           minDigits: 8,  maxDigits: 8  },
  { code: "FR", dialCode: "+33",  flag: "🇫🇷", name: "France",         minDigits: 9,  maxDigits: 9  },
  { code: "IT", dialCode: "+39",  flag: "🇮🇹", name: "Italy",          minDigits: 9,  maxDigits: 10 },
  { code: "NL", dialCode: "+31",  flag: "🇳🇱", name: "Netherlands",    minDigits: 9,  maxDigits: 9  },
  { code: "SE", dialCode: "+46",  flag: "🇸🇪", name: "Sweden",         minDigits: 9,  maxDigits: 9  },
  { code: "FI", dialCode: "+358", flag: "🇫🇮", name: "Finland",        minDigits: 9,  maxDigits: 10 },
  { code: "JP", dialCode: "+81",  flag: "🇯🇵", name: "Japan",          minDigits: 10, maxDigits: 10 },
  { code: "KR", dialCode: "+82",  flag: "🇰🇷", name: "South Korea",    minDigits: 10, maxDigits: 11 },
  { code: "CN", dialCode: "+86",  flag: "🇨🇳", name: "China",          minDigits: 11, maxDigits: 11 },
  { code: "ZA", dialCode: "+27",  flag: "🇿🇦", name: "South Africa",   minDigits: 9,  maxDigits: 9  },
  { code: "NG", dialCode: "+234", flag: "🇳🇬", name: "Nigeria",        minDigits: 10, maxDigits: 10 },
  { code: "KE", dialCode: "+254", flag: "🇰🇪", name: "Kenya",          minDigits: 9,  maxDigits: 9  },
];

const MODES = ["Video Call", "Phone Call", "In-Person Meeting", "Email"];
const VISA_TYPES = ["Student Visa", "Tourist Visa", "Business Visa", "Dependent Visa"];

export default function CounsellorForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("IN");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState("");
  const [visaType, setVisaType] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "failed">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const selectedPhoneCountry = PHONE_COUNTRIES.find(c => c.code === phoneCountry) || PHONE_COUNTRIES[0];

  const getAvailableDates = () => {
    const dates = [];
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        label: d.toLocaleDateString('en-US', options),
        value: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate()
      });
    }
    return dates;
  };

  const TIME_SLOTS = [
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM",
    "06:30 PM"
  ];

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    };
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCountryDropdown]);

  useEffect(() => {
    const handleOpen = () => {
      setStatus("idle");
      setSubmitError("");
      setShowSlotPicker(false);
      setSelectedDate("");
      setSelectedTime("");
      setIsOpen(true);
    };
    window.addEventListener("open-counsellor-form", handleOpen);
    return () => {
      window.removeEventListener("open-counsellor-form", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      (window as any).lenis?.start();
    };
  }, [isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Please enter a valid email";
    const digitsOnly = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (digitsOnly.length < selectedPhoneCountry.minDigits) {
      errs.phone = `Phone number must be at least ${selectedPhoneCountry.minDigits} digits for ${selectedPhoneCountry.name}`;
    } else if (digitsOnly.length > selectedPhoneCountry.maxDigits) {
      errs.phone = `Phone number must be at most ${selectedPhoneCountry.maxDigits} digits for ${selectedPhoneCountry.name}`;
    }
    if (!mode) errs.mode = "Please select a counselling mode";
    if (!visaType) errs.visaType = "Please select a visa type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fullPhoneNumber = `${selectedPhoneCountry.dialCode} ${phone}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      const response = await fetch("/api/counsellor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: fullPhoneNumber,
          subject: `New Student Enquiry - ${firstName} ${lastName} 🚀`,
          mode,
          destination,
          visaType,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      if (typeof window !== "undefined" && (window as any).trackLeadEvent) {
        (window as any).trackLeadEvent("counsellor");
      }
      setShowSlotPicker(true);
    } catch (err: any) {
      console.error("Enquiry submission failed:", err);
      setSubmitError(err.message || "Something went wrong. Please try again or reach us directly.");
      setStatus("failed");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPhoneCountry("IN");
      setMode("");
      setDestination("");
      setVisaType("");
      setErrors({});
    }
  };

  const filteredPhoneCountries = countrySearch.trim()
    ? PHONE_COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dialCode.includes(countrySearch) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : PHONE_COUNTRIES;

  const inputClass = (field: string) =>
    `w-full bg-white border ${errors[field] ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-200 font-sans font-normal`;

  const labelClass = "block text-xs font-semibold text-slate-700 uppercase tracking-wider font-sans mb-1.5";

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl border border-slate-200/80 animate-[modalIn_0.3s_cubic-bezier(0.16,1,0.3,1)] modal-scroll"
            data-lenis-prevent
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button in absolute position so it floats on top right of the whole modal */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-30 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
              {/* Left Column: Premium Branding Sidebar (42% width) */}
              <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-accent-indigo to-accent-blue p-8 flex-col justify-between text-white relative overflow-hidden">
                {/* Background decorative shapes */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-2xl"></div>
                <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-white/5 blur-3xl"></div>

                <div className="space-y-8 relative z-10 text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white shadow-inner">
                    <Globe className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-3xl font-extrabold font-display leading-tight">
                      Begin Your <br />Global Journey
                    </h3>
                    <p className="text-sm text-white/80 font-sans leading-relaxed">
                      Consult with India's leading visa advisors and unlock global education pathways.
                    </p>
                  </div>

                  <ul className="space-y-4 pt-4 border-t border-white/10 text-sm font-sans font-medium">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white font-semibold block text-sm">Free Profile Evaluation</strong>
                        <span className="block text-white/70 mt-0.5 leading-snug text-xs">
                          Assessment of your scores, backlogs & language tests to find best-fit universities.
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white font-semibold block text-sm">Document & Visa Audit</strong>
                        <span className="block text-white/70 mt-0.5 leading-snug text-xs">
                          Pre-visa compliance checks on SOP, LORs & financial documents.
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white font-semibold block text-sm">Scholarship & Loan Guidance</strong>
                        <span className="block text-white/70 mt-0.5 leading-snug text-xs">
                          Merit-based grants, fee waivers & education loan assistance.
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10 text-left space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Trust Indicator</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black font-display text-accent-cyan leading-none">97%</span>
                    <div className="text-[11px] leading-tight text-white/80 font-medium">
                      Visa Success Rate<br />Since 2005
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form Area (58% width) */}
              <div className="col-span-1 md:col-span-7 p-6 md:p-8 flex flex-col justify-center bg-white relative">
                {showSlotPicker ? (
                  <div className="space-y-6 text-left h-full flex flex-col justify-between">
                    <div>
                      <div className="pb-3 border-b border-slate-100 mb-6">
                        <h3 className="text-xl font-bold font-display text-slate-800 tracking-tight">Select your consultation slot</h3>
                        <p className="text-xs text-slate-500 font-sans font-normal">Pick a convenient time for our senior counsellor to call you.</p>
                      </div>

                      {/* Calendar Day Picker */}
                      <div className="space-y-3 mb-6">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">1. Select Date</label>
                        <div className="grid grid-cols-5 gap-2">
                          {getAvailableDates().map((d) => (
                            <button
                              key={d.value}
                              type="button"
                              onClick={() => setSelectedDate(d.value)}
                              className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                                selectedDate === d.value
                                  ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-bold shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-[10px] uppercase font-sans tracking-wide text-slate-400 font-bold">{d.dayName}</span>
                              <span className="text-lg font-bold font-display leading-tight">{d.dayNum}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div className="space-y-3 mb-6">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">2. Select Time (IST)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TIME_SLOTS.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSelectedTime(t)}
                              className={`py-2.5 rounded-xl border text-xs font-semibold font-sans transition-all cursor-pointer text-center ${
                                selectedTime === t
                                  ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-bold shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interim notice */}
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/50 text-[11px] text-amber-800 leading-relaxed font-sans font-medium mb-6">
                        ⚡ <strong>We'll WhatsApp you within 10 min</strong> (Mon–Sat 10 AM – 7 PM) to confirm your meeting link.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedDate || !selectedTime) {
                          alert("Please select a date and time slot!");
                          return;
                        }
                        
                        const dates = getAvailableDates();
                        const formattedDate = dates.find(d => d.value === selectedDate)?.label || selectedDate;
                        const visaPart = visaType ? ` for ${visaType}` : "";
                        const message = `Hello TESCA, I have booked a consultation slot${visaPart} for ${formattedDate} at ${selectedTime}. Please confirm my slot!`;
                        const encodedMsg = encodeURIComponent(message);
                        
                        // Auto redirect to WhatsApp
                        window.open(`https://wa.me/919824152731?text=${encodedMsg}`, '_blank');
                        
                        // Reset form and close
                        setShowSlotPicker(false);
                        setFirstName("");
                        setLastName("");
                        setEmail("");
                        setPhone("");
                        setPhoneCountry("IN");
                        setMode("");
                        setDestination("");
                        setVisaType("");
                        setErrors({});
                        setIsOpen(false);
                      }}
                      className="w-full py-3 bg-[#25D366] hover:bg-[#1ea855] text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.559 4.122 1.532 5.859L.057 23.5l5.784-1.518A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.573-.492-5.063-1.35L2.5 21.869l1.244-4.287A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      Confirm Slot & Chat on WhatsApp
                    </button>
                  </div>
                ) : status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 h-full">
                    <div className="p-4 rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="w-10 h-10 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-800">Inquiry Sent!</h3>
                    <p className="text-sm text-slate-600 font-sans font-normal max-w-xs leading-relaxed">
                      Our team will reach out to you soon.
                    </p>
                  </div>
                ) : status === "failed" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 h-full">
                    <div className="p-4 rounded-full bg-red-100 text-red-600">
                      <AlertCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-800">Oops, send failed!</h3>
                    <p className="text-sm text-slate-600 font-sans font-normal max-w-xs leading-relaxed">
                      {submitError || "Something went wrong. Please try again or reach us directly."}
                    </p>
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="px-6 py-2.5 bg-accent-blue hover:bg-accent-indigo text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        Try Again
                      </button>
                      <a
                        href="https://wa.me/919824152731?text=Hello%20TESCA%2C%20I%20tried%20submitting%20the%20enquiry%20form%20but%20it%20failed.%20I%20would%20like%20to%20book%20a%20consultation."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-[#25D366] hover:bg-[#1ea855] text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.559 4.122 1.532 5.859L.057 23.5l5.784-1.518A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.573-.492-5.063-1.35L2.5 21.869l1.244-4.287A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        Contact via WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="pb-3 border-b border-slate-100">
                      <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight">Book a Consultation</h3>
                      <p className="text-xs text-slate-500 font-sans font-normal">Fill in your details and we'll connect with you</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className={labelClass}>
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="John"
                            className={`${inputClass("firstName")} pl-10`}
                          />
                        </div>
                        {errors.firstName && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.firstName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Doe"
                            className={`${inputClass("lastName")} pl-10`}
                          />
                        </div>
                        {errors.lastName && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="john.doe@email.com"
                          className={`${inputClass("email")} pl-10`}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-0 relative" ref={countryDropdownRef}>
                        {/* Country Code Picker Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowCountryDropdown(!showCountryDropdown);
                            setCountrySearch("");
                          }}
                          className={`flex items-center gap-1 px-3 py-3 border ${errors.phone ? "border-red-400" : "border-slate-200"} border-r-0 rounded-l-xl bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-all duration-200 cursor-pointer shrink-0 font-sans`}
                        >
                          <img 
                            src={`https://flagcdn.com/w20/${selectedPhoneCountry.code.toLowerCase()}.png`} 
                            alt={selectedPhoneCountry.name} 
                            className="w-5 h-3.5 object-contain shrink-0 rounded-[2px]" 
                          />
                          <span className="text-xs font-semibold text-slate-600">{selectedPhoneCountry.dialCode}</span>
                          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showCountryDropdown ? "rotate-180" : ""}`} />
                        </button>
 
                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-64 max-h-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-[modalIn_0.15s_ease-out]">
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-2">
                              <input
                                type="text"
                                value={countrySearch}
                                onChange={e => setCountrySearch(e.target.value)}
                                placeholder="Search country..."
                                autoFocus
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-accent-blue font-sans"
                              />
                            </div>
                            <div className="overflow-y-auto max-h-40">
                              {filteredPhoneCountries.map(c => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setPhoneCountry(c.code);
                                    setPhone("");
                                    setShowCountryDropdown(false);
                                    setCountrySearch("");
                                    setErrors(prev => {
                                      const next = { ...prev };
                                      delete next.phone;
                                      return next;
                                    });
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors cursor-pointer font-sans ${
                                    c.code === phoneCountry ? "bg-accent-blue/5 text-accent-blue font-bold" : "text-slate-700"
                                  }`}
                                >
                                  <img 
                                    src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                    alt={c.name} 
                                    className="w-5 h-3.5 object-contain shrink-0 rounded-[2px]" 
                                  />
                                  <span className="flex-1 font-medium truncate">{c.name}</span>
                                  <span className="text-slate-400 font-semibold shrink-0">{c.dialCode}</span>
                                </button>
                              ))}
                              {filteredPhoneCountries.length === 0 && (
                                <p className="px-3 py-4 text-xs text-slate-400 text-center font-sans">No country found</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, selectedPhoneCountry.maxDigits);
                            setPhone(digits);
                          }}
                          placeholder={selectedPhoneCountry.minDigits === selectedPhoneCountry.maxDigits
                            ? `${"0".repeat(selectedPhoneCountry.minDigits).replace(/0{4}$/, "XXXX")}`
                            : `${selectedPhoneCountry.minDigits}–${selectedPhoneCountry.maxDigits} digits`
                          }
                          maxLength={selectedPhoneCountry.maxDigits}
                          className={`flex-1 min-w-0 bg-white border ${errors.phone ? "border-red-400" : "border-slate-200"} border-l-0 rounded-r-xl px-3 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-200 font-sans font-normal`}
                        />
                      </div>
                      {/* Digit counter hint */}
                      <div className="flex items-center justify-between">
                        {errors.phone
                          ? <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.phone}</p>
                          : <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                              {selectedPhoneCountry.minDigits === selectedPhoneCountry.maxDigits
                                ? `Exactly ${selectedPhoneCountry.minDigits} digits required`
                                : `${selectedPhoneCountry.minDigits}–${selectedPhoneCountry.maxDigits} digits required`
                              }
                            </span>
                        }
                        <span className={`text-[10px] font-mono font-semibold mt-0.5 ${
                          phone.length >= selectedPhoneCountry.minDigits && phone.length <= selectedPhoneCountry.maxDigits
                            ? "text-green-500"
                            : phone.length > 0
                              ? "text-amber-500"
                              : "text-slate-300"
                        }`}>
                          {phone.length}/{selectedPhoneCountry.maxDigits}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Preferred Mode of Counselling <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {MODES.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className={`px-3 py-2.5 rounded-xl border text-[13px] font-medium font-sans transition-all duration-200 cursor-pointer text-left ${
                              mode === m
                                ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-semibold"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      {errors.mode && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.mode}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Visa Type Interested <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {VISA_TYPES.map(vt => (
                          <button
                            key={vt}
                            type="button"
                            onClick={() => setVisaType(vt)}
                            className={`px-3 py-2.5 rounded-xl border text-[13px] font-medium font-sans transition-all duration-200 cursor-pointer text-left ${
                              visaType === vt
                                ? "bg-accent-blue/10 border-accent-blue text-accent-blue font-semibold"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {vt}
                          </button>
                        ))}
                      </div>
                      {errors.visaType && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.visaType}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Study Destination <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <IOSPicker
                        options={COUNTRIES}
                        value={destination}
                        onChange={setDestination}
                        placeholder="Select a country"
                        icon={<Globe className="w-4 h-4" />}
                        label="Study Destination"
                        placement="top"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-3 bg-[#F08A00] hover:bg-[#C06E00] disabled:bg-[#F08A00]/60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md hover:scale-[1.01] disabled:scale-100 transition-all duration-200 cursor-pointer font-sans tracking-wide mt-2 flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Submit Enquiry"
                      )}
                    </button>

                    <p className="text-[10px] text-slate-400 font-sans font-normal text-center mt-1">
                      Your information is secure. We'll respond within 24 hours.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .modal-scroll::-webkit-scrollbar {
          display: none;
        }
        .overscroll-contain {
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
}
