#!/usr/bin/env node
// sync-check.mjs — сверка любой страницы проекта с её источником на https://sit-salsk.ru
// Использование:
//   node sync-check.mjs <URL>                       — показать все ссылки на файлы и заголовки с источника
//   node sync-check.mjs <URL> --data <yaml>         — сравнить URL с указанным yaml (raw-сравнение по hostname+pathname)
//   node sync-check.mjs <URL> --data <yaml> --out <file>  — сохранить отчёт в файл
//   node sync-check.mjs ?p=33507                    — короткая форма (добавит https://sit-salsk.ru/)
//   node sync-check.mjs ?cat=155                    — то же для рубрики
//   node sync-check.mjs ?cat=155 --paged 2          — конкретная страница пагинации
//   node sync-check.mjs ?cat=155 --all              — обойти все страницы пагинации (paged=1..N)
//   node sync-check.mjs ?cat=155 --follow-posts     — дополнительно обойти все дочерние ?p= публикации
//                                                     (нужно для рубрик: архив сам по себе не содержит файлов)
//
// Что делает:
//   1. Скачивает HTML с источника (с User-Agent и Referer — иначе WP отдаёт 403/404).
//   2. Извлекает все ссылки на файлы (PDF/DOC/DOCX/XLS/XLSX/PPT/PPTX/ZIP/RAR/JPG/PNG)
//      и их видимые заголовки.
//   3. Извлекает ссылки на «дочерние» посты рубрики (?p=XXXX) и заголовки.
//   4. Если задан --data, читает yaml, выкачивает все url:* и сравнивает имена файлов с источником
//      (нормализация: pathname → последний сегмент → URI-decoded).
//   5. Печатает отчёт: список найденного, отсутствует на сайте, отсутствует в yaml.
//
// Зависимости: только встроенный fetch (Node 18+) и уже установленный js-yaml.
// Если нужной ссылки нет на источнике — спросите у автора (Сальский ИТ), он пришлёт URL.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const HOST = 'https://sit-salsk.ru';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|jpe?g|png|gif|webp|svg|mp4|webm|mp3|odt|rtf|txt)(\?|$)/i;

function usage(msg) {
  if (msg) console.error('Ошибка:', msg, '\n');
  console.error('Использование: node sync-check.mjs <URL|?p=N|?cat=N> [--data <yaml>] [--out <file>] [--paged N] [--all]');
  process.exit(msg ? 1 : 0);
}

// --- Парсинг аргументов
const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) usage();

let target = argv[0];
let dataFile = null;
let outFile = null;
let pagedStart = null;
let walkAll = false;
let followPosts = false;

for (let i = 1; i < argv.length; i++) {
  if (argv[i] === '--data') dataFile = argv[++i];
  else if (argv[i] === '--out') outFile = argv[++i];
  else if (argv[i] === '--paged') pagedStart = parseInt(argv[++i], 10);
  else if (argv[i] === '--all') walkAll = true;
  else if (argv[i] === '--follow-posts') followPosts = true;
  else usage(`неизвестный аргумент "${argv[i]}"`);
}

// Нормализация URL: ?p=NNN или ?cat=NNN → https://sit-salsk.ru/?p=NNN
function normalizeUrl(input, paged = null) {
  let u;
  if (input.startsWith('?')) u = HOST + '/' + input;
  else if (input.startsWith('http')) u = input;
  else u = HOST + (input.startsWith('/') ? '' : '/') + input;
  if (paged !== null) {
    const sep = u.includes('?') ? '&' : '?';
    u = u.replace(/[?&]paged=\d+/, '') + `${sep}paged=${paged}`;
  }
  return u;
}

// --- Скачивание HTML
async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Referer': HOST + '/',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
  });
  return { status: res.status, html: await res.text(), url: res.url };
}

// --- Извлечение ссылок на файлы и заголовков
function extractFromHtml(html, baseUrl) {
  const files = [];
  const posts = [];
  const seen = new Set();

  // <a href="...">...</a> — основной сборщик
  const aRe = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = aRe.exec(html)) !== null) {
    const rawHref = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    let abs;
    try { abs = new URL(rawHref, baseUrl).toString(); } catch { continue; }

    // Файлы
    if (FILE_EXT.test(abs)) {
      if (!seen.has(abs)) {
        seen.add(abs);
        files.push({ url: abs, title: text || path.basename(decodeURIComponent(new URL(abs).pathname)) });
      }
      continue;
    }

    // Ссылки на дочерние посты той же CMS (?p=XXXX)
    const u = new URL(abs);
    if ((u.hostname === 'sit-salsk.ru' || u.hostname === 'www.sit-salsk.ru')
        && (u.searchParams.has('p') || u.searchParams.has('page_id'))
        && text && text.length > 3) {
      const key = u.toString();
      if (!seen.has(key)) {
        seen.add(key);
        posts.push({ url: key, title: text });
      }
    }
  }

  // Заголовок страницы
  const titleM = html.match(/<title>([^<]+)<\/title>/i);
  const h1M = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return {
    pageTitle: (titleM ? titleM[1] : '').replace(/\s*\|\s*ГБПОУ.*$/, '').trim(),
    h1: (h1M ? h1M[1].replace(/<[^>]+>/g, '').trim() : ''),
    files, posts,
  };
}

// --- Извлечение URL из yaml (рекурсивно: любые поля url:)
function collectUrlsFromYaml(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach(n => collectUrlsFromYaml(n, acc)); return acc; }
  for (const [k, v] of Object.entries(node)) {
    if (k === 'url' && typeof v === 'string' && v && v !== '#') acc.push(v);
    else collectUrlsFromYaml(v, acc);
  }
  return acc;
}

// Нормализация имени файла для сравнения: последний сегмент, URI-decoded, lowercase
function fileKey(u) {
  try {
    const p = new URL(u, HOST).pathname;
    return decodeURIComponent(p.split('/').pop() || '').toLowerCase();
  } catch { return u.toLowerCase(); }
}

// --- Главная логика
const lines = [];
const log = (...a) => { const s = a.join(' '); lines.push(s); console.log(s); };

(async () => {
  const baseUrl = normalizeUrl(target, pagedStart);
  log(`# Сверка с источником`);
  log(`# Цель: ${baseUrl}`);
  log(`# Дата: ${new Date().toISOString()}`);
  log('');

  let allFiles = [];
  let allPosts = [];

  // Первая страница
  log(`→ Загружаю ${baseUrl}`);
  const r0 = await fetchHtml(baseUrl);
  log(`  HTTP ${r0.status}, итоговый URL: ${r0.url}, размер: ${r0.html.length} байт`);
  if (r0.status !== 200) {
    log(`! Источник не отвечает 200 — проверьте URL вручную в браузере.`);
    if (outFile) fs.writeFileSync(outFile, lines.join('\n'));
    process.exit(2);
  }
  const ex0 = extractFromHtml(r0.html, r0.url);
  log(`  Заголовок: «${ex0.h1 || ex0.pageTitle}»`);
  allFiles = allFiles.concat(ex0.files);
  allPosts = allPosts.concat(ex0.posts);

  // Если --all — обходим страницы пагинации до первого 404
  if (walkAll) {
    for (let p = 2; p < 50; p++) {
      const u = normalizeUrl(target, p);
      const r = await fetchHtml(u);
      if (r.status !== 200) { log(`  paged=${p}: HTTP ${r.status} — стоп`); break; }
      const ex = extractFromHtml(r.html, r.url);
      log(`  paged=${p}: HTTP 200, файлов: ${ex.files.length}, постов: ${ex.posts.length}`);
      allFiles = allFiles.concat(ex.files);
      allPosts = allPosts.concat(ex.posts);
    }
  }

  // Если --follow-posts — последовательно обходим все обнаруженные ?p= публикации
  // (WP блокирует параллельные запросы, поэтому строго sequential с задержкой)
  if (followPosts && allPosts.length) {
    log('');
    log(`→ Глубокий обход ${allPosts.length} дочерних публикаций...`);
    const childPosts = [...allPosts]; // копируем, чтобы не модифицировать в цикле
    for (let i = 0; i < childPosts.length; i++) {
      const post = childPosts[i];
      try {
        const r = await fetchHtml(post.url);
        if (r.status !== 200) { log(`  [${i+1}/${childPosts.length}] HTTP ${r.status}: ${post.title}`); continue; }
        const ex = extractFromHtml(r.html, r.url);
        log(`  [${i+1}/${childPosts.length}] HTTP 200, файлов: ${ex.files.length} — ${post.title.slice(0,60)}`);
        allFiles = allFiles.concat(ex.files);
        // дочерние посты внутри публикаций тоже сохраняем, но без рекурсии
        allPosts = allPosts.concat(ex.posts);
        await new Promise(r => setTimeout(r, 250)); // вежливая задержка
      } catch (e) {
        log(`  [${i+1}/${childPosts.length}] ОШИБКА: ${e.message}`);
      }
    }
  }

  // Дедупликация
  const dedup = arr => { const m = new Map(); arr.forEach(x => m.set(x.url, x)); return [...m.values()]; };
  allFiles = dedup(allFiles);
  allPosts = dedup(allPosts);

  log('');
  log(`## Найдено на источнике`);
  log(`Файлов: ${allFiles.length}`);
  log(`Дочерних публикаций (?p=…): ${allPosts.length}`);

  log('');
  log(`### Список файлов`);
  allFiles.forEach((f, i) => log(`${(i+1).toString().padStart(3)}. ${f.title}\n      ${f.url}`));

  if (allPosts.length) {
    log('');
    log(`### Дочерние публикации`);
    allPosts.forEach((p, i) => log(`${(i+1).toString().padStart(3)}. ${p.title}\n      ${p.url}`));
    log(`\nПодсказка: для глубокого обхода рубрики проверьте каждый из этих ?p=N отдельно.`);
  }

  // --- Сравнение с yaml
  if (dataFile) {
    log('');
    log(`## Сравнение с ${dataFile}`);
    if (!fs.existsSync(dataFile)) { log(`! Файл не найден.`); process.exit(3); }
    const data = yaml.load(fs.readFileSync(dataFile, 'utf8'));
    const localUrls = collectUrlsFromYaml(data);
    log(`URL в yaml: ${localUrls.length}`);

    const localKeys = new Map(localUrls.map(u => [fileKey(u), u]));
    const sourceKeys = new Map(allFiles.map(f => [fileKey(f.url), f]));

    const missingInYaml = [...sourceKeys.entries()].filter(([k]) => !localKeys.has(k));
    const missingOnSource = [...localKeys.entries()].filter(([k, u]) => {
      // считаем «отсутствующим на источнике» только если url ведёт на тот же домен sit-salsk.ru,
      // внешние ссылки (pravo.gov.ru, rostobr.ru и т.п.) не сверяем — у них нет общего источника
      try { const h = new URL(u).hostname; return h.includes('sit-salsk.ru') && !sourceKeys.has(k); }
      catch { return false; }
    });

    log('');
    log(`### Есть на источнике, нет в yaml (нужно добавить): ${missingInYaml.length}`);
    missingInYaml.forEach(([k, f], i) => log(`${(i+1).toString().padStart(3)}. ${f.title}\n      ${f.url}`));

    log('');
    log(`### Есть в yaml, нет на источнике (проверить, не битая ли ссылка): ${missingOnSource.length}`);
    missingOnSource.forEach(([k, u], i) => log(`${(i+1).toString().padStart(3)}. ${u}`));

    log('');
    log(`Итого: ${sourceKeys.size} на источнике, ${localKeys.size} в yaml, совпало по имени файла: ${[...sourceKeys.keys()].filter(k => localKeys.has(k)).length}`);
  }

  log('');
  log(`# Готово. Если нужной ссылки нет на источнике — спросите у автора (Сальский ИТ), он пришлёт URL.`);

  if (outFile) {
    fs.writeFileSync(outFile, lines.join('\n'));
    console.error(`\nОтчёт сохранён: ${outFile}`);
  }
})().catch(e => { console.error('Ошибка:', e.message); process.exit(1); });
