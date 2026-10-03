#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.resolve(ROOT, process.argv[2] || 'docs/baseline/2026-09-15/URL_MANIFEST.tsv');
const buildMode = String(process.env.SITE_MODE || 'current').trim().toLowerCase();
const outputDirectory = buildMode === 'v2' ? 'public-v2' : 'public';
const outputPath = path.resolve(ROOT, outputDirectory);
const relativeManifest = path.relative(ROOT, manifestPath) || manifestPath;

if (!fs.existsSync(manifestPath)) {
  console.error('[expected-urls] манифест не найден: ' + relativeManifest);
  process.exit(2);
}
if (!fs.existsSync(outputPath)) {
  console.error('[expected-urls] output не найден: ' + outputDirectory + ' — сначала выполните сборку');
  process.exit(2);
}

const lines = fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/);
const header = lines.shift();
if (header !== 'url\tfile\tbytes\tsha256') {
  console.error('[expected-urls] неожиданный заголовок в ' + relativeManifest);
  process.exit(1);
}

const missing = [];
const malformed = [];
let expected = 0;
for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index];
  if (!line.trim()) continue;
  const columns = line.split('\t');
  const url = columns[0];
  const relativeFile = columns[1];
  const lineNumber = index + 2;
  if (!url || !relativeFile || columns.length < 4 || path.isAbsolute(relativeFile) || relativeFile.split('/').includes('..')) {
    malformed.push(lineNumber);
    continue;
  }
  expected += 1;
  const generatedPath = path.resolve(outputPath, relativeFile);
  if (!generatedPath.startsWith(outputPath + path.sep) && generatedPath !== outputPath) {
    malformed.push(lineNumber);
    continue;
  }
  if (!fs.existsSync(generatedPath) || !fs.statSync(generatedPath).isFile()) {
    missing.push({ url, file: relativeFile, line: lineNumber });
  }
}

if (malformed.length || missing.length) {
  console.error('[expected-urls] FAIL — ' + relativeManifest + ' → ' + outputDirectory);
  if (malformed.length) console.error('- некорректные строки: ' + malformed.join(', '));
  for (const item of missing) console.error('- отсутствует ' + item.url + ' → ' + item.file + ' (строка ' + item.line + ')');
  process.exit(1);
}

console.log('[expected-urls] OK — сгенерированы все ' + expected + ' URL из ' + relativeManifest + ' в ' + outputDirectory);
