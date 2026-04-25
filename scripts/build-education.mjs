#!/usr/bin/env node
// Генератор страницы «Образование» (svedenija/education/index.md)
// Источник правды: .local/notes/edu/main_text.txt — извлечённый entry-content
// со страницы https://sit-salsk.ru/?p=14965 (боевой WordPress).
//
// ВАЖНО: ссылки на документы пока ведут на sit-salsk.ru. После загрузки
// 797 файлов на хостинг прогнать sed-заменой:
//   sed -i 's|https://sit-salsk.ru/wp-content/uploads/|https://xn----8sbwke6acce8h.xn--p1ai/docs/obrazovanie/|g' src/content/pages/svedenija/education/index.md
//
// Использование: node scripts/build-education.mjs

import fs from 'node:fs';

const SRC = '.local/notes/edu/main_text.txt';
const DST = 'src/content/pages/svedenija/education/index.md';

const lines = fs.readFileSync(SRC, 'utf8').split('\n').map(l => l.trim());

const RX_PROG_HEADER = /^(\d{2}\.\d{2}\.\d{2})\s+(.+?);?\s*$/;
const RX_LINK = /\[LINK:\s*([^→\]]+?)\s*→\s*(https?:\/\/[^\]\s]+?)\s*\]/g;
const RX_OPEN_NEW = /\[LINK:\s*Открыть в новой вкладке\s*→[^\]]+\]/g;
const NOISE = [
  /^\[IMG:\s*Загрузчик\]\s*$/, /^\[IMG:\s*Логотип EAD\]\s*$/, /^\[IMG\]\s*$/,
  /^\[IMG:\s*Перезагрузка\]\s*Перезагрузить документ\s*$/,
  /^Загрузка\.\.\.\s*$/, /^Слишком долго\?\s*$/, /^\|\s*$/,
];
const SECTION_HEADERS = new Set([
  'Свидетельство о государственной аккредитации',
  'Лицензия на осуществление образовательной деятельности',
  'Реализуемые в ГБПОУ РО "СИТ" программы подготовки',
  'График учебного процесса очного отделения ГБПОУ РО "СИТ"',
  'График проведения практики для студентов ГБПОУ РО "СИТ"',
]);
const RX_PROGS_FOR = /^Программы для (специальности|профессии)\s+(\d{2}\.\d{2}\.\d{2})\s*$/;
const META_FIELDS = ['Код специальности','Код профессии','Наименование специальности','Наименование профессии','Нормативный срок обучения','Наименование квалификации базовой подготовки'];
const isMeta = s => META_FIELDS.some(f => s.startsWith(f + ':'));

function convertLinks(s) {
  s = s.replace(RX_OPEN_NEW, '');
  s = s.replace(RX_LINK, (_, t, u) => `[${t.trim()}](${u.trim()})`);
  return s.replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();
}

function isProgramHeader(idx) {
  const s = lines[idx];
  if (s.includes('[LINK')) return null;
  const m = s.match(RX_PROG_HEADER);
  if (!m) return null;
  for (let j = idx + 1; j < Math.min(idx + 4, lines.length); j++) {
    const next = lines[j];
    if (!next) continue;
    if (next.startsWith('Код специальности:') || next.startsWith('Код профессии:')) return m;
    return null;
  }
  return null;
}

const out = [];
out.push('---');
out.push('title: Образование');
out.push('layout: layouts/svedenija-page.njk');
out.push('section: education');
out.push('rubric: "2.4"');
out.push('permalink: /svedenija/education/');
out.push('description: Образовательные программы ГБПОУ РО «Сальский индустриальный техникум» — лицензия, аккредитация, реализуемые программы, учебные планы, рабочие программы дисциплин, программы практик, программы ГИА.');
out.push('---');
out.push('');

let i = 0, metaBuf = [], inIntroList = false;

function flushMeta() {
  if (!metaBuf.length) return;
  out.push('| | |');
  out.push('|---|---|');
  for (const m of metaBuf) {
    const idx = m.indexOf(':');
    const k = m.slice(0, idx).trim();
    const v = m.slice(idx + 1).trim() || '—';
    out.push(`| **${k}** | ${v.replace(/\|/g, '\\|')} |`);
  }
  out.push('');
  metaBuf = [];
}

function isIntroProgramItem(s) {
  const m = s.match(RX_PROG_HEADER);
  if (!m) return false;
  if (s.includes('[LINK')) return false;
  return isProgramHeader(i) === null;
}

while (i < lines.length) {
  const s = lines[i];
  if (!s) { i++; continue; }
  if (NOISE.some(rx => rx.test(s))) { i++; continue; }

  if (isIntroProgramItem(s)) {
    if (!inIntroList) { out.push(''); inIntroList = true; }
    out.push('- ' + s.replace(/;$/, ''));
    i++;
    continue;
  }
  if (inIntroList && !isIntroProgramItem(s)) { out.push(''); inIntroList = false; }

  const ph = isProgramHeader(i);
  if (ph) {
    flushMeta();
    out.push('', '---', '', `## ${ph[1]} ${ph[2].trim().replace(/;$/, '')}`, '');
    i++;
    continue;
  }

  if (isMeta(s)) { metaBuf.push(s); i++; continue; }
  else if (metaBuf.length) flushMeta();

  const m2 = s.match(RX_PROGS_FOR);
  if (m2) {
    out.push('', `### Рабочие программы дисциплин — ${m2[2]}`, '');
    i++;
    continue;
  }

  if (SECTION_HEADERS.has(s)) {
    out.push('', '---', '', `## ${s}`, '');
    i++;
    continue;
  }

  if (/^(ППССЗ|ППКРС|ГИА):/.test(s)) {
    const lab = s.match(/^(ППССЗ|ППКРС|ГИА):/)[1];
    const rest = s.slice(lab.length + 1).trim();
    out.push(`**${lab}:** ${convertLinks(rest)}`, '');
    i++;
    continue;
  }

  if (s.startsWith('[LINK:')) {
    const conv = convertLinks(s);
    if (conv && conv !== '-') out.push('- ' + conv);
    i++;
    continue;
  }

  if (s === '…') { i++; continue; }
  out.push(convertLinks(s), '');
  i++;
}

flushMeta();

const final = [];
let prevEmpty = false;
for (const l of out) {
  if (l.trim() === '-' || l.trim() === '- ') continue;
  const empty = !l.trim();
  if (empty && prevEmpty) continue;
  if (l.trim() === '---' && final.length && final[final.length - 1].trim() === '---') continue;
  final.push(l);
  prevEmpty = empty;
}

fs.writeFileSync(DST, final.join('\n') + '\n');
console.log(`✅ ${DST} — ${final.length} строк, ${fs.statSync(DST).size} байт`);
