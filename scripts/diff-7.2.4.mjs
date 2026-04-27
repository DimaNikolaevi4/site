import fs from 'node:fs';
const html = fs.readFileSync('.local/notes/sync/7.2.4-p33507.html','utf8');
const yaml = fs.readFileSync('src/_data/antiCorruption.yaml','utf8');

// content: между <article> и </article>
const cm = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
const content = cm ? cm[1] : html;
fs.writeFileSync('.local/notes/sync/7.2.4-p33507-content.html', content);

// Извлекаем все anchor
const anchors = [...content.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
const fileExt = /\.(pdf|zip|doc|docx|xls|xlsx|jpg|jpeg|png|rar)$/i;
const wpFiles = [];
const externals = [];
const seen = new Set();

for (const m of anchors) {
  const href = m[1].trim();
  const text = m[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  if (/\/wp-content\/uploads\//i.test(href) && fileExt.test(href)) {
    try {
      const bn = decodeURIComponent(new URL(href).pathname.split('/').pop()).toLowerCase();
      if (!seen.has(bn)) { seen.add(bn); wpFiles.push({ url: href, title: text, basename: bn }); }
    } catch {}
  } else if (/^https?:\/\//.test(href) && !/sit-salsk\.ru/.test(href)) {
    externals.push({ url: href, title: text });
  }
}

console.log(`Источник ?p=33507:`);
console.log(`  WP-файлов уникальных: ${wpFiles.size = wpFiles.length}`);
console.log(`  Внешних ссылок: ${externals.length}`);

// Что у нас в YAML — собрать basenames всех URL
const ourUrls = [...yaml.matchAll(/url:\s*"?([^"\s]+)"?/g)].map(m => m[1]);
const ourBn = new Set();
for (const u of ourUrls) {
  if (u === '#') continue;
  try {
    const bn = decodeURIComponent(new URL(u).pathname.split('/').pop()).toLowerCase();
    if (bn) ourBn.add(bn);
  } catch {}
}
console.log(`У нас в yaml: ${ourBn.size} уникальных файлов`);

// Внешние полные URL
const ourFullUrls = new Set(ourUrls);

const missing = wpFiles.filter(f => !ourBn.has(f.basename));
const present = wpFiles.filter(f => ourBn.has(f.basename));
console.log(`\nСовпадает (по basename): ${present.length}`);
console.log(`Отсутствует у нас: ${missing.length}\n`);

console.log('=== ОТСУТСТВУЕТ В antiCorruption.yaml ===');
for (const m of missing) {
  console.log(`- "${m.title}"\n    ${m.url}\n    bn: ${m.basename}`);
}

console.log('\n=== ВНЕШНИЕ ССЫЛКИ ИСТОЧНИКА (sample) ===');
const extMissing = externals.filter(e => !ourFullUrls.has(e.url));
console.log(`Внешних всего: ${externals.length}, отсутствует у нас: ${extMissing.length}`);
for (const e of extMissing.slice(0,15)) console.log(`- "${e.title}"\n    ${e.url}`);

fs.writeFileSync('.local/notes/sync/7.2.4-missing-files.json', JSON.stringify(missing, null, 2));
fs.writeFileSync('.local/notes/sync/7.2.4-missing-externals.json', JSON.stringify(extMissing, null, 2));
fs.writeFileSync('.local/notes/sync/7.2.4-source-files.json', JSON.stringify(wpFiles, null, 2));
fs.writeFileSync('.local/notes/sync/7.2.4-source-externals.json', JSON.stringify(externals, null, 2));
