# V2 — отчёт фактической сборки и output-проверок

Дата: 2026-09-28  
Ветка: `site-v2`  
Исходная точка проверки: `65e0d9990b42cc637283c11dec7f336175a84fc0`

## Исправления перед повторным запуском

- В `src/_includes/layouts/svedenija-page.njk` вызов `breadcrumbsFromUrl` исправлен на применение зарегистрированного Nunjucks-фильтра.
- Удалён `src/content/pages/svedenija/employees/pedagogicheskiy-sostav-redirect.html`, который без front matter генерировал лишний служебный маршрут `/content/pages/...`.

## Команды и результаты

Перед сборкой выполнено:

```text
rm -rf public-v2
npm run build:v2
```

Результат:

- exit code: `0`;
- HTML-файлов в `public-v2`: `155`;
- всех файлов в `public-v2`: `803`;
- предупреждений `htmlmin`: `9`.

Предупреждения `htmlmin` относятся к историческому HTML-контенту с некорректной разметкой изображений. Минификатор оставляет такой HTML без минификации; страницы не исключаются из output.

После сборки выполнены:

```text
node scripts/check-v2-source-boundary.mjs
node scripts/check-unique-urls.mjs
SITE_MODE=v2 node scripts/check-expected-urls.mjs
SITE_MODE=v2 node scripts/check-v2-internal-links.mjs
node scripts/check-generated-route-shape.mjs public-v2
```

Все проверки завершились с exit code `0`:

- source boundary — `OK`;
- уникальность URL — `144`;
- ожидаемые URL — все `144` URL baseline сгенерированы;
- внутренние ссылки — `155` страниц, `20 235` ссылок, ошибок нет;
- форма маршрутов — `155` HTML-файлов и `155` уникальных URL.

Отдельная HTTP-проверка redirect-ответов, визуальное сравнение и повтор сборки в новом clone после публикации этого исправления в этот отчёт не включены.