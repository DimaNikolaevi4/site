#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const NEW_BASE = 'https://xn----8sbwke6acce8h.xn--p1ai/docs/';
const OLD_RE = /https:\/\/sit-salsk\.ru\/wp-content\/uploads\/\d{4}\/\d{2}\/([^)\s"<>]+)/g;

const serverFiles = new Set(
  fs.readFileSync('attached_assets/server_list_1777089935351.txt', 'utf8')
    .split('\n')
    .map(l => l.split(' | ')[0].trim())
    .filter(Boolean)
);

const RENAMES = new Map([
  ['43.01.09_РП_ПМ.02-Приготовление-оформление-и-подготовка-к-реализации-горячих-блюд-кулинарных-изделий-закусок-разнообразного-ассортимента.doc.zip',
   '43.01.09_РП_ПМ.02-Горячие-блюда.doc.zip'],
  ['43.01.09_РП-ПМ-03-Приготовление-оформление-и-подготовка-к-реализации-холодных-блюд-кулинарных-изделий-закусок-разнообразного-ассортимента.doc',
   '43.01.09_РП_ПМ.03-Холодные-блюда.doc'],
]);

const files = [
  'src/content/pages/svedenija/education/index.md',
];

let totalSwapped = 0, totalKept = 0, totalRenamed = 0;
const missing = new Set();

for (const f of files) {
  let txt = fs.readFileSync(f, 'utf8');
  txt = txt.replace(OLD_RE, (full, basenameRaw) => {
    let basename;
    try { basename = decodeURIComponent(basenameRaw); }
    catch { basename = basenameRaw; }

    if (RENAMES.has(basename)) {
      const target = RENAMES.get(basename);
      totalRenamed++;
      return NEW_BASE + encodeURIComponent(target).replace(/%2F/g, '/');
    }
    if (serverFiles.has(basename)) {
      totalSwapped++;
      return NEW_BASE + encodeURIComponent(basename).replace(/%2F/g, '/');
    }
    totalKept++;
    missing.add(basename);
    return full;
  });
  fs.writeFileSync(f, txt);
}

console.log(`swapped: ${totalSwapped}`);
console.log(`renamed: ${totalRenamed}`);
console.log(`kept on sit-salsk: ${totalKept} (unique: ${missing.size})`);
fs.writeFileSync('.local/notes/edu/missing_on_server.txt',
  Array.from(missing).sort().join('\n') + '\n');
console.log(`missing list: .local/notes/edu/missing_on_server.txt`);
