import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env file manually
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
} catch (err) {
  console.warn("Could not read .env file, relying on system env:", err.message);
}

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://zlsauoosumpnbyouhdfk.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("Missing PUBLIC_SUPABASE_ANON_KEY in env variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const universitiesDir = './public/images/universities';

// Known custom mappings for files that don't match names perfectly
const customMappings = {
  'Brunel University of London': 'Brunel-University-London-Medical-Doorway.webp',
  'University of Toronto': 'Universal_toronto.webp',
  'University of Cambridge': 'University-of-Cambridge.webp',
  'University of East Anglia': 'University-of-East-Anglia.webp',
  'University of Waterloo': 'University_of_Waterloo.jpg',
  'Victoria University of Wellington': 'Victoria-University-of-Wellington-New-Zealand.webp',
  'Aston University': 'aston.jpg',
  'Australian National University': 'aus_uni.webp',
  'Birmingham City University': 'birmingham_city.jpg',
  'Edinburgh Napier University': 'edinburgh Napier University.jpg',
  'Khalifa University': 'khalifa university.jpg',
  'McGill University': 'mcgill.jpg',
  'Monash University': 'monash.webp',
  'Anglia Ruskin University': 'rusking.jpg',
  'Trinity College Dublin': 'trinity college of dublin.jpg',
  'UCL': 'ucl.jpg',
  'University of Melbourne': 'unimelb.jpg',
  'University of Dubai': 'university of dubai.jpg',
  'University of Malaya': 'university of malaya.jpg',
  'University of York': 'university of york.jpg',
  'University of Zurich': 'university of zurich.jpg',
  'University of British Columbia': 'university_british_colombia.webp',
  'University of Sydney': 'university_sydney.jpg',
  'UNSW Sydney': 'unsw.webp',
  'University of the West of Scotland': 'uws.jpg'
};

async function main() {
  // Read all images
  const files = fs.readdirSync(universitiesDir);
  console.log(`Found ${files.length} images in local directory.`);

  // Get all universities from Supabase
  const { data: universities, error } = await supabase
    .from('universities')
    .select('id, name');

  if (error) {
    console.error('Error fetching universities:', error);
    return;
  }

  console.log(`Fetched ${universities.length} universities from Supabase.`);

  let updatedCount = 0;

  for (const uni of universities) {
    let matchedFile = null;

    // 1. Check custom mappings
    if (customMappings[uni.name]) {
      matchedFile = customMappings[uni.name];
    } else {
      // 2. Exact match (case insensitive, with extensions)
      const exactMatch = files.find(f => {
        const base = path.basename(f, path.extname(f)).toLowerCase();
        return base === uni.name.toLowerCase();
      });

      if (exactMatch) {
        matchedFile = exactMatch;
      } else {
        // 3. Fuzzy match: check if name contains or is contained by filename
        const fuzzyMatch = files.find(f => {
          const base = path.basename(f, path.extname(f)).toLowerCase();
          const uniLower = uni.name.toLowerCase();
          return base.includes(uniLower) || uniLower.includes(base);
        });
        if (fuzzyMatch) {
          matchedFile = fuzzyMatch;
        }
      }
    }

    if (matchedFile) {
      const imageUrl = `/images/universities/${matchedFile}`;
      console.log(`Matching: "${uni.name}" => "${imageUrl}"`);

      const { error: updateError } = await supabase
        .from('universities')
        .update({
          photo: imageUrl,
          image_url: imageUrl
        })
        .eq('id', uni.id);

      if (updateError) {
        console.error(`Failed to update ${uni.name}:`, updateError);
      } else {
        updatedCount++;
      }
    } else {
      console.warn(`No match found for: "${uni.name}"`);
    }
  }

  console.log(`Successfully updated ${updatedCount} universities.`);
}

main();
