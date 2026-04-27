#!/usr/bin/env node
import fs from 'node:fs';

const missing = JSON.parse(fs.readFileSync('.local/notes/sync/7.2.3-missing.json', 'utf8'));
const HOST = 'https://xn----8sbwke6acce8h.xn--p1ai/docs/dokumenty/';

const results = [];
for (const m of missing) {
  const filename = decodeURIComponent(m.url.split('/').pop());
  const candidates = [
    HOST + encodeURIComponent(filename),
    HOST + filename.split('').map(c => /[a-zA-Z0-9._-]/.test(c) ? c : encodeURIComponent(c)).join(''),
  ];
  let foundUrl = null;
  let status = null;
  for (const u of candidates) {
    try {
      const r = await fetch(u, { method: 'HEAD', redirect: 'follow' });
      status = r.status;
      if (r.ok) { foundUrl = u; break; }
    } catch (e) { status = `ERR ${e.message}`; }
  }
  results.push({ ...m, filename, foundUrl, status });
  console.log(`[${foundUrl ? 'OK ' : 'NO '}] ${status} — ${filename}`);
}

fs.writeFileSync('.local/notes/sync/7.2.3-missing-checked.json', JSON.stringify(results, null, 2));
const onHost = results.filter(r => r.foundUrl).length;
console.log(`\nИтого: ${onHost}/${results.length} найдено на хостинге`);
console.log(`Нужно скачать: ${results.length - onHost} файлов`);
