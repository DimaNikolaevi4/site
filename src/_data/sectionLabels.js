const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadYaml(file) {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) return null;
  try {
    return yaml.load(fs.readFileSync(p, "utf8"));
  } catch (e) {
    console.warn(`[sectionLabels] не удалось прочитать ${file}:`, e.message);
    return null;
  }
}

function normalizeUrl(url) {
  if (!url) return null;
  if (url.startsWith("#") || url.includes("#")) {
    url = url.split("#")[0];
  }
  if (!url) return null;
  if (!url.startsWith("/")) url = "/" + url;
  if (!url.endsWith("/")) url = url + "/";
  return url;
}

function addItem(byUrl, bySlug, item, parentUrl) {
  if (!item || !item.title) return;

  let url = item.url ? normalizeUrl(item.url) : null;
  if (!url && parentUrl && (item.slug || item.key)) {
    url = parentUrl + (item.slug || item.key) + "/";
  }
  if (url) {
    if (!byUrl[url]) byUrl[url] = item.title;
  }
  if (item.slug && !bySlug[item.slug]) bySlug[item.slug] = item.title;
  if (item.key && !bySlug[item.key]) bySlug[item.key] = item.title;

  if (Array.isArray(item.children)) {
    const base = url || parentUrl;
    item.children.forEach((c) => addItem(byUrl, bySlug, c, base));
  }
}

const byUrl = {};
const bySlug = {};

const menu = loadYaml("menu.yaml");
if (menu && Array.isArray(menu.main)) {
  menu.main.forEach((item) => addItem(byUrl, bySlug, item, "/"));
}

const svedenijaMenu = loadYaml("svedenijaMenu.yaml");
if (Array.isArray(svedenijaMenu)) {
  svedenijaMenu.forEach((item) => addItem(byUrl, bySlug, item, "/svedenija/"));
}

const rubrics = loadYaml("rubrics.yaml");
if (rubrics && Array.isArray(rubrics.main_rubrics)) {
  rubrics.main_rubrics.forEach((r) => addItem(byUrl, bySlug, r, "/"));
}

const overrides = {
  "/": "Главная",
  "/news/": "Новости",
  "/contacts/": "Контакты",
  "/about/": "О техникуме",
  "/svedenija/": "Сведения об образовательной организации",
  "/abiturientam/": "Абитуриентам",
  "/vospitanie/": "Воспитание",
  "/sotrudnichestvo/": "Сотрудничество",
  "/bezopasnost/": "Безопасность",
  "/studentam-i-roditeljam/": "Студентам и родителям",
  "/uchebno-metodicheskaja-rabota/": "Учебно-методическая работа",
  "/career/": "Центр Карьеры",
  "/professionaly-2026/": "Профессионалы-2026",
  "/documents/": "Документы",
  "/search/": "Поиск",
  "/tags/": "Теги",
};
Object.assign(byUrl, overrides);

module.exports = { byUrl, bySlug };
