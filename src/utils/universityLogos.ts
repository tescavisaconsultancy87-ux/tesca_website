export const universityDomainMap: Record<string, string> = {
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

export function resolveUniversityDomain(name: string): string {
  if (universityDomainMap[name]) {
    return universityDomainMap[name];
  }
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return clean.split(/\s+/).slice(0, 2).join("") + ".edu";
}

export function resolveUniversityLogoUrl(name: string, customUrl?: string | null): string {
  if (customUrl && customUrl.trim() !== "") {
    return customUrl.trim();
  }
  const domain = resolveUniversityDomain(name);
  return `https://logo.clearbit.com/${domain}`;
}

const COUNTRY_CAMPUS_PHOTOS: Record<string, string> = {
  uk: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
  us: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
  ca: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
  au: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
  de: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
  nz: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
  ie: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
  sg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
  ch: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
  my: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
  ae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  eu: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
};

export function resolveUniversityCampusPhoto(countryCode?: string | null, customPhoto?: string | null): string {
  if (customPhoto && customPhoto.trim() !== "") {
    return customPhoto.trim();
  }
  const code = (countryCode || "").toLowerCase().trim();
  return COUNTRY_CAMPUS_PHOTOS[code] || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop";
}
