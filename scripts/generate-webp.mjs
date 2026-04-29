#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Директории, где лежат исходные растровые изображения для сайта.
// WebP генерируется РЯДОМ с исходником (X.jpg → X.webp), затем passthrough копирует оба в public/.
const SOURCE_DIRS = [
  path.join(ROOT, 'src/assets/images'),
  path.join(ROOT, 'src/assets/favicons'),
  path.join(ROOT, 'src/images'),
  path.join(ROOT, 'src/content'),
];

const RASTER_RE = /\.(jpe?g|png)$/i;
const QUALITY = 80;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && RASTER_RE.test(entry.name)) out.push(full);
  }
  return out;
}

let generated = 0;
let skipped = 0;
let totalSrcBytes = 0;
let totalWebpBytes = 0;
const failures = [];

const allFiles = SOURCE_DIRS.flatMap(d => walk(d));
console.log(`[generate-webp] найдено растровых файлов: ${allFiles.length}`);

for (const src of allFiles) {
  const webp = src.replace(RASTER_RE, '.webp');
  const srcStat = fs.statSync(src);

  // Инкрементально: пересобираем только если webp нет или исходник новее.
  if (fs.existsSync(webp)) {
    const webpStat = fs.statSync(webp);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      totalSrcBytes += srcStat.size;
      totalWebpBytes += webpStat.size;
      continue;
    }
  }

  try {
    await sharp(src)
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(webp);
    const webpSize = fs.statSync(webp).size;
    totalSrcBytes += srcStat.size;
    totalWebpBytes += webpSize;
    const saved = srcStat.size - webpSize;
    const pct = ((saved * 100) / srcStat.size).toFixed(1);
    const rel = path.relative(ROOT, src);
    console.log(`[generate-webp] ${rel}: ${srcStat.size} → ${webpSize} байт (-${pct}%)`);
    generated++;
  } catch (e) {
    failures.push({ file: path.relative(ROOT, src), error: e.message });
  }
}

const savedTotal = totalSrcBytes - totalWebpBytes;
const pctTotal = totalSrcBytes > 0 ? ((savedTotal * 100) / totalSrcBytes).toFixed(1) : '0';
console.log(`\n[generate-webp] сгенерировано: ${generated}, пропущено (актуальные): ${skipped}`);
console.log(`[generate-webp] суммарно по растровым: ${totalSrcBytes} байт исходников → ${totalWebpBytes} байт webp (-${pctTotal}%)`);

if (failures.length) {
  console.error(`[generate-webp] ОШИБКИ в ${failures.length} файлах:`);
  for (const f of failures) console.error(`  ${f.file}: ${f.error}`);
  process.exit(1);
}
