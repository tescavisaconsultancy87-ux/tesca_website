import React, { useState, useEffect } from "react";
import { Globe, MapPin, Star, GraduationCap, ArrowRight } from "lucide-react";

interface University {
  name: string;
  country: string;
  code: string;
  rank: number;
  domain: string;
  city: string;
  established: number;
  students: string;
}

const countries = [
  { name: "All", code: "all" },
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

const universities: University[] = [
  { name: "Stanford University", country: "USA", code: "us", rank: 1, domain: "stanford.edu", city: "Stanford, CA", established: 1885, students: "17,000+" },
  { name: "Massachusetts Institute of Technology", country: "USA", code: "us", rank: 2, domain: "mit.edu", city: "Cambridge, MA", established: 1861, students: "12,000+" },
  { name: "Harvard University", country: "USA", code: "us", rank: 3, domain: "harvard.edu", city: "Cambridge, MA", established: 1636, students: "31,000+" },
  { name: "University of California, Berkeley", country: "USA", code: "us", rank: 4, domain: "berkeley.edu", city: "Berkeley, CA", established: 1868, students: "45,000+" },
  { name: "California Institute of Technology", country: "USA", code: "us", rank: 5, domain: "caltech.edu", city: "Pasadena, CA", established: 1891, students: "2,200+" },
  { name: "University of Oxford", country: "United Kingdom", code: "uk", rank: 1, domain: "ox.ac.uk", city: "Oxford", established: 1096, students: "25,000+" },
  { name: "University of Cambridge", country: "United Kingdom", code: "uk", rank: 2, domain: "cam.ac.uk", city: "Cambridge", established: 1209, students: "24,000+" },
  { name: "Imperial College London", country: "United Kingdom", code: "uk", rank: 3, domain: "imperial.ac.uk", city: "London", established: 1907, students: "22,000+" },
  { name: "London School of Economics", country: "United Kingdom", code: "uk", rank: 4, domain: "lse.ac.uk", city: "London", established: 1895, students: "12,000+" },
  { name: "UCL", country: "United Kingdom", code: "uk", rank: 5, domain: "ucl.ac.uk", city: "London", established: 1826, students: "43,000+" },
  { name: "Leeds Beckett University", country: "United Kingdom", code: "uk", rank: 6, domain: "leedsbeckett.ac.uk", city: "Leeds", established: 1824, students: "28,000+" },
  { name: "London Metropolitan University", country: "United Kingdom", code: "uk", rank: 7, domain: "londonmet.ac.uk", city: "London", established: 1848, students: "12,000+" },
  { name: "University of East London", country: "United Kingdom", code: "uk", rank: 8, domain: "uel.ac.uk", city: "London", established: 1898, students: "25,000+" },
  { name: "University of Wales Trinity Saint David", country: "United Kingdom", code: "uk", rank: 9, domain: "uwtsd.ac.uk", city: "Swansea", established: 1822, students: "15,000+" },
  { name: "University of Hertfordshire", country: "United Kingdom", code: "uk", rank: 10, domain: "herts.ac.uk", city: "Hatfield", established: 1952, students: "32,000+" },
  { name: "University of West London", country: "United Kingdom", code: "uk", rank: 11, domain: "uwl.ac.uk", city: "London", established: 1860, students: "20,000+" },
  { name: "University of Hull", country: "United Kingdom", code: "uk", rank: 12, domain: "hull.ac.uk", city: "Hull", established: 1927, students: "16,000+" },
  { name: "University of Bedfordshire", country: "United Kingdom", code: "uk", rank: 13, domain: "beds.ac.uk", city: "Luton", established: 1882, students: "14,000+" },
  { name: "Birmingham City University", country: "United Kingdom", code: "uk", rank: 14, domain: "bcu.ac.uk", city: "Birmingham", established: 1843, students: "29,000+" },
  { name: "Brunel University of London", country: "United Kingdom", code: "uk", rank: 15, domain: "brunel.ac.uk", city: "London", established: 1966, students: "15,000+" },
  { name: "Glasgow Caledonian University", country: "United Kingdom", code: "uk", rank: 16, domain: "gcu.ac.uk", city: "Glasgow", established: 1993, students: "20,000+" },
  { name: "London South Bank University", country: "United Kingdom", code: "uk", rank: 17, domain: "lsbu.ac.uk", city: "London", established: 1892, students: "18,000+" },
  { name: "Nottingham Trent University", country: "United Kingdom", code: "uk", rank: 18, domain: "ntu.ac.uk", city: "Nottingham", established: 1843, students: "35,000+" },
  { name: "University of Essex", country: "United Kingdom", code: "uk", rank: 19, domain: "essex.ac.uk", city: "Colchester", established: 1963, students: "17,500+" },
  { name: "University of Central Lancashire (UCLan)", country: "United Kingdom", code: "uk", rank: 20, domain: "uclan.ac.uk", city: "Preston", established: 1828, students: "38,000+" },
  { name: "University of Lincoln", country: "United Kingdom", code: "uk", rank: 21, domain: "lincoln.ac.uk", city: "Lincoln", established: 1996, students: "16,000+" },
  { name: "University of Wolverhampton", country: "United Kingdom", code: "uk", rank: 22, domain: "wlv.ac.uk", city: "Wolverhampton", established: 1992, students: "18,000+" },
  { name: "De Montfort University", country: "United Kingdom", code: "uk", rank: 23, domain: "dmu.ac.uk", city: "Leicester", established: 1870, students: "27,000+" },
  { name: "University of Bradford", country: "United Kingdom", code: "uk", rank: 24, domain: "bradford.ac.uk", city: "Bradford", established: 1966, students: "10,000+" },
  { name: "Arden University", country: "United Kingdom", code: "uk", rank: 25, domain: "arden.ac.uk", city: "Coventry", established: 1990, students: "23,000+" },
  { name: "University of Greenwich", country: "United Kingdom", code: "uk", rank: 26, domain: "gre.ac.uk", city: "London", established: 1890, students: "22,000+" },
  { name: "Coventry University", country: "United Kingdom", code: "uk", rank: 27, domain: "coventry.ac.uk", city: "Coventry", established: 1843, students: "38,000+" },
  { name: "Anglia Ruskin University", country: "United Kingdom", code: "uk", rank: 28, domain: "aru.ac.uk", city: "Cambridge", established: 1858, students: "26,000+" },
  { name: "Ravensbourne University London", country: "United Kingdom", code: "uk", rank: 29, domain: "ravensbourne.ac.uk", city: "London", established: 1959, students: "3,000+" },
  { name: "Edinburgh Napier University", country: "United Kingdom", code: "uk", rank: 30, domain: "napier.ac.uk", city: "Edinburgh", established: 1964, students: "19,500+" },
  { name: "University of East Anglia", country: "United Kingdom", code: "uk", rank: 31, domain: "uea.ac.uk", city: "Norwich", established: 1963, students: "17,000+" },
  { name: "University of York", country: "United Kingdom", code: "uk", rank: 32, domain: "york.ac.uk", city: "York", established: 1963, students: "22,000+" },
  { name: "University of Gloucestershire", country: "United Kingdom", code: "uk", rank: 33, domain: "glos.ac.uk", city: "Cheltenham", established: 1847, students: "9,000+" },
  { name: "University of Sunderland", country: "United Kingdom", code: "uk", rank: 34, domain: "sunderland.ac.uk", city: "Sunderland", established: 1901, students: "20,000+" },
  { name: "University of Leicester", country: "United Kingdom", code: "uk", rank: 35, domain: "le.ac.uk", city: "Leicester", established: 1921, students: "20,500+" },
  { name: "Teesside University", country: "United Kingdom", code: "uk", rank: 36, domain: "tees.ac.uk", city: "Middlesbrough", established: 1930, students: "21,000+" },
  { name: "Regent College London", country: "United Kingdom", code: "uk", rank: 37, domain: "rcl.ac.uk", city: "London", established: 2010, students: "8,000+" },
  { name: "University of Chester", country: "United Kingdom", code: "uk", rank: 38, domain: "chester.ac.uk", city: "Chester", established: 1839, students: "15,000+" },
  { name: "University of the West of Scotland", country: "United Kingdom", code: "uk", rank: 39, domain: "uws.ac.uk", city: "Paisley", established: 1897, students: "17,000+" },
  { name: "University of Northampton", country: "United Kingdom", code: "uk", rank: 40, domain: "northampton.ac.uk", city: "Northampton", established: 1924, students: "14,000+" },
  { name: "Swansea University", country: "United Kingdom", code: "uk", rank: 41, domain: "swansea.ac.uk", city: "Swansea", established: 1920, students: "20,000+" },
  { name: "Southampton Solent University", country: "United Kingdom", code: "uk", rank: 42, domain: "solent.ac.uk", city: "Southampton", established: 1856, students: "11,000+" },
  { name: "Aston University", country: "United Kingdom", code: "uk", rank: 43, domain: "aston.ac.uk", city: "Birmingham", established: 1895, students: "15,500+" },
  { name: "University of Roehampton", country: "United Kingdom", code: "uk", rank: 44, domain: "roehampton.ac.uk", city: "London", established: 1841, students: "9,000+" },
  { name: "Buckinghamshire New University", country: "United Kingdom", code: "uk", rank: 45, domain: "bucks.ac.uk", city: "High Wycombe", established: 1891, students: "14,000+" },
  { name: "Northumbria University", country: "United Kingdom", code: "uk", rank: 46, domain: "northumbria.ac.uk", city: "Newcastle", established: 1880, students: "32,000+" },
  { name: "Royal Holloway, University of London", country: "United Kingdom", code: "uk", rank: 47, domain: "royalholloway.ac.uk", city: "Egham", established: 1879, students: "11,000+" },
  { name: "Middlesex University", country: "United Kingdom", code: "uk", rank: 48, domain: "mdx.ac.uk", city: "London", established: 1878, students: "19,000+" },
  { name: "Ulster University", country: "United Kingdom", code: "uk", rank: 49, domain: "ulster.ac.uk", city: "Belfast", established: 1968, students: "27,000+" },
  { name: "University of Huddersfield", country: "United Kingdom", code: "uk", rank: 50, domain: "hud.ac.uk", city: "Huddersfield", established: 1825, students: "17,000+" },
  { name: "The University of Law", country: "United Kingdom", code: "uk", rank: 51, domain: "law.ac.uk", city: "London", established: 1876, students: "8,000+" },
  { name: "University of Toronto", country: "Canada", code: "ca", rank: 1, domain: "utoronto.ca", city: "Toronto, ON", established: 1827, students: "64,000+" },
  { name: "University of Waterloo", country: "Canada", code: "ca", rank: 2, domain: "uwaterloo.ca", city: "Waterloo, ON", established: 1957, students: "42,000+" },
  { name: "University of British Columbia", country: "Canada", code: "ca", rank: 3, domain: "ubc.ca", city: "Vancouver, BC", established: 1908, students: "65,000+" },
  { name: "McGill University", country: "Canada", code: "ca", rank: 4, domain: "mcgill.ca", city: "Montreal, QC", established: 1821, students: "40,000+" },
  { name: "University of Alberta", country: "Canada", code: "ca", rank: 5, domain: "ualberta.ca", city: "Edmonton, AB", established: 1908, students: "40,000+" },
  { name: "University of Melbourne", country: "Australia", code: "au", rank: 1, domain: "unimelb.edu.au", city: "Melbourne, VIC", established: 1853, students: "52,000+" },
  { name: "University of Sydney", country: "Australia", code: "au", rank: 2, domain: "sydney.edu.au", city: "Sydney, NSW", established: 1850, students: "65,000+" },
  { name: "Australian National University", country: "Australia", code: "au", rank: 3, domain: "anu.edu.au", city: "Canberra, ACT", established: 1946, students: "25,000+" },
  { name: "UNSW Sydney", country: "Australia", code: "au", rank: 4, domain: "unsw.edu.au", city: "Sydney, NSW", established: 1949, students: "62,000+" },
  { name: "Monash University", country: "Australia", code: "au", rank: 5, domain: "monash.edu", city: "Melbourne, VIC", established: 1958, students: "55,000+" },
  { name: "Technical University of Munich", country: "Germany", code: "de", rank: 1, domain: "tum.de", city: "Munich", established: 1868, students: "50,000+" },
  { name: "Heidelberg University", country: "Germany", code: "de", rank: 2, domain: "uni-heidelberg.de", city: "Heidelberg", established: 1386, students: "30,000+" },
  { name: "RWTH Aachen University", country: "Germany", code: "de", rank: 3, domain: "rwth-aachen.de", city: "Aachen", established: 1870, students: "47,000+" },
  { name: "LMU Munich", country: "Germany", code: "de", rank: 4, domain: "lmu.de", city: "Munich", established: 1472, students: "52,000+" },
  { name: "Karlsruhe Institute of Technology", country: "Germany", code: "de", rank: 5, domain: "kit.edu", city: "Karlsruhe", established: 1825, students: "28,000+" },
  { name: "University of Auckland", country: "New Zealand", code: "nz", rank: 1, domain: "auckland.ac.nz", city: "Auckland", established: 1883, students: "40,000+" },
  { name: "University of Otago", country: "New Zealand", code: "nz", rank: 2, domain: "otago.ac.nz", city: "Dunedin", established: 1869, students: "20,000+" },
  { name: "Victoria University of Wellington", country: "New Zealand", code: "nz", rank: 3, domain: "wgtn.ac.nz", city: "Wellington", established: 1897, students: "22,000+" },
  { name: "Trinity College Dublin", country: "Ireland", code: "ie", rank: 1, domain: "tcd.ie", city: "Dublin", established: 1592, students: "19,000+" },
  { name: "University College Dublin", country: "Ireland", code: "ie", rank: 2, domain: "ucd.ie", city: "Dublin", established: 1854, students: "33,000+" },
  { name: "University of Galway", country: "Ireland", code: "ie", rank: 3, domain: "universityofgalway.ie", city: "Galway", established: 1845, students: "19,000+" },
  { name: "National University of Singapore", country: "Singapore", code: "sg", rank: 1, domain: "nus.edu.sg", city: "Singapore", established: 1905, students: "38,000+" },
  { name: "Nanyang Technological University", country: "Singapore", code: "sg", rank: 2, domain: "ntu.edu.sg", city: "Singapore", established: 1981, students: "33,000+" },
  { name: "ETH Zurich", country: "Switzerland", code: "ch", rank: 1, domain: "ethz.ch", city: "Zurich", established: 1855, students: "24,000+" },
  { name: "EPFL", country: "Switzerland", code: "ch", rank: 2, domain: "epfl.ch", city: "Lausanne", established: 1969, students: "12,000+" },
  { name: "University of Zurich", country: "Switzerland", code: "ch", rank: 3, domain: "uzh.ch", city: "Zurich", established: 1833, students: "28,000+" },
  { name: "University of Malaya", country: "Malaysia", code: "my", rank: 1, domain: "um.edu.my", city: "Kuala Lumpur", established: 1905, students: "25,000+" },
  { name: "Universiti Kebangsaan Malaysia", country: "Malaysia", code: "my", rank: 2, domain: "ukm.edu.my", city: "Bangi", established: 1970, students: "30,000+" },
  { name: "Universiti Sains Malaysia", country: "Malaysia", code: "my", rank: 3, domain: "usm.my", city: "Penang", established: 1969, students: "28,000+" },
  { name: "University of Dubai", country: "Dubai", code: "ae", rank: 1, domain: "ud.ac.ae", city: "Dubai", established: 1997, students: "4,000+" },
  { name: "Khalifa University", country: "Dubai", code: "ae", rank: 2, domain: "ku.ac.ae", city: "Abu Dhabi", established: 2007, students: "5,000+" },
  { name: "University of Amsterdam", country: "Europe", code: "eu", rank: 1, domain: "uva.nl", city: "Amsterdam", established: 1632, students: "40,000+" },
  { name: "Delft University of Technology", country: "Europe", code: "eu", rank: 2, domain: "tudelft.nl", city: "Delft", established: 1842, students: "25,000+" },
  { name: "University of Copenhagen", country: "Europe", code: "eu", rank: 3, domain: "ku.dk", city: "Copenhagen", established: 1479, students: "38,000+" },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="relative p-6 pb-4 flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 shimmer shrink-0" />
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 bg-slate-100 rounded w-3/4 shimmer" />
            <div className="h-5 bg-slate-100 rounded-full w-12 shimmer shrink-0" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-1/3 shimmer" />
        </div>
      </div>
      <div className="px-6 pb-4 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-1/2 shimmer" />
        <div className="h-3.5 bg-slate-100 rounded w-5/6 shimmer" />
      </div>
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <div className="h-3.5 bg-slate-100 rounded w-1/4 shimmer" />
      </div>
    </div>
  );
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

export default function UniversityFilter() {
  const [activeCountry, setActiveCountry] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get("country") || "all";
    setActiveCountry(country);
    setVisibleCount(12);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleFilter = (code: string) => {
    setIsLoading(true);
    setActiveCountry(code);
    setVisibleCount(12);
    const url = code === "all" ? "/universities" : `/universities?country=${code}`;
    window.history.replaceState({}, "", url);
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  };

  const filtered = activeCountry === "all"
    ? universities
    : universities.filter(u => u.code === activeCountry);

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-accent-blue" />
          <h2 className="text-lg font-bold font-display text-slate-800 tracking-tight">Filter by Country</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map(c => {
            const isActive = activeCountry === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleFilter(c.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium font-sans transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "bg-accent-blue text-white border-accent-blue shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-accent-blue/30 hover:text-accent-blue hover:bg-accent-blue/5"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        {isLoading ? (
          <div className="h-5 bg-slate-100 rounded w-32 shimmer animate-pulse" />
        ) : (
          <p className="text-sm text-slate-500 font-sans font-medium">
            <span className="font-bold text-slate-800">{filtered.length}</span> {filtered.length === 1 ? "university" : "universities"} found
          </p>
        )}
        {!isLoading && activeCountry !== "all" && (
          <button
            type="button"
            onClick={() => handleFilter("all")}
            className="text-sm text-accent-blue hover:underline font-sans font-semibold cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          filtered.slice(0, visibleCount).map((uni) => (
            <div key={uni.name} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden group">
              <div className="relative p-6 pb-4 flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white">
                  <UniversityLogo domain={uni.domain} name={uni.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold font-display text-slate-800 leading-snug line-clamp-2">{uni.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full shrink-0 font-sans">
                      <Star className="w-3 h-3" />
                      #{uni.rank}
                    </div>
                  </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                    <img
                      src={`https://flagcdn.com/w20/${uni.code === "uk" ? "gb" : uni.code}.png`}
                      alt={`${uni.country} flag`}
                      className="w-4 h-3 rounded-sm object-cover"
                      loading="lazy"
                    />
                    <span className="text-xs text-slate-500 font-sans font-medium truncate">{uni.country}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{uni.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Est. {uni.established} &middot; {uni.students} students</span>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <a
                  href={`/countries#${uni.code}`}
                  className="text-xs font-semibold text-accent-blue hover:underline inline-flex items-center gap-1 font-sans"
                >
                  {countryLabels[uni.code] || uni.country} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && filtered.length > visibleCount && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-700 font-semibold text-sm rounded-full shadow-sm hover:border-accent-blue/30 hover:text-accent-blue transition-all duration-200 cursor-pointer hover:scale-[1.02]"
          >
            Load More Universities
          </button>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold font-display text-slate-600">No universities found</h3>
          <p className="text-sm text-slate-400 font-sans font-normal">Try selecting a different country filter.</p>
        </div>
      )}

      {!isLoading && activeCountry !== "all" && filtered.length > 0 && (
        <div className="mt-16 text-center">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/50 p-8 md:p-12 shadow-sm">
            <h2 className="text-[24px] sm:text-[28px] font-bold font-display text-slate-800 tracking-tight mb-3">
              Ready to start your journey?
            </h2>
            <p className="text-sm text-slate-600 font-sans font-normal max-w-md mx-auto mb-6">
              Get personalised guidance on applications, scholarships, and visa processes for your chosen universities.
            </p>
            <button
              type="button"
              onClick={() => (window as any).openCounsellorForm?.()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold text-sm rounded-full shadow-md hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              Speak to Our Counsellor <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
