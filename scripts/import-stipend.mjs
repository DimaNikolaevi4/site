#!/usr/bin/env node
// scripts/import-stipend.mjs
// Скачивает с https://sit-salsk.ru файлы из главного поста стипендий (?p=4163, 34 файла).
// Локально кладёт в src/assets/uploads/stipend/ с транслитерацией имён.
// Печатает Markdown-сводку для objects/index.md.

import fs from 'node:fs';
import path from 'node:path';

const HOST = 'https://sit-salsk.ru';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|jpe?g|png|gif|webp|svg|mp4|webm|mp3|odt|rtf|txt)(\?|$)/i;

const ROOT = path.resolve(process.cwd(), 'src/assets/uploads/stipend');
const POST = `${HOST}/?p=4163`;

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: HOST + '/' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function extractLinks(html) {
  const items = [];
  const re = /<a\b[^>]*href=(?:"([^"]+)"|'([^']+)')[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1] || m[2] || '';
    if (!FILE_EXT.test(href)) continue;
    let title = m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    title = title.replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
                 .replace(/&#171;/g, '«').replace(/&#187;/g, '»')
                 .replace(/&amp;/g, '&').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
                 .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
    items.push({ href, title });
  }
  return items;
}

function basenameFromUrl(url) {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() || 'file');
  } catch { return 'file'; }
}

function safeName(name) {
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y',
    'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
    'х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
  };
  let out = '';
  for (const ch of name) {
    const lo = ch.toLowerCase();
    if (map[lo] != null) {
      const t = map[lo];
      out += (ch === lo) ? t : (t ? t[0].toUpperCase() + t.slice(1) : '');
    } else if (/[a-zA-Z0-9._-]/.test(ch)) out += ch;
    else if (/\s/.test(ch)) out += '-';
  }
  return out.replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '') || 'file';
}

async function downloadOne(href, destPath) {
  if (fs.existsSync(destPath)) return { skipped: true, size: fs.statSync(destPath).size };
  const res = await fetch(href, { headers: { 'User-Agent': UA, Referer: HOST + '/' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${href}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return { skipped: false, size: buf.length };
}

async function main() {
  fs.mkdirSync(ROOT, { recursive: true });
  console.error(`→ ${POST}`);
  const html = await fetchHtml(POST);
  let links = extractLinks(html);
  const seen = new Set();
  links = links.filter(l => { if (seen.has(l.href)) return false; seen.add(l.href); return true; });
  console.error(`   найдено ссылок: ${links.length}`);

  const result = [];
  for (const l of links) {
    const orig = basenameFromUrl(l.href);
    const ascii = safeName(orig);
    const dest = path.join(ROOT, ascii);
    try {
      const { skipped, size } = await downloadOne(l.href, dest);
      const rel = '/assets/uploads/stipend/' + ascii;
      result.push({ ...l, local: rel, size, skipped, ascii });
      console.error(`   ${skipped ? '·' : '✓'} ${ascii} (${(size/1024).toFixed(1)} KB) — ${l.title.slice(0, 70)}`);
    } catch (err) {
      console.error(`   ✗ ${l.href}: ${err.message}`);
    }
  }

  console.log('\n# Markdown-сводка\n');
  result.forEach((l, i) => {
    console.log(`${i + 1}. [${l.title}](${l.local})`);
  });
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
