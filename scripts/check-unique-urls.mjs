#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.resolve(ROOT, process.argv[2] || 'docs/baseline/2026-09-15/URL_MANIFEST.tsv');
const relativePath = path.relative(ROOT, manifestPath) || manifestPath;

if (!fs.existsSync(manifestPath)) {
  console.error('[unique-urls] файл не найден: ' + relativePath);
  process.exit(2);
}

const lines = fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/);
const header = lines.shift();
if (header !== 'url\tfile\tbytes\tsha256') {
  console.error('[unique-urls] неожиданный заголовок в ' + relativePath);
  console.error('Ожидался: url\tfile\tbytes\tsha256');
  console.error('Получен: ' + (header || '<пусто>'));
  process.exit(1);
}

const seen = new Map();
const malformed = [];
for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index];
  if (!line.trim()) continue;
  const columns = line.split('\t');
  const url = columns[0];
  const lineNumber = index + 2;
  if (!url || columns.length < 4) {
    malformed.push(lineNumber);
    continue;
  }
  if (!seen.has(url)) seen.set(url, []);
  seen.get(url).push(lineNumber);
}

const duplicates = [...seen.entries()].filter(([, lineNumbers]) => lineNumbers.length > 1);
if (malformed.length || duplicates.length) {
  console.error('[unique-urls] FAIL: ' + relativePath);
  if (malformed.length) console.error('- строки с неполными данными: ' + malformed.join(', '));
  for (const [url, lineNumbers] of duplicates) {
    console.error('- дубликат ' + url + ' (строки ' + lineNumbers.join(', ') + ')');
  }
  process.exit(1);
}

console.log('[unique-urls] OK — уникальных URL: ' + seen.size + ' (' + relativePath + ')');
