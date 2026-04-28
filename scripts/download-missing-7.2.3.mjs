#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const checked = JSON.parse(fs.readFileSync('.local/notes/sync/7.2.3-missing-checked.json', 'utf8'));
const toDownload = checked.filter(r => !r.foundUrl);
const DEST = 'src/assets/uploads/dokumenty/';
fs.mkdirSync(DEST, { recursive: true });

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function dl(item) {
  const dest = path.join(DEST, item.filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
    return { item, status: 'EXISTS', size: fs.statSync(dest).size };
  }
  try {
    const r = await fetch(item.url, { headers: { 'User-Agent': UA, 'Referer': 'https://sit-salsk.ru/' } });
    if (!r.ok) return { item, status: `HTTP ${r.status}` };
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return { item, status: 'OK', size: buf.length };
  } catch (e) {
    return { item, status: `ERR ${e.message}` };
  }
}

const results = await Promise.all(toDownload.map(dl));
for (const r of results) {
  console.log(`[${r.status}] ${r.size ?? '-'} — ${r.item.filename}`);
}
const ok = results.filter(r => r.status === 'OK' || r.status === 'EXISTS').length;
console.log(`\nИтого: ${ok}/${results.length} скачано/уже есть`);
fs.writeFileSync('.local/notes/sync/7.2.3-download-results.json', JSON.stringify(results, null, 2));
