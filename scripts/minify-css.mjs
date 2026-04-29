#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.css')) out.push(full);
  }
  return out;
}

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error(`[minify-css] нет директории ${PUBLIC_DIR} — сначала выполните build`);
  process.exit(1);
}

const cleaner = new CleanCSS({
  level: { 1: { specialComments: 0 }, 2: { mergeMedia: true, restructureRules: false } },
  returnPromise: false
});

const files = walk(PUBLIC_DIR);
let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;
const failures = [];

for (const file of files) {
  const rel = path.relative(PUBLIC_DIR, file);
  const before = fs.readFileSync(file, 'utf8');
  totalBefore += Buffer.byteLength(before, 'utf8');

  // Vendor-файлы с .min.css в имени уже минифицированы — пропускаем (двойная минификация бессмысленна).
  if (file.endsWith('.min.css')) {
    totalAfter += Buffer.byteLength(before, 'utf8');
    skipped++;
    continue;
  }

  const result = cleaner.minify(before);
  if (result.errors && result.errors.length) {
    failures.push({ file: rel, errors: result.errors });
    totalAfter += Buffer.byteLength(before, 'utf8');
    continue;
  }
  fs.writeFileSync(file, result.styles, 'utf8');
  totalAfter += Buffer.byteLength(result.styles, 'utf8');
  processed++;
  const saved = Buffer.byteLength(before, 'utf8') - Buffer.byteLength(result.styles, 'utf8');
  const pct = ((saved * 100) / Buffer.byteLength(before, 'utf8')).toFixed(1);
  console.log(`[minify-css] ${rel}: -${saved} байт (${pct}%)`);
}

const savedTotal = totalBefore - totalAfter;
const pctTotal = totalBefore > 0 ? ((savedTotal * 100) / totalBefore).toFixed(1) : '0';
console.log(`\n[minify-css] обработано: ${processed}, пропущено (.min.css): ${skipped}`);
console.log(`[minify-css] итого: ${totalBefore} → ${totalAfter} байт (-${savedTotal}, ${pctTotal}%)`);

if (failures.length) {
  console.error(`[minify-css] ОШИБКИ в ${failures.length} файлах:`);
  for (const f of failures) console.error(`  ${f.file}: ${f.errors.join('; ')}`);
  process.exit(1);
}
