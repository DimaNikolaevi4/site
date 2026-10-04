# Лицензии, назначение и подключение npm-зависимостей V2

> Дата проверки: 15.09.2026
> Ветка: site-v2
> Источник полей license/version: манифесты соответствующих версий в npm registry.

| Пакет | Версия | Лицензия | Назначение и путь подключения |
| --- | ---: | --- | --- |
| @11ty/eleventy | 3.1.5 | MIT | движок; CLI в package.json scripts.build/dev |
| @11ty/eleventy-navigation | 0.3.5 | MIT | плагин; require в .eleventy.js |
| js-yaml | 4.1.1 | MIT | YAML rubrics; require в .eleventy.js |
| lunr | 2.3.9 | MIT | индекс поиска; require в .eleventy.js и assets/vendor/lunr/lunr.min.js |
| lunr-languages | 1.14.0 | MPL-1.1 | русский stemmer; assets/vendor/lunr/lunr.stemmer.support.js и lunr.ru.js |
| html-minifier-terser | 7.2.0 | MIT | минификация HTML; require в .eleventy.js |
| sharp | 0.34.5 | Apache-2.0 | генерация WebP; scripts/generate-webp.mjs |
| clean-css | 5.3.3 | MIT | минификация CSS; scripts/minify-css.mjs |
| bootstrap | 5.3.8 | MIT | CSS/JS framework; assets/vendor/bootstrap/** |
| bootstrap-icons | 1.13.1 | MIT | CSS и шрифты иконок; assets/vendor/bootstrap-icons/** |
| aos | 2.3.4 | MIT | scroll-анимации; assets/vendor/aos/** и src/assets/js/init-components.js |
| glightbox | 3.3.1 | MIT | lightbox; assets/vendor/glightbox/** и base.njk |
| puppeteer-core | 25.11.0 | Apache-2.0 | только baseline screenshots; scripts/capture-baseline-screenshots.mjs, в обычный output не попадает |

## Публичное размещение

Для посетителей сайта опубликована страница `/third-party-notices/` со списком клиентских и сборочных библиотек, версиями и ссылками на тексты лицензий. Ссылка добавлена в общий футер.

## Вывод

Все 13 прямых пакетов из package.json имеют зафиксированные версии и описанное назначение. Наличие license-поля в npm metadata не заменяет проверку notices и текстов лицензий в пункте 2.2.5. Решение об удалении неиспользуемых vendor-библиотек выполняется в пункте 2.2.3.