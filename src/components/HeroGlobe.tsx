import React, { useState, useEffect } from "react";
import { ArrowUpRight, Cpu } from "lucide-react";

export default function HeroGlobe() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [scholarshipCount, setScholarshipCount] = useState(41280950);
  const [visaCount, setVisaCount] = useState(994);

  // Animated counters
  useEffect(() => {
    const interval = setInterval(() => {
      setScholarshipCount(prev => prev + Math.floor(Math.random() * 5) + 1);
      if (Math.random() > 0.8) {
        setVisaCount(prev => (prev < 996 ? prev + 1 : 994));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const countries = [
    { id: "us", name: "United States", code: "US", x: 220, y: 140, uni: "MIT, Stanford, Harvard", acceptance: "92.1% (TESCA pool)", routeColor: "#0A7880" },
    { id: "uk", name: "United Kingdom", code: "UK", x: 440, y: 100, uni: "Oxford, Cambridge, LSE", acceptance: "94.8% (TESCA pool)", routeColor: "#075E64" },
    { id: "ca", name: "Canada", code: "CA", x: 180, y: 100, uni: "U of T, Waterloo, UBC", acceptance: "96.2% (TESCA pool)", routeColor: "#F08A00" },
    { id: "au", name: "Australia", code: "AU", x: 780, y: 340, uni: "Melbourne, Sydney, ANU", acceptance: "97.4% (TESCA pool)", routeColor: "#0A7880" },
    { id: "de", name: "Germany", code: "DE", x: 470, y: 110, uni: "TU Munich, Heidelberg", acceptance: "91.5% (TESCA pool)", routeColor: "#F08A00" },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-slate-200/80 bg-white/70 p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden group">
      
      {/* Absolute Auroras in the background (pastel shades) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
      <div className="absolute -top-20 right-10 w-[200px] h-[200px] bg-highlight-purple/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Real-time dynamic stats & controls */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-slate-800 text-xs font-semibold uppercase tracking-wider font-mono">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Live Admissions Feed
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight tracking-tight text-support-white">
            Where Ambition meets <br />
            <span className="bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo bg-clip-text text-transparent">Global Destination</span>
          </h2>

          <p className="text-sm md:text-base text-support-gray leading-relaxed max-w-md">
            Click on any active study node on our interactive vector map to inspect acceptance metrics, flight routes, and average scholarship values.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 backdrop-blur-md shadow-sm">
              <div className="text-[10px] font-semibold text-support-gray/60 uppercase font-mono">Total Scholarships</div>
              <div className="text-lg md:text-xl font-bold font-display text-support-white mt-1">
                ${(scholarshipCount / 1000000).toFixed(2)}M+
              </div>
              <div className="text-[10px] text-green-600 flex items-center gap-1 mt-1 font-mono">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live incrementing
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 backdrop-blur-md shadow-sm">
              <div className="text-[10px] font-semibold text-support-gray/60 uppercase font-mono">Visa Success rate</div>
              <div className="text-lg md:text-xl font-bold font-display text-accent-blue mt-1">
                {(visaCount / 10).toFixed(1)}%
              </div>
              <div className="text-[10px] text-accent-blue/80 mt-1 font-mono">
                SLA Backed Guarantee
              </div>
            </div>
          </div>

          {/* Country list selectors */}
          <div className="space-y-2.5 pt-2">
            <span className="block text-[10px] font-bold text-support-gray/50 uppercase tracking-wider font-mono">Select Destination</span>
            <div className="flex flex-wrap gap-2">
              {countries.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c.id === selectedCountry ? null : c.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                    selectedCountry === c.id
                      ? "bg-accent-blue/10 border-accent-blue text-accent-indigo shadow-sm"
                      : "bg-slate-50 border-slate-200/60 hover:border-slate-300 text-support-gray"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: The Interactive SVG Map */}
        <div className="lg:col-span-7 flex justify-center relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50/50 backdrop-blur-lg">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <svg viewBox="0 0 900 450" className="w-full h-full object-contain pointer-events-auto select-none">
            {/* World Map Dotted Outlines Placeholder (Vector curves) */}
            <path
              d="M100 250 Q 150 200 200 150 T 300 120 T 400 130 T 500 200 T 600 280 T 700 320 T 800 250"
              fill="none"
              stroke="rgba(15, 23, 42, 0.05)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M50 120 Q 120 100 200 150 T 400 100 T 600 80 T 800 180"
              fill="none"
              stroke="rgba(15, 23, 42, 0.03)"
              strokeWidth="2"
            />
            
            {/* India Node (Source Point) */}
            <g>
              <circle cx="560" cy="220" r="14" fill="url(#indiaGlow)" opacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="560" cy="220" r="6" fill="#0A7880" />
              <text x="560" y="240" fill="#0A7880" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">ORIGIN (IN)</text>
            </g>

            {/* Flight Path Connections */}
            {countries.map(c => {
              const isSelected = selectedCountry === c.id;
              return (
                <g key={`route-${c.id}`}>
                  {/* Curved Path */}
                  <path
                    d={`M 560 220 Q ${(560 + c.x) / 2} ${(220 + c.y) / 2 - 80} ${c.x} ${c.y}`}
                    fill="none"
                    stroke={isSelected ? c.routeColor : "rgba(15, 23, 42, 0.08)"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    strokeDasharray={isSelected ? "none" : "5 5"}
                    className={isSelected ? "" : "opacity-40"}
                    transition="stroke 0.3s"
                  />
                  {/* Animated dash traveling along the path if selected */}
                  {isSelected && (
                    <path
                      d={`M 560 220 Q ${(560 + c.x) / 2} ${(220 + c.y) / 2 - 80} ${c.x} ${c.y}`}
                      fill="none"
                      stroke="#F08A00"
                      strokeWidth="2.5"
                      strokeDasharray="10 80"
                      strokeDashoffset="0"
                      className="animate-[dash_2s_linear_infinite]"
                    />
                  )}
                </g>
              );
            })}

            {/* Destination Nodes */}
            {countries.map(c => {
              const isSelected = selectedCountry === c.id;
              return (
                <g
                  key={`node-${c.id}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedCountry(c.id === selectedCountry ? null : c.id)}
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSelected ? "12" : "6"}
                    fill={c.routeColor}
                    opacity={isSelected ? "0.4" : "0.2"}
                    className="hover:scale-150 transition-all duration-300"
                  />
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSelected ? "6" : "3.5"}
                    fill={isSelected ? "#FFFFFF" : c.routeColor}
                  />
                  <text
                    x={c.x}
                    y={c.y - 12}
                    fill={isSelected ? "#0A7880" : "#1E293B"}
                    fontSize="10"
                    fontWeight={isSelected ? "bold" : "normal"}
                    textAnchor="middle"
                  >
                    {c.code}
                  </text>
                </g>
              );
            })}

            {/* Definitions for SVG Gradients */}
            <defs>
              <radialGradient id="indiaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0A7880" />
                <stop offset="100%" stopColor="#0A7880" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Floating UI overlay details */}
          {selectedCountry && (
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out] z-20">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-accent-blue uppercase tracking-wider font-mono">Active Target Node</span>
                <h4 className="text-sm font-bold text-support-white font-display">
                  {countries.find(c => c.id === selectedCountry)?.name}
                </h4>
                <p className="text-xs text-support-gray/80">
                  <span className="font-semibold text-support-slate">Top Universities:</span> {countries.find(c => c.id === selectedCountry)?.uni}
                </p>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[9px] font-bold text-accent-indigo uppercase tracking-wider font-mono">Acceptance Metric</span>
                <div className="text-xs font-semibold text-support-slate">
                  {countries.find(c => c.id === selectedCountry)?.acceptance}
                </div>
                <a
                  href={`/countries#${selectedCountry}`}
                  className="inline-flex items-center gap-0.5 text-xs text-accent-blue hover:underline"
                >
                  Explore <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {!selectedCountry && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-slate-200 bg-white/90 backdrop-blur-md shadow-md flex items-center gap-2 text-xs text-support-gray pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
              Click destination nodes to view routing
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-10 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-[10px] font-bold font-mono tracking-widest text-support-gray/50 uppercase">
          Supported Universities & Credentials
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <span className="text-sm font-bold font-display text-slate-800 tracking-wider">HARVARD UNIVERSITY</span>
          <span className="text-sm font-bold font-display text-slate-800 tracking-wider">OXFORD</span>
          <span className="text-sm font-bold font-display text-slate-800 tracking-wider">UNIVERSITY OF TORONTO</span>
          <span className="text-sm font-bold font-display text-slate-800 tracking-wider">TU MUNICH</span>
          <span className="text-sm font-bold font-display text-slate-800 tracking-wider">STANFORD</span>
        </div>
      </div>

      {/* CSS style inline definition for flight dash offset animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -90;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
