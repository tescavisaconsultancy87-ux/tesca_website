import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read env variables from .env manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valParts] = line.split('=');
  if (key && valParts.length > 0) {
    env[key.trim()] = valParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env['PUBLIC_SUPABASE_URL'];
const supabaseKey = env['PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking tables on Supabase URL:", supabaseUrl);
  
  const tables = ['success_stories', 'gallery_images', 'carousel_videos', 'carousel_items'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table '${table}' failed:`, error.message, `(Code: ${error.code})`);
      } else {
        console.log(`Table '${table}' success:`, data);
      }
    } catch (err) {
      console.log(`Table '${table}' exception:`, err.message);
    }
  }
}

check();
