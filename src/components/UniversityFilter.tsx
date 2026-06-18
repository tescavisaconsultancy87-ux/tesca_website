import React, { useState, useEffect } from "react";
import { Globe, GraduationCap, ArrowRight, Search, X, Compass, Award, RefreshCw, Star, MapPin } from "lucide-react";

interface University {
  id: number;
  name: string;
  country: string;
  code: string;
  min_cgpa_percent: string;
  
  // Backward compatibility fields
  tuition_fees?: string | null;
  intake?: string | null;
  ielts_pte_req?: string | null;
  moi_accepted?: string | null;
  courses?: string | null;
  photo?: string | null;
  ug_fees?: string | null;
  pg_fees?: string | null;
  ug_ielts_pte_req?: string | null;
  pg_ielts_pte_req?: string | null;
  ug_moi_accepted?: string | null;
  pg_moi_accepted?: string | null;
  ug_intake?: string | null;
  pg_intake?: string | null;

  // New schema fields
  image_url?: string | null;
  ug_tuition_fees?: string | null;
  ug_intakes?: string | null;
  ug_ielts_pte?: string | null;
  ug_moi?: string | null;
  ug_courses?: string | null;
  pg_tuition_fees?: string | null;
  pg_intakes?: string | null;
  pg_ielts_pte?: string | null;
  pg_moi?: string | null;
  pg_courses?: string | null;
}

const countries = [
  { name: "All Destinations", code: "all" },
  { name: "USA", code: "us" },
  { name: "United Kingdom", code: "uk" },
  { name: "Canada", code: "ca" },
  { name: "Australia", code: "au" },
  { name: "Germany", code: "de" },
  { name: "New Zealand", code: "nz" },
  { name: "Ireland", code: "ie" },
  { name: "Singapore", code: "sg" },
  { name: "Switzerland", code: "ch" },
  { name: "Malaysia", code: "my" },
  { name: "Dubai", code: "ae" },
  { name: "Europe", code: "eu" },
];

const countryLabels: Record<string, string> = {
  us: "USA", uk: "United Kingdom", ca: "Canada", au: "Australia",
  de: "Germany", nz: "New Zealand", ie: "Ireland", sg: "Singapore",
  ch: "Switzerland", my: "Malaysia", ae: "Dubai", eu: "Europe",
};

const universityDomainMap: Record<string, string> = {
  "Stanford University": "stanford.edu",
  "Massachusetts Institute of Technology": "mit.edu",
  "Harvard University": "harvard.edu",
  "University of California, Berkeley": "berkeley.edu",
  "California Institute of Technology": "caltech.edu",
  "University of Oxford": "ox.ac.uk",
  "University of Cambridge": "cam.ac.uk",
  "Imperial College London": "imperial.ac.uk",
  "London School of Economics": "lse.ac.uk",
  "UCL": "ucl.ac.uk",
  "Leeds Beckett University": "leedsbeckett.ac.uk",
  "London Metropolitan University": "londonmet.ac.uk",
  "University of East London": "uel.ac.uk",
  "University of Wales Trinity Saint David": "uwtsd.ac.uk",
  "University of Hertfordshire": "herts.ac.uk",
  "University of West London": "uwl.ac.uk",
  "University of Hull": "hull.ac.uk",
  "University of Bedfordshire": "beds.ac.uk",
  "Birmingham City University": "bcu.ac.uk",
  "Brunel University of London": "brunel.ac.uk",
  "Glasgow Caledonian University": "gcu.ac.uk",
  "London South Bank University": "lsbu.ac.uk",
  "Nottingham Trent University": "ntu.ac.uk",
  "University of Essex": "essex.ac.uk",
  "University of Central Lancashire (UCLan)": "uclan.ac.uk",
  "University of Lincoln": "lincoln.ac.uk",
  "University of Wolverhampton": "wlv.ac.uk",
  "De Montfort University": "dmu.ac.uk",
  "University of Bradford": "bradford.ac.uk",
  "Arden University": "arden.ac.uk",
  "University of Greenwich": "gre.ac.uk",
  "Coventry University": "coventry.ac.uk",
  "Anglia Ruskin University": "aru.ac.uk",
  "Ravensbourne University London": "ravensbourne.ac.uk",
  "Edinburgh Napier University": "napier.ac.uk",
  "University of East Anglia": "uea.ac.uk",
  "University of York": "york.ac.uk",
  "University of Gloucestershire": "glos.ac.uk",
  "University of Sunderland": "sunderland.ac.uk",
  "University of Leicester": "le.ac.uk",
  "Teesside University": "tees.ac.uk",
  "Regent College London": "rcl.ac.uk",
  "University of Chester": "chester.ac.uk",
  "University of the West of Scotland": "uws.ac.uk",
  "University of Northampton": "northampton.ac.uk",
  "Swansea University": "swansea.ac.uk",
  "Southampton Solent University": "solent.ac.uk",
  "Aston University": "aston.ac.uk",
  "University of Roehampton": "roehampton.ac.uk",
  "Buckinghamshire New University": "bucks.ac.uk",
  "Northumbria University": "northumbria.ac.uk",
  "Royal Holloway, University of London": "royalholloway.ac.uk",
  "Middlesex University": "mdx.ac.uk",
  "Ulster University": "ulster.ac.uk",
  "University of Huddersfield": "hud.ac.uk",
  "The University of Law": "law.ac.uk",
  "University of Toronto": "utoronto.ca",
  "University of Waterloo": "uwaterloo.ca",
  "University of British Columbia": "ubc.ca",
  "McGill University": "mcgill.ca",
  "University of Alberta": "ualberta.ca",
  "University of Melbourne": "unimelb.edu.au",
  "University of Sydney": "sydney.edu.au",
  "Australian National University": "anu.edu.au",
  "UNSW Sydney": "unsw.edu.au",
  "Monash University": "monash.edu",
  "Technical University of Munich": "tum.de",
  "Heidelberg University": "uni-heidelberg.de",
  "RWTH Aachen University": "rwth-aachen.de",
  "LMU Munich": "lmu.de",
  "Karlsruhe Institute of Technology": "kit.edu",
  "University of Auckland": "auckland.ac.nz",
  "University of Otago": "otago.ac.nz",
  "Victoria University of Wellington": "wgtn.ac.nz",
  "Trinity College Dublin": "tcd.ie",
  "University College Dublin": "ucd.ie",
  "University of Galway": "universityofgalway.ie",
  "National University of Singapore": "nus.edu.sg",
  "Nanyang Technological University": "ntu.edu.sg",
  "ETH Zurich": "ethz.ch",
  "EPFL": "epfl.ch",
  "University of Zurich": "uzh.ch",
  "University of Malaya": "um.edu.my",
  "Universiti Kebangsaan Malaysia": "ukm.edu.my",
  "Universiti Sains Malaysia": "usm.my",
  "University of Dubai": "ud.ac.ae",
  "Khalifa University": "ku.ac.ae",
  "University of Amsterdam": "uva.nl",
  "Delft University of Technology": "tudelft.nl",
  "University of Copenhagen": "ku.dk"
};

function resolveUniversityDomain(name: string): string {
  if (universityDomainMap[name]) {
    return universityDomainMap[name];
  }
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return clean.split(/\s+/).slice(0, 2).join("") + ".edu";
}

function UniversityLogo({ domain, name }: { domain: string; name: string }) {
  const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${domain}`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`);
      setHasError(true);
    } else {
      setImgSrc("");
    }
  };

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${name} logo`}
        className="w-full h-full object-contain p-2"
        onError={handleError}
      />
    );
  }

  return (
    <span className="text-lg font-bold text-accent-blue font-display">
      {name.charAt(0)}
    </span>
  );
}

const PAGE_SIZE = 12;

export default function UniversityFilter() {
  const [activeCountry, setActiveCountry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<'UG' | 'PG'>('UG');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  // Sync state from query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get("country") || "all";
    const validCountry = countries.some(c => c.code === country.toLowerCase());
    if (validCountry) {
      setActiveCountry(country.toLowerCase());
    } else {
      setActiveCountry("all");
    }
  }, []);

  // Fetch universities when country selection changes
  useEffect(() => {
    const fetchUnis = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/universities?country=${activeCountry}`);
        if (res.ok) {
          const data = await res.json();
          setUniversities(data);
        } else {
          console.error("Failed to load universities");
        }
      } catch (e) {
        console.error("Error fetching universities:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnis();
    setVisibleCount(PAGE_SIZE);
  }, [activeCountry]);

  const handleFilter = (code: string) => {
    setActiveCountry(code);
    const url = new URL(window.location.href);
    if (code === "all") {
      url.searchParams.delete("country");
    } else {
      url.searchParams.set("country", code);
    }
    window.history.pushState({}, "", url.toString());
  };

  const filtered = universities.filter(uni => {
    const coursesStr = selectedLevel === 'UG'
      ? (uni.ug_courses || uni.courses || "")
      : (uni.pg_courses || "");
    const matchesKeyword = !searchQuery.trim() ||
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coursesStr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesKeyword;
  });

  const displayed = filtered.slice(0, visibleCount);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.ceil(visibleCount / PAGE_SIZE);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
  };

  return (
    <div className="space-y-8">
      
      {/* Country Filtering Buttons */}
      <div className="space-y-4 animate-fade-in text-left">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent-blue" />
          <h2 className="text-lg font-bold font-display text-slate-800 tracking-tight">Filter Study Destination</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {countries.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleFilter(c.code)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans transition-all duration-200 border cursor-pointer flex items-center gap-2 ${
                activeCountry === c.code
                  ? "bg-accent-blue text-white border-accent-blue shadow-md scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-accent-blue/30 hover:text-accent-blue hover:bg-accent-blue/5"
              }`}
            >
              {c.code !== "all" && (
                <img
                  src={`https://flagcdn.com/w20/${c.code === "uk" ? "gb" : c.code}.png`}
                  alt="Flag"
                  className="w-4 h-3 rounded-sm object-cover"
                />
              )}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Refine Filters panel */}
      <div className="bg-slate-50 rounded-[2rem] border border-slate-200/50 p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-6 space-y-1.5 text-left">
          <label htmlFor="course-search" className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Search Course / Keyword</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="course-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Computer Science, MBA, Harvard..."
              className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent-blue"
            />
          </div>
        </div>

        <div className="md:col-span-4 space-y-1.5 text-left">
          <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Select Level</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedLevel('UG')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'UG'
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Undergraduate (UG)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('PG')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'PG'
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Postgraduate (PG)
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setSelectedLevel('UG'); }}
            className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        {isLoading ? (
          <div className="h-4 bg-slate-100 rounded w-48 animate-pulse" />
        ) : (
          <p>
            Found <span className="font-bold text-slate-800">{filtered.length}</span> matching universities in {activeCountry === "all" ? "All destinations" : countryLabels[activeCountry]} for {selectedLevel === 'UG' ? 'Undergraduate (UG)' : 'Postgraduate (PG)'}
          </p>
        )}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <span className="text-[10px] text-slate-400">
            Showing {displayed.length} of {filtered.length}
          </span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-accent-blue animate-spin" />
          <p className="text-sm font-semibold text-slate-500 font-sans">Fetching universities...</p>
        </div>
      )}

      {/* Universities list */}
      {!isLoading && (
        filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white border border-slate-200 rounded-[2rem]">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold font-display text-slate-700">No matching universities found</h3>
            <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">Try loosening your search keywords or choosing a different level/country filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(uni => {
                const fees = selectedLevel === 'UG' 
                  ? (uni.ug_tuition_fees || uni.ug_fees || uni.tuition_fees || "N/A") 
                  : (uni.pg_tuition_fees || uni.pg_fees || "N/A");
                const intake = selectedLevel === 'UG' 
                  ? (uni.ug_intakes || uni.ug_intake || uni.intake || "N/A") 
                  : (uni.pg_intakes || uni.pg_intake || "N/A");
                const ielts = selectedLevel === 'UG' 
                  ? (uni.ug_ielts_pte || uni.ug_ielts_pte_req || uni.ielts_pte_req || "N/A") 
                  : (uni.pg_ielts_pte || uni.pg_ielts_pte_req || "N/A");
                const moi = selectedLevel === 'UG' 
                  ? (uni.ug_moi || uni.ug_moi_accepted || uni.moi_accepted || "Yes") 
                  : (uni.pg_moi || uni.pg_moi_accepted || "Yes");
                const courses = selectedLevel === 'UG' 
                  ? (uni.ug_courses || uni.courses || "") 
                  : (uni.pg_courses || "");

                return (
                  <div 
                    key={uni.id} 
                    onClick={() => setSelectedUniversity(uni)}
                    className="rounded-3xl border border-slate-200 bg-white hover:border-accent-blue hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 text-left"
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white p-1">
                            <UniversityLogo domain={resolveUniversityDomain(uni.name)} name={uni.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-bold font-display text-slate-800 leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">{uni.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <img
                                src={`https://flagcdn.com/w20/${uni.code === "uk" ? "gb" : uni.code}.png`}
                                alt="Flag"
                                className="w-4 h-3 rounded-sm object-cover"
                              />
                              <span className="text-xs text-slate-500 font-sans font-medium">{uni.country}</span>
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 ml-1">
                                {selectedLevel === 'UG' ? 'UG' : 'PG'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Requirements grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-sans text-slate-600 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Tuition Fees</span>
                            <span className="font-bold text-slate-700 truncate block">{fees}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Intake</span>
                            <span className="font-bold text-slate-700 truncate block">{intake}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Min Score Req</span>
                            <span className="font-bold text-slate-700 truncate block">{uni.min_cgpa_percent}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">MOI Accepted</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5 ${
                              moi.toLowerCase() === "yes" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              {moi}
                            </span>
                          </div>
                          <div className="col-span-2 border-t border-slate-100 pt-2">
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">English Requirement</span>
                            <span className="font-bold text-slate-700 block whitespace-normal truncate">{ielts}</span>
                          </div>
                        </div>

                        {courses && (
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide mb-1">Key Courses</span>
                            <div className="flex flex-wrap gap-1">
                              {courses.split(",").slice(0, 4).map((c, i) => (
                                <span key={i} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                  {c.trim()}
                                </span>
                              ))}
                              {courses.split(",").length > 4 && (
                                <span className="text-[9px] font-semibold bg-slate-50 text-slate-400 px-2 py-0.5 rounded">
                                  +{courses.split(",").length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View details CTA */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent-blue group-hover:underline inline-flex items-center gap-1 font-sans ml-auto">
                          View details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filtered.length && (
              <div className="flex flex-col items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-white border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )
      )}

      {/* University Detail Modal Overlay */}
      {selectedUniversity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal close */}
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100/85 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer border border-transparent hover:scale-105"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* University Cover & Logo */}
            <div className="h-48 relative bg-slate-100 border-b border-slate-100">
              {selectedUniversity.image_url || selectedUniversity.photo ? (
                <img
                  src={selectedUniversity.image_url || selectedUniversity.photo || ""}
                  alt={selectedUniversity.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-slate-50 flex items-center justify-center text-indigo-500">
                  <GraduationCap className="w-16 h-16 text-accent-blue" />
                </div>
              )}
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-6">
                <div className="flex items-center gap-4 relative z-10 w-full">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/50 flex items-center justify-center shrink-0 overflow-hidden shadow-lg p-1.5">
                    <UniversityLogo domain={resolveUniversityDomain(selectedUniversity.name)} name={selectedUniversity.name} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={`https://flagcdn.com/w20/${selectedUniversity.code === "uk" ? "gb" : selectedUniversity.code}.png`}
                        alt="Flag"
                        className="w-4 h-3 rounded-sm object-cover"
                      />
                      <span className="text-[10px] text-white font-bold tracking-wider uppercase">{selectedUniversity.country}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">{selectedUniversity.name}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-left">
              {/* General criteria */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Standard General Minimum Score Req</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedUniversity.min_cgpa_percent}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-medium block">Destination Code</span>
                  <span className="font-bold text-slate-800 text-sm uppercase">{selectedUniversity.code}</span>
                </div>
              </div>

              {/* Side-by-side UG & PG details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* UG info */}
                <div className="space-y-3 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-800 text-xs font-display flex items-center gap-1.5 pb-2 border-b border-indigo-100/30">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Undergraduate (UG) Details
                  </h4>
                  <ul className="space-y-2 text-xs font-sans">
                    <li className="flex justify-between"><span className="text-slate-500">Tuition Fees:</span> <span className="font-bold text-slate-700">{selectedUniversity.ug_tuition_fees || selectedUniversity.ug_fees || selectedUniversity.tuition_fees || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Intakes:</span> <span className="font-bold text-slate-700">{selectedUniversity.ug_intakes || selectedUniversity.ug_intake || selectedUniversity.intake || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">IELTS/PTE Limit:</span> <span className="font-bold text-slate-700">{selectedUniversity.ug_ielts_pte || selectedUniversity.ug_ielts_pte_req || selectedUniversity.ielts_pte_req || "N/A"}</span></li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">MOI Accepted:</span> 
                      <span className={`font-bold ${(selectedUniversity.ug_moi || selectedUniversity.ug_moi_accepted || selectedUniversity.moi_accepted)?.toLowerCase() === 'no' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedUniversity.ug_moi || selectedUniversity.ug_moi_accepted || selectedUniversity.moi_accepted || "N/A"}
                      </span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1 font-sans">UG Key Course pathways</span>
                    <div className="flex flex-wrap gap-1">
                      {(selectedUniversity.ug_courses || selectedUniversity.courses || "").split(",").map((c, i) => (
                        <span key={i} className="text-[9px] font-semibold bg-white border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-sans">
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PG info */}
                <div className="space-y-3 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-800 text-xs font-display flex items-center gap-1.5 pb-2 border-b border-emerald-100/30">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Postgraduate (PG) Details
                  </h4>
                  <ul className="space-y-2 text-xs font-sans">
                    <li className="flex justify-between"><span className="text-slate-500">Tuition Fees:</span> <span className="font-bold text-slate-700">{selectedUniversity.pg_tuition_fees || selectedUniversity.pg_fees || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Intakes:</span> <span className="font-bold text-slate-700">{selectedUniversity.pg_intakes || selectedUniversity.pg_intake || "N/A"}</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">IELTS/PTE Limit:</span> <span className="font-bold text-slate-700">{selectedUniversity.pg_ielts_pte || selectedUniversity.pg_ielts_pte_req || "N/A"}</span></li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">MOI Accepted:</span> 
                      <span className={`font-bold ${(selectedUniversity.pg_moi || selectedUniversity.pg_moi_accepted)?.toLowerCase() === 'no' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedUniversity.pg_moi || selectedUniversity.pg_moi_accepted || "N/A"}
                      </span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1 font-sans">PG Key Course pathways</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedUniversity.pg_courses ? (
                        selectedUniversity.pg_courses.split(",").map((c, i) => (
                          <span key={i} className="text-[9px] font-semibold bg-white border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-sans">
                            {c.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic font-sans">No Postgraduate details specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left font-sans">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Direct Inquiry Desk</span>
                <span className="text-xs font-bold text-slate-700">Need specific requirements clarified?</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedUniversity(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center font-sans"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUniversity(null);
                    (window as any).openCounsellorForm?.();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:scale-[1.02] cursor-pointer text-center font-sans"
                >
                  Speak to Counsellor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
