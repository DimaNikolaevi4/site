#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, basename, join } from 'node:path';

const SRC_HTML = '/tmp/p14968.html';
const OUT_DIR = 'src/assets/uploads/finance';
const OUT_MD  = 'src/content/pages/svedenija/finance/index.md';
const PUBLIC_BASE = '/assets/uploads/finance';

const html = readFileSync(SRC_HTML, 'utf8');

const startIdx = html.indexOf('<div class="entry-content">');
const endIdx   = html.indexOf('<!-- .entry-content -->', startIdx);
if (startIdx < 0 || endIdx < 0) { console.error('entry-content not found'); process.exit(1); }
const entry = html.slice(startIdx, endIdx);

function decodeEntities(s) {
  return s
    .replace(/&#8211;/g, '—').replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘').replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '«').replace(/&#8221;/g, '»')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}
const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

const groups = []; // [{year, items:[{title, pdf}]}]
const yearRe = /<h2[^>]*>[\s\S]*?<strong>\s*(\d{4})\s*<\/strong>[\s\S]*?<\/h2>([\s\S]*?)(?=<h2|$)/g;
let m;
while ((m = yearRe.exec(entry)) !== null) {
  const year = m[1];
  const block = m[2];
  const items = [];
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/g;
  let li;
  while ((li = liRe.exec(block)) !== null) {
    const liHtml = li[1];
    const aRe = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let firstPdf = null;
    let firstTitle = null;
    let a;
    while ((a = aRe.exec(liHtml)) !== null) {
      const href = a[1];
      const text = stripTags(a[2]);
      if (/\.pdf(\?|$)/i.test(href) && !firstPdf) {
        firstPdf = href; firstTitle = text;
        break;
      }
    }
    if (firstPdf) items.push({ title: firstTitle, pdf: firstPdf });
  }
  if (items.length) groups.push({ year, items });
}

console.log(`Найдено годов: ${groups.length}`);
let total = 0;
for (const g of groups) { total += g.items.length; console.log(`  ${g.year}: ${g.items.length} док.`); }
console.log(`Всего PDF: ${total}`);

function fileNameFromUrl(u) {
  const url = new URL(u);
  const name = decodeURIComponent(url.pathname.split('/').pop());
  return name;
}

async function downloadOne(url, dest) {
  if (existsSync(dest) && statSync(dest).size > 1024) return { skipped: true, size: statSync(dest).size };
  const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 60_000);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/pdf,*/*' }, signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 256) throw new Error(`tiny body ${buf.length}b`);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, buf);
      return { size: buf.length };
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 500 * attempt));
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr;
}

const failures = [];
let ok = 0, skipped = 0;
const all = [];
for (const g of groups) {
  for (const it of g.items) {
    const fname = fileNameFromUrl(it.pdf);
    it.localName = fname;
    it.localPath = join(OUT_DIR, g.year, fname);
    it.publicUrl = `${PUBLIC_BASE}/${g.year}/${encodeURI(fname)}`;
    all.push(it);
  }
}
const CONCURRENCY = Number(process.env.CONCURRENCY || 8);
let cursor = 0;
async function worker() {
  while (cursor < all.length) {
    const it = all[cursor++];
    try {
      const r = await downloadOne(it.pdf, it.localPath);
      if (r.skipped) { skipped++; process.stdout.write('.'); }
      else { ok++; process.stdout.write('+'); }
    } catch (e) {
      failures.push({ url: it.pdf, err: String(e.message || e) });
      process.stdout.write('!');
    }
  }
}
await Promise.all(Array.from({length: CONCURRENCY}, worker));
console.log(`\nГотово: загружено ${ok}, уже было ${skipped}, ошибок ${failures.length}`);
if (failures.length) {
  console.log('Ошибки:');
  for (const f of failures.slice(0, 20)) console.log(`  ${f.url}\n    -> ${f.err}`);
}

const lines = [];
lines.push('---');
lines.push('title: Финансово-хозяйственная деятельность');
lines.push('layout: layouts/svedenija-page.njk');
lines.push('section: finance');
lines.push('rubric: "2.9"');
lines.push('permalink: /svedenija/finance/');
lines.push('description: Финансово-хозяйственная деятельность ГБПОУ РО «Сальский индустриальный техникум» — государственные задания, планы ФХД, отчёты по годам.');
lines.push('---');
lines.push('');
lines.push('## Общая информация');
lines.push('');
lines.push('ГБПОУ РО «Сальский индустриальный техникум» — государственное бюджетное профессиональное образовательное учреждение. Финансовое обеспечение деятельности осуществляется за счёт средств бюджета Ростовской области, целевых субсидий и доходов от приносящей доход деятельности.');
lines.push('');
lines.push('Согласно Федеральному закону от 08.05.2010 № 83-ФЗ техникум публикует государственное задание, план финансово-хозяйственной деятельности и отчётность по итогам каждого финансового года. Подробная финансовая отчётность также размещена на государственном портале **[bus.gov.ru](https://bus.gov.ru)**.');
lines.push('');
lines.push('Информация о платных образовательных услугах вынесена в отдельный подраздел: ➡️ [**Платные образовательные услуги**](/svedenija/paid-services/). Стипендии и иные виды материальной поддержки — ➡️ [**Стипендии**](/svedenija/stipend/).');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Документы по годам');
lines.push('');
for (const g of groups) {
  lines.push(`### ${g.year}`);
  lines.push('');
  for (const it of g.items) {
    lines.push(`- 📄 [${it.title}](${it.publicUrl})`);
  }
  lines.push('');
}
lines.push('---');
lines.push('');
lines.push('## Контроль за финансово-хозяйственной деятельностью');
lines.push('');
lines.push('Деятельность техникума контролируется:');
lines.push('');
lines.push('- Министерством общего и профессионального образования Ростовской области');
lines.push('- Министерством финансов Ростовской области');
lines.push('- Счётной палатой Ростовской области');
lines.push('- Федеральным казначейством');
lines.push('');

mkdirSync(dirname(OUT_MD), { recursive: true });
writeFileSync(OUT_MD, lines.join('\n'));
console.log(`Записан: ${OUT_MD}`);
