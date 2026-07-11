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
      process.env[key] = value.trim();
    }
  });
} catch (err) {
  console.warn("Could not read .env file, relying on system env:", err.message);
}

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://zlsauoosumpnbyouhdfk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("Missing PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY in env variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixGalleryImages() {
  console.log('\n--- FIXING GALLERY IMAGES ---');
  const { data: images, error } = await supabase
    .from('gallery_images')
    .select('id, title, image_url');

  if (error) {
    console.error('Error fetching gallery images:', error);
    return;
  }

  console.log(`Fetched ${images.length} gallery images.`);
  let fixCount = 0;

  for (const img of images) {
    const url = img.image_url;
    if (!url || !url.startsWith('/images/')) {
      console.log(`Skipping non-local or empty URL for image ID ${img.id}: "${url}"`);
      continue;
    }

    const cleanPath = url.split('?')[0].split('#')[0];
    const physicalPath = path.join('public', cleanPath.replace(/\//g, path.sep));

    if (fs.existsSync(physicalPath)) {
      console.log(`✅ Image exists: "${url}"`);
      continue;
    }

    // Try converting extension to .webp
    const ext = path.extname(cleanPath);
    if (ext && ext.toLowerCase() !== '.webp') {
      const newPath = cleanPath.slice(0, -ext.length) + '.webp';
      const newPhysicalPath = path.join('public', newPath.replace(/\//g, path.sep));
      
      if (fs.existsSync(newPhysicalPath)) {
        console.log(`🔧 Correcting "${url}" => "${newPath}"`);
        const { error: updateError } = await supabase
          .from('gallery_images')
          .update({ image_url: newPath })
          .eq('id', img.id);

        if (updateError) {
          console.error(`Failed to update image ID ${img.id}:`, updateError);
        } else {
          fixCount++;
        }
      } else {
        console.warn(`❌ Neither "${url}" nor "${newPath}" exists on disk.`);
      }
    } else {
      console.warn(`❌ File does not exist on disk: "${url}"`);
    }
  }

  console.log(`Fixed ${fixCount} gallery images.`);
}

async function fixUniversities() {
  console.log('\n--- FIXING UNIVERSITIES ---');
  const { data: universities, error } = await supabase
    .from('universities')
    .select('id, name, image_url, photo');

  if (error) {
    console.error('Error fetching universities:', error);
    return;
  }

  console.log(`Fetched ${universities.length} universities.`);
  let fixCount = 0;

  const possibleExtensions = ['.webp', '.jpg', '.jpeg', '.png'];

  for (const uni of universities) {
    const url = uni.image_url || uni.photo;
    if (!url || !url.startsWith('/images/')) {
      console.log(`Skipping non-local or empty URL for "${uni.name}": "${url}"`);
      continue;
    }

    const cleanPath = url.split('?')[0].split('#')[0];
    const physicalPath = path.join('public', cleanPath.replace(/\//g, path.sep));

    if (fs.existsSync(physicalPath)) {
      // Also make sure both fields are updated & synchronized
      if (uni.image_url !== url || uni.photo !== url) {
        console.log(`🔧 Syncing fields for "${uni.name}" => "${url}"`);
        await supabase
          .from('universities')
          .update({ image_url: url, photo: url })
          .eq('id', uni.id);
      }
      console.log(`✅ Image exists for "${uni.name}": "${url}"`);
      continue;
    }

    // Try finding a file with a different extension
    const ext = path.extname(cleanPath);
    const baseWithoutExt = ext ? cleanPath.slice(0, -ext.length) : cleanPath;
    let foundNewPath = null;

    for (const testExt of possibleExtensions) {
      const testPath = baseWithoutExt + testExt;
      const testPhysicalPath = path.join('public', testPath.replace(/\//g, path.sep));
      if (fs.existsSync(testPhysicalPath)) {
        foundNewPath = testPath;
        break;
      }
    }

    if (foundNewPath) {
      console.log(`🔧 Correcting university "${uni.name}": "${url}" => "${foundNewPath}"`);
      const { error: updateError } = await supabase
        .from('universities')
        .update({
          image_url: foundNewPath,
          photo: foundNewPath
        })
        .eq('id', uni.id);

      if (updateError) {
        console.error(`Failed to update university "${uni.name}":`, updateError);
      } else {
        fixCount++;
      }
    } else {
      // Try a case-insensitive file lookup in public/images/universities
      const dir = 'public/images/universities';
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const uniNameLower = uni.name.toLowerCase();
        const matchedFile = files.find(f => {
          const base = path.basename(f, path.extname(f)).toLowerCase();
          return base === uniNameLower || base.includes(uniNameLower) || uniNameLower.includes(base);
        });

        if (matchedFile) {
          const newPath = `/images/universities/${matchedFile}`;
          console.log(`🔧 Fuzzy matched & correcting university "${uni.name}": "${url}" => "${newPath}"`);
          const { error: updateError } = await supabase
            .from('universities')
            .update({
              image_url: newPath,
              photo: newPath
            })
            .eq('id', uni.id);

          if (updateError) {
            console.error(`Failed to update university "${uni.name}":`, updateError);
          } else {
            fixCount++;
          }
        } else {
          console.warn(`❌ No matching file found for "${uni.name}" (tried variations of "${url}").`);
        }
      }
    }
  }

  console.log(`Fixed ${fixCount} universities.`);
}

async function main() {
  await fixGalleryImages();
  await fixUniversities();
  console.log('\nMigration complete.');
}

main();
