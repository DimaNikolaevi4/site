#!/usr/bin/env node
// Скачать HTML источника, вытащить структуру: <h2>/<h3>/<strong> → файлы под ними.
import fs from 'node:fs';

const URL = 'https://sit-salsk.ru/?p=15146';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0';

const html = await (await fetch(URL, { headers: { 'User-Agent': UA, 'Referer': 'https://sit-salsk.ru/' } })).text();

const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|jpe?g|png|gif|webp|svg|mp4|webm|mp3|odt|rtf|txt)(\?|$)/i;

// Грубый стрипер тегов
function stripTags(s) { return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

// Ищем post content
const m = html.match(/<div class="entry-content[^"]*">([\s\S]*?)<\/div>\s*(?:<footer|<div class="entry-meta|<\/article)/i);
const body = m ? m[1] : html;

// Делим по h1..h4
const tokens = body.split(/(<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>)/i);
let currentSection = '(intro)';
const sections = new Map();
sections.set(currentSection, []);

for (const tok of tokens) {
  if (/^<h[1-4]/i.test(tok)) {
    currentSection = stripTags(tok);
    if (!sections.has(currentSection)) sections.set(currentSection, []);
  } else {
    const re = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let mm;
    while ((mm = re.exec(tok))) {
      const url = mm[1];
      const title = stripTags(mm[2]);
      if (FILE_EXT.test(url) && url.includes('sit-salsk.ru/wp-content/uploads/')) {
        sections.get(currentSection).push({ url, title });
      }
    }
  }
}

const out = {};
for (const [k, v] of sections) {
  if (v.length) out[k] = v;
}
fs.writeFileSync('.local/notes/sync/7.2.3-source-sections.json', JSON.stringify(out, null, 2));
console.log('Секций с файлами:', Object.keys(out).length);
for (const [k, v] of Object.entries(out)) {
  console.log(`\n## ${k} (${v.length} файлов)`);
  for (const f of v.slice(0, 3)) console.log('  -', f.title.slice(0, 80), '|', f.url.split('/').pop().slice(0, 60));
  if (v.length > 3) console.log('  ...');
}
