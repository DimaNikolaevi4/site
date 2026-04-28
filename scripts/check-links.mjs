import http from 'node:http';

const PAGES = process.argv.slice(2);
if (PAGES.length === 0) {
  console.error('usage: node scripts/check-links.mjs <path> [<path>...]');
  process.exit(2);
}

function get(p) {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000' + p, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

function extractLinks(html) {
  const out = new Set();
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) out.add(m[1]);
  return [...out];
}

const cache = new Map();
async function checkInternal(url) {
  if (cache.has(url)) return cache.get(url);
  const r = await get(url);
  cache.set(url, r.status);
  return r.status;
}

for (const page of PAGES) {
  const r = await get(page);
  console.log(`\n========== ${page} (HTTP ${r.status}, ${r.body.length} bytes) ==========`);
  if (r.status !== 200) { console.log('SKIP — page not 200'); continue; }

  const links = extractLinks(r.body);
  const internal = [];
  const external = [];
  const anchor = [];
  const proto = [];
  for (const u of links) {
    if (!u || u.trim() === '') continue;
    if (u.startsWith('#')) anchor.push(u);
    else if (u.startsWith('http://') || u.startsWith('https://')) external.push(u);
    else if (/^(mailto:|tel:|javascript:|data:)/.test(u)) proto.push(u);
    else internal.push(u.startsWith('/') ? u : '/' + u);
  }

  const bad = [];
  const seen = new Set();
  for (const raw of internal) {
    const u = raw.split('#')[0].split('?')[0];
    if (!u || u === '/' || seen.has(u)) continue;
    seen.add(u);
    const status = await checkInternal(u);
    if (status !== 200) bad.push({ kind: 'internal', status, url: raw });
  }
  for (const a of anchor) {
    if (a === '#') continue;
    const id = a.slice(1).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(`(id|name)="${id}"`);
    if (!re.test(r.body)) bad.push({ kind: 'anchor', status: 'no-target', url: a });
  }

  console.log(`Links: internal=${internal.length} (unique ${seen.size}), external=${external.length}, anchors=${anchor.length}, other=${proto.length}`);
  if (bad.length === 0) console.log('OK — битых внутренних ссылок и якорей нет');
  else { console.log(`BAD (${bad.length}):`); bad.forEach((b) => console.log(`  [${b.kind} ${b.status}] ${b.url}`)); }
  if (external.length > 0) {
    console.log(`External (не проверял HTTP-кодом, чтобы не ходить во внешний мир):`);
    [...new Set(external)].forEach((e) => console.log(`  • ${e}`));
  }
}
