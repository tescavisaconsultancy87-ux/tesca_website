import React, { useState, useEffect } from "react";
import { X, Phone, Mail, User, Globe, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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

const MODES = ["Video Call", "Phone Call", "In-Person Meeting", "Email"];

export default function CounsellorForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "failed">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const handleOpen = () => {
      setStatus("idle");
      setSubmitError("");
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
    } else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      errs.phone = "Phone number must be between 8 and 15 digits";
    }
    if (!mode) errs.mode = "Please select a counselling mode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

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
          phone,
          subject: `New Student Enquiry - ${firstName} ${lastName} 🚀`,
          mode,
          destination,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMode("");
        setDestination("");
        setErrors({});
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      console.error("Enquiry submission failed:", err);
      setSubmitError(err.message || "Something went wrong. Please try again or reach us directly.");
      setStatus("failed");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMode("");
      setDestination("");
      setErrors({});
    }
  };

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
                    <h3 className="text-2xl font-extrabold font-display leading-tight">
                      Begin Your <br />Global Journey
                    </h3>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      Consult with India's leading visa advisors and unlock global education pathways.
                    </p>
                  </div>

                  <ul className="space-y-4 pt-4 border-t border-white/10 text-xs font-sans font-medium">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                      <span><strong>Free Evaluation</strong>: Assess your university admissions profile.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                      <span><strong>Visa Audit</strong>: Automated compliance pre-checks.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                      <span><strong>Scholarships</strong>: Access exclusive grants & funding guides.</span>
                    </li>
                  </ul>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/10 text-left space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Trust Indicator</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-display text-accent-cyan leading-none">99%</span>
                    <div className="text-[9px] leading-tight text-white/80 font-medium">
                      Visa Success SLA <br />ISO 9001 Certified
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form Area (58% width) */}
              <div className="col-span-1 md:col-span-7 p-6 md:p-8 flex flex-col justify-center bg-white relative">
                {status === "success" ? (
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
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
                              setPhone(digits);
                            }}
                            placeholder="1234567890"
                            maxLength={15}
                            className={`${inputClass("phone")} pl-10`}
                          />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-500 font-sans font-medium mt-0.5">{errors.phone}</p>}
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
