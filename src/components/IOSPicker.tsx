import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
  flag?: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export default function IOSPicker({
  options,
  value,
  onChange,
  placeholder = "Select",
  icon,
  error,
  disabled,
  className = "",
  label,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const baseTriggerClass = `w-full bg-white border ${error ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-200 font-sans font-normal flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        disabled={disabled}
        className={baseTriggerClass}
      >
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        <span className={`flex-1 text-left truncate flex items-center gap-2 ${!selectedOption ? "text-slate-400 font-normal" : "text-slate-800 font-medium"}`}>
          {selectedOption ? (
            <>
              {selectedOption.flag && (
                selectedOption.flag.length <= 3 ? (
                  <img
                    src={`https://flagcdn.com/w40/${selectedOption.flag.toLowerCase()}.png`}
                    alt=""
                    className="w-5 h-3.5 object-cover rounded-sm shrink-0 border border-slate-100 shadow-sm"
                  />
                ) : (
                  <span className="text-base leading-none">{selectedOption.flag}</span>
                )
              )}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 bottom-full mb-1.5 max-h-60 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 animate-ios-fade-in scrollbar-thin scrollbar-thumb-slate-200">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors duration-100 cursor-pointer ${
                value === opt.value
                  ? "bg-accent-blue/5 text-accent-blue font-semibold"
                  : "text-slate-800 font-normal hover:bg-slate-50"
              }`}
            >
              <span className="flex-1 truncate flex items-center gap-2">
                {opt.flag && (
                  opt.flag.length <= 3 ? (
                    <img
                      src={`https://flagcdn.com/w40/${opt.flag.toLowerCase()}.png`}
                      alt=""
                      className="w-5 h-3.5 object-cover rounded-sm shrink-0 border border-slate-100 shadow-sm"
                    />
                  ) : (
                    <span className="text-base leading-none">{opt.flag}</span>
                  )
                )}
                {opt.label}
              </span>
              {value === opt.value && (
                <Check className="w-4 h-4 text-accent-blue shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes iosFadeIn {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-ios-fade-in {
          animation: iosFadeIn 0.2s cubic-bezier(0.32, 0.72, 0, 1);
          transform-origin: bottom center;
        }
      `}</style>
    </div>
  );
}
