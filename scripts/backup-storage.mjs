import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || "https://zlsauoosumpnbyouhdfk.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY 
  || process.env.PUBLIC_SUPABASE_ANON_KEY 
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2F1b29zdW1wbmJ5b3VoZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjA2MDEsImV4cCI6MjA5NzMzNjYwMX0.JV5mmtfIGmPvA83H-vr173GDcqXoLG13gR7BJlXZ-SY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const OUTPUT_DIR = path.resolve(process.argv[2] || "./tmp-storage-backup");

async function listAllInFolder(bucketName, folderPath = "") {
  let files = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.warn(`[Warning] Could not list ${bucketName}/${folderPath}: ${error.message}`);
      break;
    }

    if (!data || data.length === 0) break;

    for (const item of data) {
      const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name;
      if (item.id === null) {
        // Directory / folder -> recurse
        const subFiles = await listAllInFolder(bucketName, fullPath);
        files.push(...subFiles);
      } else {
        // Object / file
        files.push({ bucket: bucketName, path: fullPath, size: item.metadata?.size || 0 });
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return files;
}

async function downloadFile(bucketName, filePath, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const { data, error } = await supabase.storage.from(bucketName).download(filePath);
  if (error) {
    console.error(`Failed to download ${bucketName}/${filePath}: ${error.message}`);
    return false;
  }

  const arrayBuffer = await data.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  return true;
}

async function run() {
  console.log(`Starting Supabase Storage backup to ${OUTPUT_DIR}...`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr || !buckets) {
    console.error("Failed to list buckets:", bErr?.message);
    process.exit(1);
  }

  console.log(`Found ${buckets.length} bucket(s):`, buckets.map(b => b.name).join(", "));

  let totalFiles = 0;
  let totalBytes = 0;

  for (const bucket of buckets) {
    console.log(`Scanning bucket: [${bucket.name}]...`);
    const files = await listAllInFolder(bucket.name, "");
    console.log(`Found ${files.length} file(s) in [${bucket.name}]. Downloading...`);

    // Download in concurrent batches of 6 for speed
    const BATCH_SIZE = 6;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (f) => {
        const localDest = path.join(OUTPUT_DIR, bucket.name, f.path);
        const ok = await downloadFile(f.bucket, f.path, localDest);
        if (ok) {
          totalFiles++;
          totalBytes += f.size;
        }
      }));
      process.stdout.write(`\r  Progress: ${Math.min(i + BATCH_SIZE, files.length)}/${files.length} files`);
    }
    console.log("");
  }

  console.log(`\nStorage backup complete!`);
  console.log(`Total files downloaded: ${totalFiles}`);
  console.log(`Total size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
}

run().catch((err) => {
  console.error("Fatal error during storage backup:", err);
  process.exit(1);
});
