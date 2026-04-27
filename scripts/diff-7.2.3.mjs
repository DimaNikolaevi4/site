#!/usr/bin/env node
import fs from 'node:fs';

const sourceTxt = fs.readFileSync('.local/notes/sync/7.2.3-source.txt', 'utf8');
const pageMd = fs.readFileSync('src/content/pages/svedenija/documents/index.md', 'utf8');

const HOST_LOCAL = 'xn----8sbwke6acce8h.xn--p1ai';

function basename(u) {
  try {
    const p = new URL(u).pathname;
    const last = p.split('/').filter(Boolean).pop() || '';
    return decodeURIComponent(last).toLowerCase();
  } catch { return null; }
}

const sourceLines = sourceTxt.split('\n');
const sourceFiles = new Map();
for (let i = 0; i < sourceLines.length; i++) {
  const l = sourceLines[i].trim();
  const m = l.match(/^(https?:\/\/sit-salsk\.ru\/wp-content\/uploads\/\S+)/);
  if (m) {
    const url = m[1];
    const bn = basename(url);
    const titleLine = sourceLines[i-1] || '';
    const title = titleLine.replace(/^\s*\d+\.\s*/, '').trim();
    if (bn && !sourceFiles.has(bn)) sourceFiles.set(bn, { url, title });
  }
}

const ourUrls = [...pageMd.matchAll(/https?:\/\/[^\s)]+/g)].map(m => m[0]);
const ourFiles = new Set();
for (const u of ourUrls) {
  if (u.includes(HOST_LOCAL)) {
    const bn = basename(u);
    if (bn) ourFiles.add(bn);
  }
}
const localPaths = [...pageMd.matchAll(/\(\s*\/assets\/uploads\/dokumenty\/([^)\s]+)\s*\)/g)].map(m => m[1]);
for (const enc of localPaths) {
  const bn = decodeURIComponent(enc).toLowerCase();
  if (bn) ourFiles.add(bn);
}

const missing = [];
const present = [];
for (const [bn, meta] of sourceFiles) {
  if (ourFiles.has(bn)) present.push({ bn, ...meta });
  else missing.push({ bn, ...meta });
}

console.log(`Источник: ${sourceFiles.size} уникальных файлов`);
console.log(`У нас в index.md (на хостинге): ${ourFiles.size} ссылок`);
console.log(`Совпадает: ${present.length}`);
console.log(`Отсутствует у нас: ${missing.length}`);
console.log('');
console.log('=== ОТСУТСТВУЕТ В index.md ===');
for (const m of missing) {
  console.log(`- ${m.title}`);
  console.log(`    ${m.url}`);
  console.log(`    basename: ${m.bn}`);
}

fs.writeFileSync('.local/notes/sync/7.2.3-missing.json', JSON.stringify(missing, null, 2));
fs.writeFileSync('.local/notes/sync/7.2.3-present.json', JSON.stringify(present, null, 2));
console.log('\nСохранено: .local/notes/sync/7.2.3-{missing,present}.json');
