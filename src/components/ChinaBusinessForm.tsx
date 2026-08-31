import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Zap, Send, User, Phone, Building2, Clock, Award } from "lucide-react";

export default function ChinaBusinessForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    companyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.phone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number (e.g. 9824152731).");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          preferred_countries: ["China 🇨🇳"],
          visa_type: "Business (M Visa) / Canton Fair",
          notes: `Company: ${formData.companyName || 'Not specified'}`,
          source: "China Business Visa Page",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry. Please try again.");
      }

      setIsSuccess(true);
      if (typeof window !== "undefined" && (window as any).trackLeadEvent) {
        (window as any).trackLeadEvent("china_business_visa_form");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Trust Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-5 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No Visa, No Payment</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200/60">
          <Award className="w-4 h-4 text-red-600" />
          <span>100% Visa SLA</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>4-5 Day Express</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-sans">Application Received!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Our China Visa specialist from TESCA Surat will call you <b>within 30 minutes</b> with the official document checklist.
          </p>
          <div className="pt-3">
            <a
              href="https://wa.me/919824152731?text=Hi%20TESCA,%20I%20just%20applied%20for%20China%20Business%20Visa"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md"
            >
              <span>Instant Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              Apply for China Business (M) Visa
            </h3>
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Get a callback from our specialist within 30 minutes!</span>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (As in Passport)</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rajesh Kumar Shah"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* WhatsApp Mobile No. */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">WhatsApp Mobile No.</label>
              <span className={`text-[11px] font-bold transition-colors ${formData.phone.length === 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {formData.phone.length}/10 digits {formData.phone.length === 10 ? '✓' : ''}
              </span>
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                name="phone"
                required
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9824152731"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Business Name / Firm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Firm Name (Optional)</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Surat Textile Traders"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <span>Securing Slot...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Get Guaranteed China Business Visa Info</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            🔒 Protected by <b>No Visa, No Payment Guarantee</b>. Callback in 30 minutes.
          </p>
        </form>
      )}
    </div>
  );
}
