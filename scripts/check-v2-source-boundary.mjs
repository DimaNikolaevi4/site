#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(ROOT, '.eleventy.js');
const minifyPath = path.join(ROOT, 'scripts', 'minify-css.mjs');
const gitignorePath = path.join(ROOT, '.gitignore');
const config = fs.readFileSync(configPath, 'utf8');
const minify = fs.readFileSync(minifyPath, 'utf8');
const gitignore = fs.readFileSync(gitignorePath, 'utf8');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(/v2:\s*Object\.freeze\(\{\s*output:\s*['"]public-v2['"]/.test(config),
  'BUILD_MODES.v2 должен выводить в public-v2');
assert(/input:\s*['"]src['"]/.test(config),
  'Eleventy должен использовать src как единственный input');
assert(/output:\s*outputDirectory/.test(config),
  'Eleventy output должен зависеть от SITE_MODE');
assert(/v2:\s*['"]public-v2['"]/.test(minify),
  'CSS-минификатор должен выбирать public-v2 для SITE_MODE=v2');
assert(/(^|\n)public-v2\/?($|\n)/.test(gitignore),
  'public-v2/ должен быть исключён из Git как генерируемый output');

const passthroughCalls = [...config.matchAll(/addPassthroughCopy\(([^;]+)\);/g)];
for (const match of passthroughCalls) {
  const argument = match[1];
  const sources = [...argument.matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
  const source = sources[0];
  if (!source) continue;
  assert(source.startsWith('src/') || source.startsWith('node_modules/'),
    'passthrough-источник вне src/node_modules: ' + source);
  assert(!/^public(?:-v2)?(?:\/|$)/.test(source),
    'passthrough не должен читать старый output: ' + source);
}

const directOutputReads = [...config.matchAll(/path\.join\(__dirname,\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
for (const source of directOutputReads) {
  assert(source !== 'public' && source !== 'public-v2',
    'прямое чтение output вне outputDirectory: ' + source);
}

if (failures.length) {
  console.error('[v2-source-boundary] FAIL');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log('[v2-source-boundary] OK — V2 читает исходники из src/node_modules, output выбирается через SITE_MODE');
