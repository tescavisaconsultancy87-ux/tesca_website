import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/PUBLIC_SUPABASE_ANON_KEY are required in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function base64ToStorageUrl(base64Str, folder) {
  if (!base64Str || !base64Str.startsWith('data:image/')) return base64Str;
  try {
    const match = base64Str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!match) return null;

    const mimeExt = match[1] === 'jpeg' ? 'jpg' : match[1];
    const rawData = Buffer.from(match[2], 'base64');
    const key = `${folder}/${crypto.randomUUID()}.${mimeExt}`;

    const { error: uploadErr } = await supabase.storage
      .from('tesca-assets')
      .upload(key, rawData, {
        contentType: `image/${match[1]}`,
        upsert: false
      });

    if (uploadErr) {
      console.error(`Storage upload error: ${uploadErr.message}`);
      return null;
    }

    const { data } = supabase.storage.from('tesca-assets').getPublicUrl(key);
    return data.publicUrl;
  } catch (err) {
    console.error(`Error converting base64 to storage URL:`, err.message);
    return null;
  }
}

async function convertTableBase64ToStorage(tableName, imageColumns, folder) {
  console.log(`\n--- Cleaning Table: ${tableName} ---`);
  const { data: rows, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`Failed to fetch rows from ${tableName}:`, error.message);
    return;
  }

  let convertedCount = 0;
  for (const row of rows) {
    const updates = {};
    let shouldUpdate = false;

    for (const col of imageColumns) {
      const val = row[col];
      if (val && typeof val === 'string' && val.startsWith('data:image/')) {
        console.log(`[${tableName} ID:${row.id}] Converting Base64 ${col} to Supabase Storage URL...`);
        const publicUrl = await base64ToStorageUrl(val, folder);
        if (publicUrl) {
          updates[col] = publicUrl;
          shouldUpdate = true;
        }
      }
    }

    if (shouldUpdate) {
      const { error: updateErr } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', row.id);

      if (updateErr) {
        console.error(`Failed to update row ID ${row.id} in ${tableName}:`, updateErr.message);
      } else {
        convertedCount++;
        console.log(`✔ Successfully updated row ID ${row.id} in ${tableName}`);
      }
    }
  }
  console.log(`Finished ${tableName}: ${convertedCount} base64 rows converted to Supabase Storage CDN URLs.`);
}

async function runCleanup() {
  console.log("Starting Base64 -> Supabase Storage URL conversion...");
  await convertTableBase64ToStorage('success_stories', ['photo'], 'stories');
  await convertTableBase64ToStorage('social_causes', ['thumbnail_url'], 'social-causes');
  await convertTableBase64ToStorage('gallery_images', ['image_url'], 'gallery');
  await convertTableBase64ToStorage('popup_settings', ['image_url'], 'promo-popup');
  await convertTableBase64ToStorage('universities', ['photo', 'image_url'], 'universities');
  console.log("\n✅ Cleanup completed!");
}

runCleanup();
