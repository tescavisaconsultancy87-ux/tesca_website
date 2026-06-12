import React, { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import IOSPicker from "./IOSPicker";

const BAND_OPTIONS = [
  { value: "9.0", label: "9.0 Expert" },
  { value: "8.5", label: "8.5 Very Good" },
  { value: "8.0", label: "8.0 Very Good" },
  { value: "7.5", label: "7.5 Good" },
  { value: "7.0", label: "7.0 Good" },
  { value: "6.5", label: "6.5 Competent" },
  { value: "6.0", label: "6.0 Competent" },
  { value: "5.5", label: "5.5 Modest" },
  { value: "5.0", label: "5.0 Modest" },
];

const SECTIONS = [
  { id: "listening", label: "Listening Score", defaultVal: "7.5" },
  { id: "reading", label: "Reading Score", defaultVal: "7.0" },
  { id: "writing", label: "Writing Score", defaultVal: "6.5" },
  { id: "speaking", label: "Speaking Score", defaultVal: "7.0" },
];

const bandColors: Record<string, string> = {
  "9.0": "text-emerald-600 bg-emerald-50",
  "8.5": "text-emerald-600 bg-emerald-50",
  "8.0": "text-emerald-600 bg-emerald-50",
  "7.5": "text-accent-blue bg-accent-blue/10",
  "7.0": "text-accent-blue bg-accent-blue/10",
  "6.5": "text-amber-600 bg-amber-50",
  "6.0": "text-amber-600 bg-amber-50",
  "5.5": "text-red-500 bg-red-50",
  "5.0": "text-red-500 bg-red-50",
};

export default function IELTSBandCalculator() {
  const [scores, setScores] = useState<Record<string, string>>({
    listening: "7.5",
    reading: "7.0",
    writing: "6.5",
    speaking: "7.0",
  });
  const [calculated, setCalculated] = useState(false);
  const [overall, setOverall] = useState(0);

  const setScore = (id: string, val: string) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const calculate = () => {
    const l = parseFloat(scores.listening);
    const r = parseFloat(scores.reading);
    const w = parseFloat(scores.writing);
    const s = parseFloat(scores.speaking);
    const avg = (l + r + w + s) / 4;
    setOverall(Math.round(avg * 2) / 2);
    setCalculated(true);
  };

  const reset = () => {
    setCalculated(false);
  };

  const getBandLabel = (val: string) => BAND_OPTIONS.find(o => o.value === val)?.label ?? val;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {SECTIONS.map(section => {
          const val = scores[section.id];
          const color = bandColors[val] ?? "text-slate-700 bg-slate-100";
          return (
            <div key={section.id} className="p-4 rounded-xl bg-white/80 border border-[#E6F2F3] space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-sans">
                {section.label}
              </label>
              {calculated ? (
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${color} font-semibold text-sm`}>
                  <span>{getBandLabel(val)}</span>
                  <span className="font-bold text-base">{val}</span>
                </div>
              ) : (
                <IOSPicker
                  options={BAND_OPTIONS}
                  value={val}
                  onChange={(v) => setScore(section.id, v)}
                />
              )}
            </div>
          );
        })}
      </div>

      {calculated && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-blue/10 to-accent-indigo/10 border border-accent-blue/20 text-center space-y-1 animate-ios-fade-in">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
            Overall Band Projection Score
          </span>
          <div className="text-3xl font-extrabold font-display text-accent-indigo">
            {overall.toFixed(1)}
          </div>
        </div>
      )}

      <div className="col-span-2">
        <button
          onClick={calculated ? reset : calculate}
          className="w-full py-3.5 bg-accent-blue text-white font-semibold text-base rounded-xl shadow-md tracking-wide hover:scale-[1.01] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {calculated ? (
            <><RotateCcw className="w-4 h-4" /> Re-calculate</>
          ) : (
            <><Calculator className="w-4 h-4" /> Calculate Overall Band Score</>
          )}
        </button>
      </div>

      <style>{`
        @keyframes iosFadeIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-ios-fade-in {
          animation: iosFadeIn 0.25s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </div>
  );
}
