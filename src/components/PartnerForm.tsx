import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PartnerForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnershipModel, setPartnershipModel] = useState("Franchise Partner");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [comments, setComments] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState("");

  // Live validation checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid =
    fullName.trim().length >= 3 &&
    emailRegex.test(email) &&
    phone.length === 10 &&
    city.trim().length > 0 &&
    experience.trim().length > 0;

  const getErrors = () => {
    const tempErrors: Record<string, string> = {};

    if (touched.fullName) {
      if (!fullName.trim()) tempErrors.fullName = "Full Name is required.";
      else if (fullName.trim().length < 3) tempErrors.fullName = "Name must be at least 3 characters.";
    }

    if (touched.email) {
      if (!email) tempErrors.email = "Email Address is required.";
      else if (!emailRegex.test(email)) tempErrors.email = "Invalid email format.";
    }

    if (touched.phone) {
      if (!phone.trim()) tempErrors.phone = "Mobile Number is required.";
      else if (phone.length !== 10) tempErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (touched.city) {
      if (!city.trim()) tempErrors.city = "City and State are required.";
    }

    if (touched.experience) {
      if (!experience.trim()) tempErrors.experience = "Please describe your experience.";
    }

    return tempErrors;
  };

  const errors = getErrors();

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Keep only digits
    if (val.length <= 10) {
      setPhone(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          partnershipModel,
          experience,
          city,
          comments,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Partnership submission error:", err);
      setErrorMessage(err.message || "Failed to submit partnership request.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-emerald-100 rounded-3xl p-8 md:p-12 text-center shadow-xl max-w-2xl mx-auto my-8 animate-in fade-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-6 text-emerald-500">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 font-sans">
          Partnership Application Submitted!
        </h3>
        <p className="text-slate-600 text-base md:text-lg mb-6 leading-relaxed font-sans">
          Thank you, <strong className="text-slate-800">{fullName}</strong>, for applying to partner with TESCA. 
          A confirmation email has been sent to <strong className="text-slate-800">{email}</strong>. 
          Our Business Development team will contact you within <strong className="text-[#F08A00]">48 hours</strong> to discuss the next steps.
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left max-w-md mx-auto mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-sans">Application Details</p>
          <div className="text-sm space-y-1.5 text-slate-700 font-sans">
            <div><span className="font-semibold text-slate-500">Model:</span> {partnershipModel}</div>
            <div><span className="font-semibold text-slate-500">Location:</span> {city}</div>
            <div><span className="font-semibold text-slate-500">WhatsApp/Mobile:</span> {phone}</div>
          </div>
        </div>
        <button
          onClick={() => {
            setFullName("");
            setEmail("");
            setPhone("");
            setExperience("");
            setCity("");
            setComments("");
            setTouched({});
            setStatus("idle");
          }}
          className="bg-[#0F4C81] hover:bg-[#1a3a5f] text-white text-sm font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div id="partner-form-section" className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 md:p-10 shadow-xl max-w-3xl mx-auto my-8">
      <div className="mb-8 text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-2 font-sans">
          Become a TESCA Business Partner
        </h3>
        <p className="text-sm md:text-base text-slate-500 font-sans">
          Please fill out the form below, and our network growth manager will connect with you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {status === "error" && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Partnership Model Selection (Radio Cards) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 font-sans">
            Select Partnership Model *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setPartnershipModel("Franchise Partner")}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                partnershipModel === "Franchise Partner"
                  ? "border-[#0F4C81] bg-sky-50/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-800 text-base font-sans">Franchise Partner</span>
                <input
                  type="radio"
                  name="partnershipModel"
                  checked={partnershipModel === "Franchise Partner"}
                  onChange={() => setPartnershipModel("Franchise Partner")}
                  className="w-4 h-4 text-[#0F4C81] focus:ring-[#0F4C81]"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Operate a complete visa consultancy and training center under our brand. Includes CRM access, marketing support, and staff training.
              </p>
            </div>

            <div
              onClick={() => setPartnershipModel("Sub-Agent Program")}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                partnershipModel === "Sub-Agent Program"
                  ? "border-[#0F4C81] bg-sky-50/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-800 text-base font-sans">Sub-Agent Program</span>
                <input
                  type="radio"
                  name="partnershipModel"
                  checked={partnershipModel === "Sub-Agent Program"}
                  onChange={() => setPartnershipModel("Sub-Agent Program")}
                  className="w-4 h-4 text-[#0F4C81] focus:ring-[#0F4C81]"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Refer students or visa clients to us and earn attractive commission rewards. Best for travel agents, coaches, and freelancers.
              </p>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-sans">
              Full Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => handleBlur("fullName")}
                placeholder="Enter your name"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-slate-50/50 text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all ${
                  errors.fullName ? "border-rose-300 ring-rose-100" : "border-slate-200"
                }`}
              />
            </div>
            {errors.fullName && <p className="text-rose-600 text-xs mt-1.5 font-sans">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-sans">
              Email Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-slate-50/50 text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all ${
                  errors.email ? "border-rose-300 ring-rose-100" : "border-slate-200"
                }`}
              />
            </div>
            {errors.email && <p className="text-rose-600 text-xs mt-1.5 font-sans">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-sans">
              Mobile / WhatsApp (10 digits) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("phone")}
                maxLength={10}
                placeholder="e.g. 9824152731"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-slate-50/50 text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all ${
                  errors.phone ? "border-rose-300 ring-rose-100" : "border-slate-200"
                }`}
              />
            </div>
            {errors.phone && <p className="text-rose-600 text-xs mt-1.5 font-sans">{errors.phone}</p>}
          </div>

          {/* City & State */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-sans">
              City / State *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => handleBlur("city")}
                placeholder="e.g. Surat, Gujarat"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-slate-50/50 text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all ${
                  errors.city ? "border-rose-300 ring-rose-100" : "border-slate-200"
                }`}
              />
            </div>
            {errors.city && <p className="text-rose-600 text-xs mt-1.5 font-sans">{errors.city}</p>}
          </div>
        </div>

        {/* Experience details */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5 font-sans">
            Business / Professional Experience *
          </label>
          <div className="relative">
            <span className="absolute top-3.5 left-3.5 text-slate-400">
              <Briefcase className="w-4 h-4" />
            </span>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              onBlur={() => handleBlur("experience")}
              placeholder="Briefly describe your current business or work profile, and why you want to partner with us."
              rows={3}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-slate-50/50 text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all resize-none ${
                errors.experience ? "border-rose-300 ring-rose-100" : "border-slate-200"
              }`}
            />
          </div>
          {errors.experience && <p className="text-rose-600 text-xs mt-1.5 font-sans">{errors.experience}</p>}
        </div>

        {/* Comments/Questions */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5 font-sans">
            Any Comments or Questions (Optional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any specific questions or messages here."
            rows={2}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || status === "submitting"}
            className="w-full bg-[#F08A00] hover:bg-[#C06E00] disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm font-sans uppercase tracking-wider"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit Partnership Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
