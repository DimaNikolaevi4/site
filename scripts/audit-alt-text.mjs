#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const root = args.find((arg) => !arg.startsWith('--')) || 'public';
const writeIndex = args.indexOf('--append');
const outputPath = writeIndex >= 0 ? args[writeIndex + 1] : null;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(full);
  }
  return files;
}

function lineAt(text, offset) {
  return text.slice(0, offset).split(/\r?\n/).length;
}

function attr(tag, name) {
  const re = new RegExp('\\b' + name + '\\s*=\\s*(["\\'])([\\s\\S]*?)\\1', 'i');
  const match = tag.match(re);
  return match ? match[2].trim() : null;
}

function isInsideComment(text, offset) {
  const open = text.lastIndexOf('<!--', offset);
  const close = text.lastIndexOf('-->', offset);
  return open > close;
}

const files = await walk(root);
const findings = [];
let imageCount = 0;
for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  const re = /<img\b[\s\S]*?>/gi;
  let match;
  while ((match = re.exec(html))) {
    if (isInsideComment(html, match.index)) continue;
    imageCount += 1;
    const tag = match[0];
    const alt = attr(tag, 'alt');
    const src = attr(tag, 'src') || '(без src)';
    const location = file + ':' + lineAt(html, match.index);
    if (alt === null) findings.push({ type: 'missing-alt', location, src, recommendation: 'Добавить содержательный alt или явно обосновать декоративный элемент.' });
    else if (alt === '') findings.push({ type: 'empty-alt', location, src, recommendation: 'Оставлять alt="" только для декоративного изображения и проверить aria-hidden/контекст.' });
    else if (/^(image|img|photo|picture|рисунок|фото|dsc[_-]?\d+|\d+)$/i.test(alt)) findings.push({ type: 'generic-alt', location, src, alt, recommendation: 'Заменить техническое или слишком общее описание на фактическое.' });
  }
}

const report = [
  '## Автоматический аудит сгенерированного HTML',
  '',
  'Каталог: ' + root,
  'HTML-файлов: **' + files.length + '**',
  'активных тегов img: **' + imageCount + '**',
  'проблем: **' + findings.length + '**',
  '',
  findings.length ? '| Тип | Файл и строка | src | alt | Рекомендация |\n| --- | --- | --- | --- | --- |\n' + findings.map((item) => '| ' + item.type + ' | ' + item.location + ' | ' + item.src + ' | ' + (item.alt || '—') + ' | ' + item.recommendation + ' |').join('\n') : 'Проблемы не обнаружены.',
  '',
  '> Комментарии HTML исключаются из проверки. Скрипт не подтверждает право публикации и не заменяет смысловую сверку изображения с alt.',
  ''
].join('\n');

if (outputPath) {
  const existing = await fs.readFile(outputPath, 'utf8').catch(() => '');
  const marker = '## Автоматический аудит сгенерированного HTML';
  const before = existing.includes(marker) ? existing.slice(0, existing.indexOf(marker)).trimEnd() : existing.trimEnd();
  await fs.writeFile(outputPath, before + '\n\n' + report, 'utf8');
} else {
  process.stdout.write(report);
}

process.exitCode = findings.length ? 1 : 0;
