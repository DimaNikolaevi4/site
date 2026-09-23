#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.resolve(ROOT, process.argv[2] || 'docs/baseline/2026-09-15/URL_MANIFEST.tsv');
const relativeManifest = path.relative(ROOT, manifestPath) || manifestPath;

if (!fs.existsSync(manifestPath)) {
  console.error('[route-shape] манифест не найден: ' + relativeManifest);
  process.exit(2);
}

const lines = fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/);
if (lines.shift() !== 'url\tfile\tbytes\tsha256') {
  console.error('[route-shape] неожиданный заголовок в ' + relativeManifest);
  process.exit(1);
}

const failures = [];
let checked = 0;
for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index];
  if (!line.trim()) continue;
  const [url, relativeFile] = line.split('\t');
  const lineNumber = index + 2;
  if (!url || !relativeFile) {
    failures.push('строка ' + lineNumber + ': неполные данные');
    continue;
  }
  checked += 1;
  let expectedUrl;
  if (relativeFile === 'index.html') {
    expectedUrl = '/';
  } else if (relativeFile.endsWith('/index.html')) {
    expectedUrl = '/' + relativeFile.slice(0, -'index.html'.length);
  } else {
    expectedUrl = '/' + relativeFile;
  }
  if (url !== expectedUrl) {
    failures.push('строка ' + lineNumber + ': ' + url + ' → ' + relativeFile + ', ожидался ' + expectedUrl);
  }
  if (relativeFile.endsWith('/index.html') && !url.endsWith('/')) {
    failures.push('строка ' + lineNumber + ': каталожный URL без trailing slash: ' + url);
  }
  if (url.includes('/index.html')) {
    failures.push('строка ' + lineNumber + ': index.html опубликован в URL: ' + url);
  }
}

if (failures.length) {
  console.error('[route-shape] FAIL — ' + relativeManifest);
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log('[route-shape] OK — проверено маршрутов: ' + checked + ' (' + relativeManifest + ')');
