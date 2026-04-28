#!/usr/bin/env node
import fs from 'node:fs';

const NEW_BASE = 'https://xn----8sbwke6acce8h.xn--p1ai/docs/';
const OLD_RE = /https?:\/\/sit-salsk\.ru\/wp-content\/uploads\/\d{4}\/\d{2}\/([^)\s"<>]+)/g;
// Плоские ссылки вида .../docs/<имя_без_подпапки> — наследие предыдущего скрипта
const FLAT_RE = /https?:\/\/xn----8sbwke6acce8h\.xn--p1ai\/docs\/([^/)\s"<>]+)(?=[)\s"<>])/g;

// === Источник истины: реальная структура /docs/ на хостинге.
// Парсим вывод `tree` (docs_structure.txt) и строим карту: имя_файла → подпапка.
const STRUCTURE_FILE = 'attached_assets/docs_structure_1777089935351.txt';
const fileToDir = new Map();
{
  const lines = fs.readFileSync(STRUCTURE_FILE, 'utf8').split('\n');
  const stack = []; // [{depth, name}]
  for (const ln of lines) {
    // Найти позицию `[ size ]  имя`
    const m = ln.match(/^([│ \u00a0├└─]*)\[[^\]]+\]\s+(.+?)\*?$/);
    if (!m) continue;
    const prefix = m[1];
    const name = m[2].trim();
    // Глубина по числу 4-символьных групп префикса (│   / ├──)
    const depth = Math.floor(prefix.length / 4);
    const isDir = name.endsWith('/');
    const cleanName = isDir ? name.replace(/\/$/, '') : name;
    // Сжать стек до текущей глубины
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (isDir) {
      stack.push({ depth, name: cleanName });
    } else {
      // Подпапка под /docs/ = элемент стека с depth === 1
      // (depth 0 — это корень /home/.../docs/, его игнорируем)
      const top = stack.find((s) => s.depth === 1);
      const sub = top ? top.name : '';
      if (sub) {
        // Если файл есть в нескольких местах — оставляем первое попадание
        if (!fileToDir.has(cleanName)) fileToDir.set(cleanName, sub);
      }
    }
  }
}

// === Ручные переименования (старые WP-имена → актуальные на хостинге)
const RENAMES = new Map([
  ['43.01.09_РП_ПМ.02-Приготовление-оформление-и-подготовка-к-реализации-горячих-блюд-кулинарных-изделий-закусок-разнообразного-ассортимента.doc.zip',
   '43.01.09_РП_ПМ.02-Горячие-блюда.doc.zip'],
  ['43.01.09_РП-ПМ-03-Приготовление-оформление-и-подготовка-к-реализации-холодных-блюд-кулинарных-изделий-закусок-разнообразного-ассортимента.doc',
   '43.01.09_РП_ПМ.03-Холодные-блюда.doc'],
]);

const files = [
  'src/content/pages/svedenija/education/index.md',
];

function buildUrl(basename) {
  const sub = fileToDir.get(basename);
  if (!sub) return null;
  // URL: NEW_BASE + sub + '/' + encoded(basename)
  return NEW_BASE + encodeURIComponent(sub) + '/' + encodeURIComponent(basename);
}

let totalSwapped = 0, totalKept = 0, totalRenamed = 0;
let totalFlatFixed = 0, totalFlatMissed = 0;
const missing = new Set();
const flatMissing = new Set();

for (const f of files) {
  let txt = fs.readFileSync(f, 'utf8');
  // Шаг 1: ссылки sit-salsk.ru → подходящая подпапка docs/<sub>/<name>
  txt = txt.replace(OLD_RE, (full, basenameRaw) => {
    let basename;
    try { basename = decodeURIComponent(basenameRaw); }
    catch { basename = basenameRaw; }

    if (RENAMES.has(basename)) {
      const target = RENAMES.get(basename);
      const url = buildUrl(target);
      if (url) {
        totalRenamed++;
        return url;
      }
    }
    const url = buildUrl(basename);
    if (url) {
      totalSwapped++;
      return url;
    }
    totalKept++;
    missing.add(basename);
    return full;
  });
  // Шаг 2: «плоские» уже-наши ссылки .../docs/<имя> → .../docs/<sub>/<имя>
  txt = txt.replace(FLAT_RE, (full, basenameRaw) => {
    let basename;
    try { basename = decodeURIComponent(basenameRaw); }
    catch { basename = basenameRaw; }
    const url = buildUrl(basename);
    if (url && url !== full) {
      totalFlatFixed++;
      return url;
    }
    if (!url) {
      totalFlatMissed++;
      flatMissing.add(basename);
    }
    return full;
  });
  fs.writeFileSync(f, txt);
}

console.log(`swapped (sit-salsk → docs/sub): ${totalSwapped}`);
console.log(`renamed: ${totalRenamed}`);
console.log(`kept on sit-salsk: ${totalKept} (unique: ${missing.size})`);
console.log(`flat fixed (docs/file → docs/sub/file): ${totalFlatFixed}`);
console.log(`flat missed (file not in docs_structure): ${totalFlatMissed} (unique: ${flatMissing.size})`);
console.log(`indexed files in docs_structure: ${fileToDir.size}`);
fs.mkdirSync('.local/notes/edu', { recursive: true });
fs.writeFileSync('.local/notes/edu/missing_on_server.txt',
  Array.from(missing).sort().join('\n') + (missing.size ? '\n' : ''));
console.log(`missing list: .local/notes/edu/missing_on_server.txt`);
