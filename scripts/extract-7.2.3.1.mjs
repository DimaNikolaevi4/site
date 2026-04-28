import fs from 'node:fs';
const html = fs.readFileSync('.local/notes/sync/7.2.3.1-source.html','utf8');

// 1) Извлечь блок только основного контента (entry-content)
const cm = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/);
const content = cm ? cm[1] : html;
fs.writeFileSync('.local/notes/sync/7.2.3.1-content.html', content);

// 2) Найти все ссылки <a href="...">текст</a>
const anchors = [...content.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];

const fileExt = /\.(pdf|zip|doc|docx|xls|xlsx|jpg|jpeg|png|rar)$/i;
const items = [];
for (const m of anchors) {
  const href = m[1].trim();
  const text = m[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  // только wp-content uploads (файлы) или абсолютные ссылки на файлы
  if (/\/wp-content\/uploads\//.test(href) && fileExt.test(href)) {
    items.push({ url: href, title: text });
  }
}

// уникализируем по basename
const byBase = new Map();
for (const it of items) {
  try {
    const u = new URL(it.url);
    const bn = decodeURIComponent(u.pathname.split('/').pop()).toLowerCase();
    if (!byBase.has(bn)) byBase.set(bn, { ...it, basename: bn });
  } catch {}
}

// также: внешние ссылки, не на файлы (Google Forms и т.п.) — для информации
const externals = [];
for (const m of anchors) {
  const href = m[1].trim();
  if (/^https?:\/\//.test(href) && !/sit-salsk\.ru/.test(href)) {
    externals.push({ url: href, title: m[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim() });
  }
}

console.log(`Всего <a> с файлами wp-content: ${items.length}`);
console.log(`Уникальных файлов (по basename): ${byBase.size}`);
console.log(`Внешних (не на файлы): ${externals.length}`);

fs.writeFileSync('.local/notes/sync/7.2.3.1-source-files.json', JSON.stringify([...byBase.values()], null, 2));
fs.writeFileSync('.local/notes/sync/7.2.3.1-source-externals.json', JSON.stringify(externals, null, 2));

// сравнение с index.md
const md = fs.readFileSync('src/content/pages/svedenija/documents/vsoko/index.md','utf8');
const HOST = 'xn----8sbwke6acce8h.xn--p1ai';
const ourFiles = new Set();

// хост-ссылки
for (const m of md.matchAll(/https?:\/\/[^\s")]+/g)) {
  const u = m[0];
  if (u.includes(HOST)) {
    try {
      const bn = decodeURIComponent(new URL(u).pathname.split('/').pop()).toLowerCase();
      if (bn) ourFiles.add(bn);
    } catch {}
  }
}
// локальные
for (const m of md.matchAll(/[("']\/assets\/uploads\/[^)"'\s]+/g)) {
  const p = m[0].slice(1);
  const bn = decodeURIComponent(p.split('/').pop()).toLowerCase();
  if (bn) ourFiles.add(bn);
}

console.log(`\nУ нас в vsoko/index.md: ${ourFiles.size} ссылок (по basename)`);

const sourceFiles = [...byBase.values()];
const missing = sourceFiles.filter(s => !ourFiles.has(s.basename));
const present = sourceFiles.filter(s => ourFiles.has(s.basename));
console.log(`Совпадает: ${present.length}`);
console.log(`Отсутствует у нас: ${missing.length}\n`);

console.log('=== ПЕРВЫЕ 20 ОТСУТСТВУЮЩИХ ===');
for (const m of missing.slice(0,20)) {
  console.log(`- ${m.title}\n    ${m.url}\n    bn: ${m.basename}`);
}

fs.writeFileSync('.local/notes/sync/7.2.3.1-missing.json', JSON.stringify(missing, null, 2));
fs.writeFileSync('.local/notes/sync/7.2.3.1-present.json', JSON.stringify(present, null, 2));
