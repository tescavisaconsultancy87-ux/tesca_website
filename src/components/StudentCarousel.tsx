import React from "react";

interface D1Story {
  id: number;
  name: string;
  photo: string;
  type: string; // "Visa Success", "IELTS", "PTE", or "Video"
  score?: string | null;
  country?: string | null;
  video_url?: string | null;
  is_video?: boolean;
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
    japan: "jp",
    dubai: "ae",
    uae: "ae",
    malaysia: "my",
    switzerland: "ch",
    europe: "eu",
  };
  return map[country.toLowerCase().trim()] || country.slice(0, 2).toLowerCase();
};

const fallbackStories: D1Story[] = [
  {
    id: 1,
    name: "Aarav Patel",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    type: "IELTS",
    score: "8.0",
    country: null
  },
  {
    id: 2,
    name: "Sneha Reddy",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    type: "PTE",
    score: "84",
    country: null
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    type: "Visa Success",
    score: null,
    country: "United Kingdom"
  },
  {
    id: 4,
    name: "Meera Krishnan",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    type: "IELTS",
    score: "7.5",
    country: null
  },
  {
    id: 5,
    name: "Kabir Mehra",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    type: "PTE",
    score: "79",
    country: null
  },
  {
    id: 6,
    name: "Jaspreet Kaur",
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
    type: "Visa Success",
    score: null,
    country: "Canada"
  }
];

export default function StudentCarousel({ stories = [] }: { stories?: D1Story[] }) {
  const activeStories = stories && stories.length > 0 ? stories : fallbackStories;

  // Ensure there are enough cards to make infinite scroll smooth
  let displayStories = [...activeStories];
  while (displayStories.length < 12 && activeStories.length > 0) {
    displayStories = [...displayStories, ...activeStories];
  }

  return (
    <div className="w-full py-16 bg-white overflow-hidden font-sans border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10 text-center">
        <span className="text-xs font-bold tracking-wider text-accent-indigo uppercase bg-accent-blue/10 px-4 py-1.5 rounded-full border border-accent-blue/20 font-sans">
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
          {[...displayStories, ...displayStories].map((student, idx) => {
            const cardContent = (
              <div className="flex-shrink-0 w-[260px] rounded-[1.5rem] border border-slate-200 bg-white hover:border-[#0A7880]/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left relative group shadow-sm flex flex-col overflow-hidden h-full">
                {/* Photo Box Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-50 shrink-0">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-550 select-none"
                    loading="lazy"
                  />
                  
                  {/* Play button overlay for video */}
                  {student.is_video && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A7880] ml-0.5">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    </div>
                  )}

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
                    
                    {student.is_video ? (
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                        Watch Success Video
                      </p>
                    ) : student.type === "Visa Success" ? (
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
                      {student.is_video ? "Play ➔" : student.type === "Visa Success" ? "Approved" : student.score}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                      {student.type}
                    </span>
                  </div>
                </div>
              </div>
            );

            if (student.is_video && student.video_url) {
              return (
                <a
                  key={`${student.id}-${idx}`}
                  href={student.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline cursor-pointer block hover:no-underline"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={`${student.id}-${idx}`}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
