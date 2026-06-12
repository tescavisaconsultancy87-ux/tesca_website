import fs from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';

async function main() {
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);
  const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

  let text = '';
  if (pdfFile) {
    const pdfPath = path.join(rootDir, pdfFile);
    console.log(`[Pre-build] Parsing PDF file: ${pdfFile}...`);
    const buffer = fs.readFileSync(pdfPath);
    try {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text || '';
      await parser.destroy();
      console.log(`[Pre-build] PDF parsed. Character length: ${text.length}`);
    } catch (err) {
      console.error("[Pre-build] Error parsing PDF:", err);
    }
  } else {
    console.log("[Pre-build] No PDF file found in root directory.");
  }

  // Ensure src/data directory exists
  const dataDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outPath = path.join(dataDir, 'pdfContext.ts');
  const content = `// Generated at build time. Do not edit manually.\nexport const pdfContextText = ${JSON.stringify(text)};\n`;
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`[Pre-build] Wrote context to ${outPath}`);
}

main().catch(console.error);
