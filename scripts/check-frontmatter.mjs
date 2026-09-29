#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content');
const REQUIRED_FIELDS = {
  news: ['title', 'layout', 'permalink', 'date'],
  section: ['title', 'layout', 'permalink'],
  static: ['title', 'layout', 'permalink'],
  category: ['title', 'layout', 'permalink'],
  document: ['title', 'layout', 'permalink'],
  material: ['title', 'layout', 'permalink'],
  redirect: ['title', 'layout', 'permalink', 'eleventyExcludeFromCollections'],
  excluded: ['title', 'layout', 'permalink', 'eleventyExcludeFromCollections']
};

const files = [];
const errors = [];
const urls = new Map();
const counts = {};

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.isFile() && file.endsWith('.md')) files.push(file);
  }
}

function classify(relative, data) {
  const parts = relative.split(path.sep);
  if (data.layout === false) return 'redirect';
  if (data.permalink === false) return 'excluded';
  if (parts[0] === 'news') return 'news';
  if (parts[0] === 'documents') return 'document';
  if (parts[0] === 'legacy-redirects') return 'redirect';
  if (parts[0] === 'categories' && path.basename(relative) === 'index.md') return 'category';
  if (parts[0] === 'pages') return 'static';
  if (path.basename(relative) === 'index.md') return 'section';
  return 'material';
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isDate(value) {
  return value instanceof Date || (typeof value === 'string' && !Number.isNaN(Date.parse(value)));
}

function addError(file, message) {
  errors.push(file + ': ' + message);
}

await walk(CONTENT_ROOT);
files.sort();

for (const file of files) {
  const relative = path.relative(CONTENT_ROOT, file).split(path.sep).join('/');
  const text = await fs.readFile(file, 'utf8');
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    addError(relative, 'отсутствует YAML front matter в начале файла');
    continue;
  }

  let data;
  try {
    data = yaml.load(match[1]);
  } catch (error) {
    addError(relative, 'YAML не разбирается: ' + error.message.split('\n')[0]);
    continue;
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    addError(relative, 'front matter должен быть объектом');
    continue;
  }

  const type = classify(relative, data);
  counts[type] = (counts[type] || 0) + 1;

  for (const field of REQUIRED_FIELDS[type]) {
    if (!(field in data)) addError(relative, 'отсутствует обязательное поле ' + field + ' для типа ' + type);
  }

  if (!isNonEmptyString(data.title)) addError(relative, 'title должен быть непустой строкой');

  if (type === 'redirect') {
    if (data.layout !== false) addError(relative, 'для redirect layout должен быть false');
  } else if (!isNonEmptyString(data.layout)) {
    addError(relative, 'layout должен быть непустой строкой');
  }

  if (data.permalink === false) {
    if (type !== 'excluded' || data.eleventyExcludeFromCollections !== true) {
      addError(relative, 'permalink: false допускается только для исключённого файла');
    }
  } else if (typeof data.permalink !== 'string' || !data.permalink.startsWith('/') || !data.permalink.endsWith('/')) {
    addError(relative, 'permalink должен быть строкой, начинающейся и заканчивающейся /');
  } else {
    if (!urls.has(data.permalink)) urls.set(data.permalink, []);
    urls.get(data.permalink).push(relative);
  }

  if (type === 'news' && !isDate(data.date)) addError(relative, 'date новости должен быть датой');

  if ('eleventyExcludeFromCollections' in data && typeof data.eleventyExcludeFromCollections !== 'boolean') {
    addError(relative, 'eleventyExcludeFromCollections должен быть boolean');
  }

  for (const field of ['rubric', 'category', 'description', 'source_url', 'image', 'excerpt', 'relatedCollection']) {
    if (field in data && data[field] !== null && !isNonEmptyString(data[field])) {
      addError(relative, field + ' должен быть строкой или null');
    }
  }

  if ('tags' in data && data.tags !== null && (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string'))) {
    addError(relative, 'tags должен быть массивом строк');
  }

  if ('breadcrumbs' in data && data.breadcrumbs !== null && !Array.isArray(data.breadcrumbs)) {
    addError(relative, 'breadcrumbs должен быть массивом');
  }

  if ('attachments' in data && data.attachments !== null && !Array.isArray(data.attachments)) {
    addError(relative, 'attachments должен быть массивом или null');
  }

  for (const field of ['showHero', 'excludeFromSitemap', 'suppressSubrubrics']) {
    if (field in data && typeof data[field] !== 'boolean') addError(relative, field + ' должен быть boolean');
  }

  if ('relatedCount' in data && data.relatedCount !== null && typeof data.relatedCount !== 'number') {
    addError(relative, 'relatedCount должен быть числом или null');
  }

  if ('eleventyNavigation' in data && data.eleventyNavigation !== null && (typeof data.eleventyNavigation !== 'object' || Array.isArray(data.eleventyNavigation))) {
    addError(relative, 'eleventyNavigation должен быть объектом');
  }
}

for (const [url, owners] of urls) {
  if (owners.length > 1) addError('permalink', 'дубликат ' + url + ': ' + owners.join(', '));
}

if (errors.length) {
  console.error('[frontmatter] FAIL — ошибок: ' + errors.length);
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  const summary = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([type, count]) => type + ': ' + count).join(', ');
  console.log('[frontmatter] OK — проверено файлов: ' + files.length + '; типы: ' + summary);
}
