#!/usr/bin/env node
// scripts/import-mto.mjs
// Скачивает с https://sit-salsk.ru файлы для раздела «2.7 Материально-техническое обеспечение»
// и связанных подпостов (ЭИОС, библиотека, ЭОР).
// Локально кладёт в src/assets/uploads/mto/<подпапка>/<нормализованное-имя>.
// Печатает Markdown-список для ручной вставки в objects/index.md.

import fs from 'node:fs';
import path from 'node:path';

const HOST = 'https://sit-salsk.ru';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|jpe?g|png|gif|webp|svg|mp4|webm|mp3|odt|rtf|txt)(\?|$)/i;

const ROOT = path.resolve(process.cwd(), 'src/assets/uploads/mto');

// Какие посты разбирать и куда складывать
const POSTS = [
  { url: `${HOST}/?p=4161`,  subdir: 'main',       label: 'МТО (главный пост)' },
  { url: `${HOST}/?p=30519`, subdir: 'eios',       label: 'ЭИОС' },
  { url: `${HOST}/?p=30514`, subdir: 'biblioteka', label: 'Цифровая библиотека' },
  { url: `${HOST}/?p=30510`, subdir: 'eor',        label: 'Электронные образовательные ресурсы' },
  { url: `${HOST}/?p=30528`, subdir: 'eios-platform', label: 'ЭИОС на образовательной платформе' },
];

// Из главного поста (p=4161) берём только релевантные для МТО (не для access)
// Списки строятся по индексу позиции файла на странице (см. sync-check ?p=4161).
// Файлы 1, 17-50 относятся к Доступной среде/АОП и пойдут в задачу 7.2.14 (access).
// Берём: 2 (общее фото), 3 (Ростелеком-договор), 4-5 (обеспечение корпусов), 6-14 (фото кабинетов/лабораторий).
const MTO_MAIN_KEEP_INDICES = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: HOST + '/' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

// Парсим ссылки на файлы и их видимые тексты так же, как sync-check.mjs
function extractLinks(html) {
  // <a href="...">title</a>
  const items = [];
  const re = /<a\b[^>]*href=(?:"([^"]+)"|'([^']+)')[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1] || m[2] || '';
    if (!FILE_EXT.test(href)) continue;
    // Срезаем теги внутри <a>
    let title = m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    // Декодируем сущности
    title = title.replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
                 .replace(/&#171;/g, '«').replace(/&#187;/g, '»')
                 .replace(/&amp;/g, '&').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
                 .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"');
    items.push({ href, title });
  }
  return items;
}

function basenameFromUrl(url) {
  try {
    const u = new URL(url);
    const last = u.pathname.split('/').filter(Boolean).pop() || 'file';
    return decodeURIComponent(last);
  } catch {
    return 'file';
  }
}

// Транслитерация русского имени файла → ASCII (упрощённая, безопасная для путей)
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
    } else if (/[a-zA-Z0-9._-]/.test(ch)) {
      out += ch;
    } else if (/\s/.test(ch)) {
      out += '-';
    }
  }
  out = out.replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
  return out || 'file';
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

async function processPost(post) {
  console.error(`\n→ ${post.label}: ${post.url}`);
  const html = await fetchHtml(post.url);
  let links = extractLinks(html);
  // Дедупликация по href
  const seen = new Set();
  links = links.filter(l => { if (seen.has(l.href)) return false; seen.add(l.href); return true; });

  if (post.subdir === 'main') {
    links = links.filter((_, i) => MTO_MAIN_KEEP_INDICES.has(i + 1));
  }

  console.error(`   найдено ссылок: ${links.length}`);
  const result = [];
  for (const l of links) {
    const orig = basenameFromUrl(l.href);
    const ascii = safeName(orig);
    const dest = path.join(ROOT, post.subdir, ascii);
    try {
      const { skipped, size } = await downloadOne(l.href, dest);
      const rel = '/assets/uploads/mto/' + post.subdir + '/' + ascii;
      result.push({ ...l, local: rel, size, skipped });
      console.error(`   ${skipped ? '·' : '✓'} ${ascii} (${(size/1024).toFixed(1)} KB) — ${l.title.slice(0, 70)}`);
    } catch (err) {
      console.error(`   ✗ ${l.href}: ${err.message}`);
    }
  }
  return { post, links: result };
}

async function main() {
  fs.mkdirSync(ROOT, { recursive: true });
  const all = [];
  for (const p of POSTS) all.push(await processPost(p));

  // Печатаем сводку для ручной вставки
  console.log('\n\n# Markdown-сводка (для objects/index.md)\n');
  for (const { post, links } of all) {
    console.log(`\n## ${post.label} — ${post.url}`);
    for (const l of links) {
      console.log(`- [${l.title}](${l.local})`);
    }
  }
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
