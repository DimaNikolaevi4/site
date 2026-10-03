---
title: Лицензии библиотек
layout: layouts/page-full.njk
permalink: /third-party-notices/
description: "Открытые библиотеки и лицензии, использованные при создании сайта"
rubric: "0"
---

# Лицензии библиотек

При создании сайта использованы библиотеки с открытым исходным кодом. Ниже указаны версии, назначение, исходный проект и лицензия каждой библиотеки.

## Библиотеки, которые входят в опубликованный сайт

| Библиотека | Версия | Назначение | Лицензия |
| --- | ---: | --- | --- |
| [Bootstrap](https://www.npmjs.com/package/bootstrap/v/5.3.8) | 5.3.8 | Сетка, компоненты и базовые UI-стили | [MIT](https://opensource.org/license/mit/) |
| [Bootstrap Icons](https://www.npmjs.com/package/bootstrap-icons/v/1.13.1) | 1.13.1 | Иконки и иконочный шрифт | [MIT](https://opensource.org/license/mit/) |
| [AOS](https://www.npmjs.com/package/aos/v/2.3.4) | 2.3.4 | Анимации появления при прокрутке | [MIT](https://opensource.org/license/mit/) |
| [GLightbox](https://www.npmjs.com/package/glightbox/v/3.3.1) | 3.3.1 | Просмотр изображений в lightbox | [MIT](https://opensource.org/license/mit/) |
| [Lunr](https://www.npmjs.com/package/lunr/v/2.3.9) | 2.3.9 | Полнотекстовый поиск по сайту | [MIT](https://opensource.org/license/mit/) |
| [lunr-languages](https://www.npmjs.com/package/lunr-languages/v/1.14.0) | 1.14.0 | Русский стеммер для поиска | [MPL-1.1](https://www.mozilla.org/en-US/MPL/1.1/) |

## Библиотеки, используемые только при сборке

Эти пакеты нужны для подготовки сайта и не копируются в опубликованный output как клиентские библиотеки.

| Библиотека | Версия | Назначение | Лицензия |
| --- | ---: | --- | --- |
| [Eleventy](https://www.npmjs.com/package/@11ty/eleventy/v/3.1.5) | 3.1.5 | Генерация статических страниц | [MIT](https://opensource.org/license/mit/) |
| [Eleventy Navigation](https://www.npmjs.com/package/@11ty/eleventy-navigation/v/0.3.5) | 0.3.5 | Данные навигации Eleventy | [MIT](https://opensource.org/license/mit/) |
| [js-yaml](https://www.npmjs.com/package/js-yaml/v/4.1.1) | 4.1.1 | Чтение YAML-данных | [MIT](https://opensource.org/license/mit/) |
| [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser/v/7.2.0) | 7.2.0 | Минификация HTML | [MIT](https://opensource.org/license/mit/) |
| [sharp](https://www.npmjs.com/package/sharp/v/0.34.5) | 0.34.5 | Генерация WebP | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) |
| [clean-css](https://www.npmjs.com/package/clean-css/v/5.3.3) | 5.3.3 | Минификация CSS | [MIT](https://opensource.org/license/mit/) |
| [puppeteer-core](https://www.npmjs.com/package/puppeteer-core/v/25.11.0) | 25.11.0 | Контрольные скриншоты baseline | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) |

## Архитектура сайта

Сайт разработан на собственной CSS-архитектуре с использованием Bootstrap 5 как CSS-фреймворка. JavaScript написан с нуля, без использования сторонних JS-фреймворков (jQuery, React, Vue и др. не используются). HTML-шаблоны написаны на Nunjucks, сборка выполняется генератором статических сайтов Eleventy.

## Тексты лицензий и notices

Публикуемые клиентские файлы сохраняют информацию о происхождении библиотек и их версиях. Полные тексты лицензий доступны по официальным ссылкам в таблицах выше. Версии зафиксированы в package-lock.json.

## Результаты аудита материалов сайта

На странице публикуется сводка внутреннего аудита V2. Полные рабочие таблицы и методика доступны в репозитории проекта. Срез выполнен в сентябре 2026 года.

### Изображения и другие ассеты

| Показатель | Результат |
| --- | ---: |
| Изображения в основном чек-листе | 140 |
| Оставлено после проверки | 138 |
| Удалено из-за неподтверждённого источника или права использования | 2 |
| Требует замены по итогам этого чек-листа | 0 |
| Ожидает проверки по итогам этого чек-листа | 0 |

Реестр происхождения содержит 179 записей, если учитывать производные форматы, включая WebP. Для материалов зафиксированы заявленный или установленный источник, статус прав и атрибуция. Удаление, замена и производные файлы отражаются в реестре отдельно.

### Текстовый контент

| Показатель | Результат |
| --- | ---: |
| Проверено файлов в src/content/ | 112 |
| Новости | 11 |
| Официальные и регламентированные сведения | 38 |
| Авторские и редакционные материалы | 63 |
| Файлы с внешними URL | 41 |
| Файлы с отдельным полем source или source_url | 17 |
| Материалы с классифицированным режимом использования без отдельного поля источника | 24 |

Для внешних текстов зафиксирован официальный источник, внутреннее происхождение, режим использования или формат «только ссылка». Дословное воспроизведение внешних редакционных материалов не используется как самостоятельное основание публикации.

### Документы

Состав документов сопоставлен с документным манифестом: проверены 428 документов, пропусков и несовпадений размеров не выявлено. Дополнительная проверка типов и расширений выполняется отдельно и фиксируется в аудиторских отчётах.

### Полные материалы аудита

- [Реестр происхождения ассетов](https://github.com/DimaNikolaevi4/site/blob/site-v2/docs/baseline/2026-09-15/ASSET_PROVENANCE_REGISTRY.md)
- [Чек-лист происхождения изображений](https://github.com/DimaNikolaevi4/site/blob/site-v2/docs/baseline/2026-09-15/ASSET_PROVENANCE_CHECKLIST.md)
- [Аудит текстового контента](https://github.com/DimaNikolaevi4/site/blob/site-v2/docs/baseline/2026-09-15/TEXT_CONTENT_AUDIT.md)
