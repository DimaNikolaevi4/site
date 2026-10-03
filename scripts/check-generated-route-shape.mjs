#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.resolve(ROOT, process.argv[2] || 'public-v2');

if (!fs.existsSync(outputDirectory) || !fs.statSync(outputDirectory).isDirectory()) {
  console.error('[generated-route-shape] output не найден: ' + path.relative(ROOT, outputDirectory));
  console.error('[generated-route-shape] сначала выполните сборку нужного режима');
  process.exit(2);
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      htmlFiles.push(absolutePath);
    }
  }
}
walk(outputDirectory);

const failures = [];
const urls = new Map();
for (const absolutePath of htmlFiles) {
  const relativeFile = path.relative(outputDirectory, absolutePath).split(path.sep).join('/');
  const isDirectoryIndex = relativeFile === 'index.html' || relativeFile.endsWith('/index.html');
  const url = relativeFile === 'index.html'
    ? '/'
    : relativeFile.endsWith('/index.html')
      ? '/' + relativeFile.slice(0, -'index.html'.length)
      : '/' + relativeFile;

  if (relativeFile.endsWith('/index.html') && !url.endsWith('/')) {
    failures.push(relativeFile + ': каталожный URL не заканчивается на / (' + url + ')');
  }
  if (url.includes('/index.html')) {
    failures.push(relativeFile + ': index.html опубликован в URL (' + url + ')');
  }
  if (!isDirectoryIndex && url.endsWith('/')) {
    failures.push(relativeFile + ': URL файла ошибочно заканчивается на / (' + url + ')');
  }

  if (!urls.has(url)) urls.set(url, []);
  urls.get(url).push(relativeFile);
}

for (const [url, files] of urls) {
  if (files.length > 1) failures.push('дублирующийся URL ' + url + ': ' + files.join(', '));
}

if (!fs.existsSync(path.join(outputDirectory, 'index.html'))) {
  failures.push('не найден корневой index.html для URL /');
}
if (!fs.existsSync(path.join(outputDirectory, '404.html'))) {
  failures.push('не найден файл 404.html');
}

if (failures.length) {
  console.error('[generated-route-shape] FAIL — ' + path.relative(ROOT, outputDirectory));
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(
  '[generated-route-shape] OK — HTML-файлов: ' + htmlFiles.length +
  '; уникальных URL: ' + urls.size +
  '; index.html не входит в URL, каталожные URL заканчиваются на / (' +
  path.relative(ROOT, outputDirectory) + ')'
);