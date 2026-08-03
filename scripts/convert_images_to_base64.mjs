import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/PUBLIC_SUPABASE_ANON_KEY are required in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function imageUrlToBase64(url) {
  if (!url || url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch image from ${url}: ${res.statusText}`);
      return null;
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error(`Error converting ${url} to Base64:`, err.message);
    return null;
  }
}

async function convertTableImages(tableName, imageColumns) {
  console.log(`\n--- Converting Table: ${tableName} ---`);
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
      if (val && typeof val === 'string' && val.startsWith('http')) {
        console.log(`[${tableName} ID:${row.id}] Fetching & converting ${col}...`);
        const base64Str = await imageUrlToBase64(val);
        if (base64Str) {
          updates[col] = base64Str;
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
  console.log(`Finished ${tableName}: ${convertedCount} rows converted to Base64.`);
}

async function runMigration() {
  console.log("Starting Migration: Converting existing image URLs to Base64 Data URLs...");
  await convertTableImages('success_stories', ['photo']);
  await convertTableImages('social_causes', ['thumbnail_url']);
  await convertTableImages('gallery_images', ['image_url']);
  await convertTableImages('popup_settings', ['image_url']);
  await convertTableImages('universities', ['photo', 'image_url']);
  console.log("\n✅ Migration completed!");
}

runMigration();
