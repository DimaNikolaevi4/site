#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const OUT = 'src/assets/uploads/employment';
fs.mkdirSync(OUT, { recursive: true });

const FILES = [
  ['obschaya-informatsiya.docx',                          'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9E%D0%91%D0%A9%D0%90%D0%AF-%D0%98%D0%9D%D0%A4%D0%9E%D0%A0%D0%9C%D0%90%D0%A6%D0%98%D0%AF.docx'],
  ['polozhenie-o-tsentre-karyery-prikaz-89-2025.pdf',     'https://sit-salsk.ru/wp-content/uploads/2025/11/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BE-%D0%A6%D0%B5%D0%BD%D1%82%D1%80%D0%B5-%D0%9A%D0%B0%D1%80%D1%8C%D0%B5%D1%80%D1%8B-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D1%83%D0%BC%D0%B0-%D0%9F%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BA-%D0%9F%D1%80%D0%B8%D0%BA%D0%B0%D0%B7%D1%83-%E2%84%9689-%D0%BE%D1%82-29.08.25.pdf'],
  ['soglashenie-s-tszn-salsk-2025.pdf',                   'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5.pdf'],
  ['perechen-partnerov.docx',                             'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F-%D0%B8-%D0%9B%D0%9E%D0%93%D0%9E.docx'],
  ['spisok-vakansiy.pdf',                                 'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D0%B2%D0%B0%D0%BA%D0%B0%D0%BD%D1%81%D0%B8%D0%B9.pdf'],
  ['sostavlyaem-rezyume.doc',                             'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%A1%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC-%D1%80%D0%B5%D0%B7%D1%8E%D0%BC%D0%B5.doc'],
  ['gotovimsya-k-sobesedovaniyu.docx',                    'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%93%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D0%BC%D1%81%D1%8F-%D0%BA-%D1%81%D0%BE%D0%B1%D0%B5%D1%81%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8E.docx'],
  ['individualnyy-plan-karyery.docx',                     'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%98%D0%BD%D0%B4%D0%B8%D0%B2%D0%B8%D0%B4%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%BF%D0%BB%D0%B0%D0%BD-%D0%BA%D0%B0%D1%80%D1%8C%D0%B5%D1%80%D1%8B.docx'],
  ['kak-sostavit-avtobiografiyu.docx',                    'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9A%D0%B0%D0%BA-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8E.docx'],
  ['kak-sostavit-karyernyy-plan.docx',                    'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9A%D0%B0%D0%BA-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%BA%D0%B0%D1%80%D1%8C%D0%B5%D1%80%D0%BD%D1%8B%D0%B9-%D0%BF%D0%BB%D0%B0%D0%BD.docx'],
  ['metodika-poiska-raboty.docx',                         'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D0%BA%D0%B0-%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B.docx'],
  ['pamyatka-po-trudoustroystvu.docx',                    'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BA%D0%B0-%D0%BF%D0%BE-%D1%82%D1%80%D1%83%D0%B4%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D1%83.docx'],
  ['pamyatka-pervaya-vstrecha.docx',                      'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BA%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D0%B9-%D0%BF%D0%BE%D0%B4%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%BA%D0%B8-%D0%BA-%D0%BF%D0%B5%D1%80%D0%B2%D0%BE%D0%B9-%D0%B2%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B5.docx'],
  ['pamyatka-individualnaya-karyernaya-traektoriya.docx', 'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BA%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B8%D0%BD%D0%B4%D0%B8%D0%B2%D0%B8%D0%B4%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-%D0%BA%D0%B0%D1%80%D1%8C%D0%B5%D1%80%D0%BD%D0%BE%D0%B9-%D1%82%D1%80%D0%B0%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B8%D0%B8.docx'],
  ['informatsionnye-resursy-dlya-poiska-raboty.docx',     'https://sit-salsk.ru/wp-content/uploads/2025/12/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5-%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B.docx'],
  ['grafik-kursov-dpo-2025-2026.pdf',                     'https://sit-salsk.ru/wp-content/uploads/2026/03/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA-%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BA%D1%83%D1%80%D1%81%D0%BE%D0%B2-%D0%BF%D0%BE-%D0%B4%D0%BE%D0%BF.%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8E-%D0%B4%D0%BB%D1%8F-%D1%81%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%93%D0%91%D0%9F%D0%9E%D0%A3-%D0%A0%D0%9E-%D0%A1%D0%98%D0%A2-%D0%BD%D0%B0-2025-26-%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D1%8B%D0%B9-%D0%B3%D0%BE%D0%B4.pdf'],
  ['slayd1.jpg',                                          'https://sit-salsk.ru/wp-content/uploads/2025/08/%D0%A1%D0%BB%D0%B0%D0%B9%D0%B41.jpg'],
  ['marshrutizatsiya-molodezhi-mintrud-rf.mp4',           'https://sit-salsk.ru/wp-content/uploads/2025/08/%D0%9C%D0%B0%D1%80%D1%88%D1%80%D1%83%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BC%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B6%D0%B8-%D0%9C%D0%B8%D0%BD%D1%82%D1%80%D1%83%D0%B4-%D0%A0%D0%A4.mp4'],
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const opts = { headers: { 'User-Agent': 'Mozilla/5.0' } };
    https.get(url, opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(fs.statSync(dest).size)));
    }).on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

let ok = 0, fail = 0, total = 0;
for (const [name, url] of FILES) {
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest)) { console.log(`skip ${name} (${fs.statSync(dest).size} B)`); ok++; total += fs.statSync(dest).size; continue; }
  try {
    const size = await download(url, dest);
    console.log(`ok   ${name} (${size} B)`);
    ok++; total += size;
  } catch (e) {
    console.error(`FAIL ${name}: ${e.message}`);
    fail++;
  }
}
console.log(`\n=== ${ok} ok / ${fail} fail / ${(total/1024/1024).toFixed(2)} MB total ===`);
process.exit(fail ? 1 : 0);
