# V2: проверка canonical и Open Graph

- Дата проверки: 2026-09-24.
- Ветка: `site-v2`.
- Проверяемый commit исходников: `d195f10b63592aa9f929f288a21e35c82a2fa3b2`.
- Команды: `npm ci --ignore-scripts`, затем `npm run build:v2`.
- Окружение: Node.js 18.20.8, Eleventy 3.1.5.

## Результат

- Собрано 145 HTML-файлов.
- Проверено 144 публичных HTML-файла.
- `/admin/index.html` исключён из проверки: это служебная CMS-панель, а не публичная страница сайта.
- На каждой проверенной странице присутствуют `og:title`, `og:description`, `og:url`, `og:type`, `og:image` и canonical.
- Все canonical, `og:url` и `og:image` — абсолютные HTTPS URL.
- `og:url` совпадает с canonical на всех проверенных страницах.
- Все OG-изображения существуют в V2-output; отсутствующих файлов нет.
- Общий fallback `/assets/images/og-image.png` — PNG 1200×630, пригодный для крупного превью VK.
- После обнаружения относительного canonical в redirect-странице он заменён на абсолютные HTTPS metadata; redirect сохраняет `noindex,follow`.

## Проверенный шаблон

Основные metadata генерируются в `src/_includes/layouts/base.njk`. Отдельный redirect-шаблон проверен после исправления: `src/content/pages/svedenija/employees/pedagogicheskiy-sostav-redirect.html`.

## Ограничение проверки

Проверен локально сгенерированный V2-output. Фактический внешний fetch/preview рабочим сервисом VK и HTTP-доступность опубликованных страниц не проверялись; для этого нужен отдельный внешний или тестовый деплой.
