# V2: проверка sitemap.xml и robots.txt

- Дата проверки: 2026-09-24.
- Ветка: `site-v2`.
- Проверяемый commit: `56209914a565e6cbd73431382fe97a5b08aa5511`.
- Команда сборки: `npm ci --ignore-scripts && npm run build:v2`.
- Окружение: Node.js 18.20.8, Eleventy 3.1.5.

## sitemap.xml

- Файл создан сборкой: `public-v2/sitemap.xml`.
- XML разобран без ошибок; корневой элемент — `urlset` с namespace Sitemap 0.9.
- Найдено URL: 141.
- Уникальных URL: 141; дубликатов нет.
- Все `loc` — абсолютные HTTPS URL на домене `сит-сальск.рф`.
- Пример: `https://сит-сальск.рф/obshestvennoe-mnenie/anketa-vypusknika/`.

## robots.txt

- Файл создан сборкой: `public-v2/robots.txt`.
- Присутствует `Allow: /` для общего User-agent.
- Присутствует `Sitemap: /sitemap.xml`.
- Проверены запреты для `/admin/`, `/thank-you/`, `/404.html`, query-string URL и временных файлов.
- Отдельные правила для Yandex, Googlebot и Bingbot синтаксически присутствуют.

## Ограничение проверки

Проверен сгенерированный V2-output локальной сборки. HTTP-доступность опубликованных `/sitemap.xml` и `/robots.txt` на рабочем домене этим отчётом не подтверждается; это отдельная внешняя проверка.
