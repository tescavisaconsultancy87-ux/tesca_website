import React from "react";

interface D1Story {
  id: number;
  name: string;
  photo: string;
  type: string; // "Visa Success", "IELTS", "PTE"
  score?: string | null;
  country?: string | null;
}

const countryToCode = (country: string) => {
  if (!country) return "";
  const map: Record<string, string> = {
    canada: "ca",
    australia: "au",
    "united kingdom": "gb",
    uk: "gb",
    "united states": "us",
    usa: "us",
    germany: "de",
    ireland: "ie",
    "new zealand": "nz",
    singapore: "sg",
    dubai: "ae",
    uae: "ae",
    malaysia: "my",
    switzerland: "ch",
    europe: "eu",
  };
  return map[country.toLowerCase().trim()] || country.slice(0, 2).toLowerCase();
};

export default function StudentCarousel({ stories = [] }: { stories?: D1Story[] }) {
  if (!stories || stories.length === 0) {
    return null;
  }

  // Ensure there are enough cards to make infinite scroll smooth
  let displayStories = [...stories];
  while (displayStories.length < 12 && stories.length > 0) {
    displayStories = [...displayStories, ...stories];
  }

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
          Explore recent visa approvals and language proficiency achievements from our successful candidates.
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
          {[...displayStories, ...displayStories].map((student, idx) => (
            <div
              key={`${student.id}-${idx}`}
              className="flex-shrink-0 w-[230px] rounded-[1.5rem] border border-slate-200 bg-white hover:border-[#0A7880]/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left relative group shadow-sm flex flex-col overflow-hidden"
            >
              {/* Photo Box Container */}
              <div className="relative w-full h-[160px] overflow-hidden bg-slate-50 shrink-0">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none"
                  loading="lazy"
                />
                
                {/* Country Flag overlay on Top Right corner */}
                {student.type === "Visa Success" && student.country && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-[2px] p-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center justify-center">
                    <img
                      src={`https://flagcdn.com/w40/${countryToCode(student.country)}.png`}
                      alt={`${student.country} flag`}
                      className="w-5 h-3.5 rounded-xs object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Info Text Area (at bottom) */}
              <div className="p-4 flex flex-col justify-between flex-grow bg-white border-t border-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 font-display truncate leading-snug group-hover:text-[#0A7880] transition-colors">
                    {student.name}
                  </h4>
                  
                  {student.type === "Visa Success" ? (
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                      Visa: {student.country}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                      {student.type} Overall: {student.score}
                    </p>
                  )}
                </div>

                {/* Score badge at bottom */}
                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
                  <span className="text-[12px] font-extrabold text-[#0A7880] font-display">
                    {student.type === "Visa Success" ? "Approved" : student.score}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                    {student.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
