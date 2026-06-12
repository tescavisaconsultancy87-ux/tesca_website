import React from "react";

export default function HeroVisuals() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:ml-auto select-none">
      
      {/* 1. SVG World Map Background Outline (Subtle Behind everything) */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none flex items-center justify-center scale-110">
        <svg viewBox="0 0 1000 500" className="w-full h-full object-contain">
          {/* North America */}
          <path d="M50,80 L180,60 L280,100 L320,180 L220,240 L180,300 L160,280 L120,220 L80,160 Z" fill="none" stroke="#F08A00" strokeWidth="2" strokeDasharray="3 3" />
          {/* South America */}
          <path d="M180,300 L240,310 L280,360 L240,460 L200,480 L180,420 L160,340 Z" fill="none" stroke="#F08A00" strokeWidth="2" strokeDasharray="3 3" />
          {/* Eurasia & Africa */}
          <path d="M420,60 L600,40 L800,80 L900,140 L780,240 L650,220 L580,280 L480,260 L440,160 Z" fill="none" stroke="#F08A00" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M480,260 L540,280 L580,340 L560,420 L480,440 L440,360 L420,300 Z" fill="none" stroke="#F08A00" strokeWidth="2" strokeDasharray="3 3" />
          {/* Australia */}
          <path d="M780,320 L840,310 L880,360 L840,400 L780,360 Z" fill="none" stroke="#F08A00" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* 2. Main Large Collegiate Building Card */}
      <div className="relative z-10 w-[80%] ml-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img 
          src="/images/campus.png" 
          alt="Premium collegiate campus architecture" 
          className="w-full h-[260px] md:h-[330px] object-cover rounded-2xl" 
        />
      </div>

      {/* 3. Overlapping Student Photo Card */}
      <div className="absolute left-0 bottom-8 z-20 w-[45%] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl hover:scale-[1.02] transition-transform duration-300">
        <img 
          src="/images/student_abroad.png" 
          alt="Smiling student ready to travel abroad" 
          className="w-full h-[150px] md:h-[190px] object-cover rounded-xl" 
        />
        {/* Visa status badge inside card */}
        <div className="mt-2 text-left px-1">
          <span className="text-[9px] font-semibold text-accent-cyan uppercase tracking-wider font-sans">Approved</span>
          <h4 className="text-[11px] font-bold text-slate-800 leading-tight font-display">Student Visa Stamp</h4>
        </div>
      </div>

      {/* 4. Elegant 3D Plane Flying OVER the cards along a flight arc */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        
        {/* Flight Arc Dotted Line */}
        <svg viewBox="0 0 500 400" className="w-full h-full">
          <path 
            id="flightPath" 
            d="M 50 350 Q 180 140 420 80" 
            fill="none" 
            stroke="#F08A00" 
            strokeWidth="2" 
            strokeDasharray="4 6" 
            opacity="0.8" 
          />
        </svg>

        {/* 3D Jet Plane Vector positioned absolutely over the cards */}
        <div 
          className="absolute top-[28%] left-[45%] w-16 h-16 transform rotate-[55deg] select-none animate-float"
          style={{
            filter: "drop-shadow(0px 8px 12px rgba(10, 120, 128, 0.35))",
            animationDuration: '4s'
          }}
        >
          <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Main Fuselage Body */}
            <path d="M32,8 L36,36 L32,56 L28,36 Z" fill="url(#fuselageGrad)" />
            {/* Left Main Wing */}
            <path d="M28,34 L4,44 L8,38 L28,24 Z" fill="url(#leftWingGrad)" />
            {/* Right Main Wing */}
            <path d="M36,34 L60,44 L56,38 L36,24 Z" fill="url(#rightWingGrad)" />
            {/* Tail Wing Left */}
            <path d="M30,52 L16,58 L18,55 L30,48 Z" fill="#075E64" />
            {/* Tail Wing Right */}
            <path d="M34,52 L48,58 L46,55 L34,48 Z" fill="#075E64" />
            {/* Cockpit Canopy */}
            <ellipse cx="32" cy="18" rx="2" ry="5" fill="#FFFFFF" opacity="0.95" />

            <defs>
              <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0A7880" />
                <stop offset="100%" stopColor="#075E64" />
              </linearGradient>
              <linearGradient id="leftWingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F08A00" />
                <stop offset="100%" stopColor="#C06E00" />
              </linearGradient>
              <linearGradient id="rightWingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C06E00" />
                <stop offset="100%" stopColor="#F08A00" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div>

    </div>
  );
}
