import fs from 'fs';
import path from 'path';

const filePaths = [
  path.join(process.cwd(), 'dist', 'client', 'wrangler.json'),
  path.join(process.cwd(), 'dist', 'server', 'wrangler.json'),
  path.join(process.cwd(), 'dist', 'server', '.prerender', 'wrangler.json'),
];

for (const filePath of filePaths) {
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      
      let modified = false;

      // Remove KV namespaces to prevent wrangler from trying to auto-provision them
      if (data.kv_namespaces) {
        delete data.kv_namespaces;
        modified = true;
      }
      if (data.previews && data.previews.kv_namespaces) {
        delete data.previews.kv_namespaces;
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[Post-build] Successfully removed KV namespaces from wrangler.json at: ${filePath}`);
      }
    } catch (err) {
      console.error(`[Post-build] Failed to process wrangler.json at ${filePath}:`, err);
    }
  } else {
    console.log(`[Post-build] wrangler.json not found at: ${filePath}`);
  }
}
