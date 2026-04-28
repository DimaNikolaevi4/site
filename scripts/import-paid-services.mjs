import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = 'src/assets/uploads/paid-services';
await mkdir(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const files = [
  ['dogovor-ob-obrazovanii-2024.pdf',
   'https://sit-salsk.ru/wp-content/uploads/2014/09/%D0%94%D0%BE%D0%B3%D0%BE%D0%B2%D0%BE%D1%80-%D0%BE%D0%B1-%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%93%D0%91%D0%9F%D0%9E%D0%A3-%D0%A0%D0%9E-%D0%A1%D0%98%D0%A2-2024-1.pdf'],
  ['dogovor-ob-obrazovanii-2024.zip',
   'https://sit-salsk.ru/wp-content/uploads/2014/09/%D0%94%D0%BE%D0%B3%D0%BE%D0%B2%D0%BE%D1%80-%D0%BE%D0%B1-%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%93%D0%91%D0%9F%D0%9E%D0%A3-%D0%A0%D0%9E-%D0%A1%D0%98%D0%A2-2024-1.zip'],

  ['prikaz-66-ot-01.07.2025-rashody-2025-2029.pdf',
   'https://sit-salsk.ru/wp-content/uploads/2014/06/%D0%9F%D1%80%D0%B8%D0%BA%D0%B0%D0%B7-%E2%84%96-66-%D0%BE%D1%82-01.07.2025-%D0%9E%D0%B1-%D1%83%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B8-%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D0%B5-%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8-%D0%BD%D0%B0-2025-2029-%D1%83%D1%87.%D0%B3%D0%BE%D0%B4.pdf'],
  ['prikaz-66-ot-01.07.2025-rashody-2025-2029.zip',
   'https://sit-salsk.ru/wp-content/uploads/2014/06/%D0%9F%D1%80%D0%B8%D0%BA%D0%B0%D0%B7-%E2%84%96-66-%D0%BE%D1%82-01.07.2025.zip'],

  ['informatsiya-o-tsenah-2025-2026.pdf',
   'https://sit-salsk.ru/wp-content/uploads/2014/06/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE-%D1%86%D0%B5%D0%BD%D0%B0%D1%85-%D0%BD%D0%B0-2025-2026-%D1%83%D1%87.%D0%B3%D0%BE%D0%B4.pdf'],
  ['informatsiya-o-tsenah-2025-2026.zip',
   'https://sit-salsk.ru/wp-content/uploads/2014/06/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE-%D1%86%D0%B5%D0%BD%D0%B0%D1%85-%D0%BD%D0%B0-2025-2026.zip'],

  ['obrazets-kvitantsii-dlya-oplaty.docx',
   'https://sit-salsk.ru/wp-content/uploads/2015/06/%D0%9E%D0%B1%D1%80%D0%B0%D0%B7%D0%B5%D1%86-%D0%BA%D0%B2%D0%B8%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D1%8B-%D0%B7%D0%B0-%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D0%B0%D0%BC%D0%B8-%D0%93%D0%91%D0%9F%D0%9E%D0%A3-%D0%A0%D0%9E-%C2%AB%D0%A1%D0%98%D0%A2%C2%BB.docx'],
  ['obrazets-kvitantsii-dlya-oplaty.zip',
   'https://sit-salsk.ru/wp-content/uploads/2015/06/%D0%9E%D0%B1%D1%80%D0%B0%D0%B7%D0%B5%D1%86-%D0%BA%D0%B2%D0%B8%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D1%8B-%D0%B7%D0%B0-%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D0%B0%D0%BC%D0%B8-%D0%93%D0%91%D0%9F%D0%9E%D0%A3-%D0%A0%D0%9E-%C2%AB%D0%A1%D0%98%D0%A2.zip'],

  ['polozhenie-o-platnyh-uslugah-2019.pdf',
   'http://sit-salsk.ru/wp-content/uploads/2019/03/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BE-%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D1%85-%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B0%D1%85-%D0%B8-%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8-%D1%81%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2-2019.pdf'],
  ['polozhenie-o-platnyh-uslugah-2019.zip',
   'https://sit-salsk.ru/wp-content/uploads/2014/06/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BE-%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D1%85-%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B0%D1%85-%D0%B8-%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8-%D1%81%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2-2019.zip'],

  ['polozhenie-ob-okazanii-platnyh-uslug-dpp-2019.pdf',
   'http://sit-salsk.ru/wp-content/uploads/2019/03/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BE%D0%B1-%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B8-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D1%85-%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B0%D1%85-2019.pdf'],
  ['polozhenie-ob-okazanii-platnyh-uslug-dpp-2019.zip',
   'https://sit-salsk.ru/wp-content/uploads/2014/06/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BE%D0%B1-%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B8-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D1%85-%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B0%D1%85-2019.zip'],
];

let ok = 0, fail = 0;
for (const [name, url] of files) {
  const dest = join(OUT, name);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Referer': 'https://sit-salsk.ru/?p=4165' }, redirect: 'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    await writeFile(dest, buf);
    const sz = (await stat(dest)).size;
    console.log(`✓ ${name}  ${(sz/1024).toFixed(1)} KB`);
    ok++;
  } catch (e) {
    console.error(`✗ ${name}  — ${e.message}`);
    fail++;
  }
}
console.log(`\nИтого: ${ok} OK, ${fail} ошибок из ${files.length}`);
