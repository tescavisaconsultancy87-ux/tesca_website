import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const clientDir = path.join(process.cwd(), 'dist', 'client');

if (!fs.existsSync(clientDir)) {
  console.error('❌ [Syntax Guardrail] dist/client directory does not exist. Run build first.');
  process.exit(1);
}

let totalFilesChecked = 0;
let totalInlineScripts = 0;
const errors = [];

// 1. Check all bundled JS chunks in dist/client/_astro/
const astroChunksDir = path.join(clientDir, '_astro');
if (fs.existsSync(astroChunksDir)) {
  const jsFiles = fs.readdirSync(astroChunksDir).filter(f => f.endsWith('.js'));
  for (const file of jsFiles) {
    totalFilesChecked++;
    const fullPath = path.join(astroChunksDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check for logical assignment operators (ES2021+)
    const logicalAssignmentMatch = content.match(/(\?\?=|\|\|=|&&=)/);
    if (logicalAssignmentMatch) {
      errors.push({
        file: `_astro/${file}`,
        reason: `Forbidden operator "${logicalAssignmentMatch[1]}" detected (ES2021 logical assignment). Causes "Unexpected token '='" in older browsers.`,
      });
    }

    // Check for Cloudflare banner leakage
    if (content.includes('globalThis.process??=') || content.includes('globalThis.process ??=')) {
      errors.push({
        file: `_astro/${file}`,
        reason: 'Cloudflare Workers server process banner leaked into client chunk.',
      });
    }

    // Verify clean parse at ES2020
    const sf = ts.createSourceFile(file, content, ts.ScriptTarget.ES2020, true);
    const diags = sf.parseDiagnostics || [];
    if (diags.length > 0) {
      for (const diag of diags) {
        errors.push({
          file: `_astro/${file}`,
          reason: `Syntax Parse Error: ${typeof diag.messageText === 'string' ? diag.messageText : diag.messageText.messageText}`,
        });
      }
    }
  }
}

// 2. Check all inline scripts inside dist/client/**/*.html
function walkHtml(dir) {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walkHtml(fullPath));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = walkHtml(clientDir);
for (const htmlPath of htmlFiles) {
  const relativeHtml = path.relative(clientDir, htmlPath);
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const scriptTag = match[0];
    const scriptBody = match[1].trim();

    // Skip JSON-LD structured data and external script tags
    if (!scriptBody || scriptTag.includes('type="application/ld+json"')) {
      continue;
    }

    totalInlineScripts++;

    // Check for logical assignment in inline script
    const logicalAssignmentMatch = scriptBody.match(/(\?\?=|\|\|=|&&=)/);
    if (logicalAssignmentMatch) {
      errors.push({
        file: relativeHtml,
        reason: `Forbidden operator "${logicalAssignmentMatch[1]}" in inline <script>.`,
      });
    }

    // Verify clean parse at ES2020
    const sf = ts.createSourceFile(relativeHtml, scriptBody, ts.ScriptTarget.ES2020, true);
    const diags = sf.parseDiagnostics || [];
    if (diags.length > 0) {
      for (const diag of diags) {
        errors.push({
          file: relativeHtml,
          reason: `Inline Script Parse Error: ${typeof diag.messageText === 'string' ? diag.messageText : diag.messageText.messageText}`,
        });
      }
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ [Syntax Guardrail Failed]: Detected client-side syntax compatibility errors:');
  for (const err of errors) {
    console.error(`  - [${err.file}]: ${err.reason}`);
  }
  process.exit(1);
}

console.log(`\n✅ [Syntax Guardrail Passed]: Successfully verified ${totalFilesChecked} client JS chunks and ${totalInlineScripts} inline scripts across ${htmlFiles.length} HTML pages.`);
console.log('   All scripts conform to ES2020 with 0 syntax errors and 0 untranspiled logical assignments.\n');
