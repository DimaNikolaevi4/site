#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildMode = String(process.env.SITE_MODE || 'current').trim().toLowerCase();
const outputDirectory = buildMode === 'v2' ? 'public-v2' : 'public';
const outputPath = path.resolve(ROOT, outputDirectory);
const failures = [];
const checked = new Set();
let pages = 0;
let links = 0;

function walk(directory, result = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath, result);
    else if (entry.isFile() && entry.name.endsWith('.html')) result.push(fullPath);
  }
  return result;
}

function pageUrl(filePath) {
  const relative = path.relative(outputPath, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return '/' + relative.slice(0, -'index.html'.length);
  return '/' + relative;
}

function candidatesForUrl(urlPath) {
  const clean = decodeURIComponent(urlPath).replace(/^\/+/, '');
  if (!clean) return ['index.html'];
  if (clean.endsWith('/')) return [clean + 'index.html'];
  return [clean, clean + '/index.html', clean + '.html'];
}

function findTarget(rawUrl, sourcePage) {
  if (rawUrl.startsWith('#')) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(rawUrl)) return null;
  if (rawUrl.startsWith('//')) return null;
  let parsed;
  try {
    parsed = new URL(rawUrl, 'https://site-v2.local' + pageUrl(sourcePage));
  } catch {
    return { rawUrl, reason: 'некорректный URL' };
  }
  if (parsed.origin !== 'https://site-v2.local') return null;
  const candidates = candidatesForUrl(parsed.pathname);
  for (const candidate of candidates) {
    const target = path.resolve(outputPath, candidate);
    if (target.startsWith(outputPath + path.sep) && fs.existsSync(target) && fs.statSync(target).isFile()) {
      return { target, fragment: parsed.hash.slice(1) };
    }
  }
  return { rawUrl, reason: 'файл не найден', candidates };
}

if (!fs.existsSync(outputPath)) {
  console.error('[v2-internal-links] output не найден: ' + outputDirectory + ' — сначала выполните сборку');
  process.exit(2);
}

for (const page of walk(outputPath)) {
  pages += 1;
  const html = fs.readFileSync(page, 'utf8');
  const attributePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attributePattern.exec(html))) {
    const rawUrl = match[1].trim();
    if (!rawUrl) continue;
    links += 1;
    const result = findTarget(rawUrl, page);
    if (!result) continue;
    const key = page + '\0' + rawUrl;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!result.target) failures.push({ page: pageUrl(page), url: rawUrl, reason: result.reason });
  }
}

if (failures.length) {
  console.error('[v2-internal-links] FAIL — страниц: ' + pages + ', ссылок: ' + links);
  for (const failure of failures) console.error('- ' + failure.page + ' → ' + failure.url + ' (' + failure.reason + ')');
  process.exit(1);
}

console.log('[v2-internal-links] OK — проверено страниц: ' + pages + ', ссылок: ' + links + ' (' + outputDirectory + ')');
