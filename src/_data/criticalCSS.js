/**
 * Глобальные данные Eleventy: содержимое critical.css в виде строки.
 *
 * Использование в шаблоне:
 *   <style>{{ criticalCSS | safe }}</style>
 *
 * Файл `src/styles/critical.css` содержит стили первого экрана
 * (header + hero + a11y + skip-link). Подключается инлайн в <head>,
 * остальные CSS — асинхронно через preload+onload (см. base.njk § 3.4).
 */
const fs = require("node:fs");
const path = require("node:path");

const CRITICAL_CSS_PATH = path.join(__dirname, "..", "styles", "critical.css");

module.exports = function () {
  return fs.readFileSync(CRITICAL_CSS_PATH, "utf8");
};
