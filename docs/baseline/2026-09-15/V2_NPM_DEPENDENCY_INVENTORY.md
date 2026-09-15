# Инвентарь npm-зависимостей V2

> Дата: 15.09.2026
> Ветка: site-v2

## Методика

Проверены package.json, package-lock.json, .eleventy.js, основной layout base.njk, init-components.js и build-скрипты. В список включены зависимости, которые участвуют в обычной команде npm run build или чьи файлы копируются/подключаются в V2 output.

## Зависимости, участвующие в V2

| Пакет | Зафиксированная версия | Роль в V2 | Признак использования |
| --- | ---: | --- | --- |
| @11ty/eleventy | 3.1.5 | движок сборки | CLI в npm run build/dev |
| @11ty/eleventy-navigation | 0.3.5 | навигационные данные Eleventy | require в .eleventy.js |
| js-yaml | 4.1.1 | чтение rubrics.yaml | require в .eleventy.js |
| lunr | 2.3.9 | индекс и фильтрация поиска | require в .eleventy.js; JS в output |
| lunr-languages | 1.14.0 | русский stemmer для поиска | JS-файлы в output |
| html-minifier-terser | 7.2.0 | минификация HTML в build-режиме | require в .eleventy.js |
| sharp | 0.34.5 | генерация WebP из растровых исходников | scripts/generate-webp.mjs |
| clean-css | 5.3.3 | минификация CSS после сборки | scripts/minify-css.mjs |
| bootstrap | 5.3.8 | CSS/JS framework | assets/vendor/bootstrap/** |
| bootstrap-icons | 1.13.1 | иконки и шрифты | assets/vendor/bootstrap-icons/** |
| aos | 2.3.4 | scroll-анимации | assets/vendor/aos/**; init-components.js |
| glightbox | 3.3.1 | lightbox | assets/vendor/glightbox/**; base.njk |
| swiper | 12.1.3 | слайдеры | assets/vendor/swiper/**; init-components.js |
| @srexi/purecounterjs | 1.5.0 | счётчики | assets/vendor/purecounter/**; base.njk |

## Установлена, но не входит в обычный V2 output

- puppeteer-core 25.11.0 — используется scripts/capture-baseline-screenshots.mjs для контрольных скриншотов; не импортируется обычной командой npm run build и не копируется в output.

## Ограничение отчёта

Этот отчёт фиксирует фактическое участие пакетов в сборке и output. Лицензии, назначение каждой зависимости и решение об удалении неиспользуемых vendor-файлов проверяются отдельными пунктами 2.2.2–2.2.3.