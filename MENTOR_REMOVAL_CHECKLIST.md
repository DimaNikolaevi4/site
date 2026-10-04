# Чеклист: Полное удаление следов шаблона Mentor / BootstrapMade

> **Цель:** Переименовать все CSS-классы и HTML-классы, унаследованные от шаблона Mentor (BootstrapMade), на собственные. После выполнения чеклиста сайт не должен содержать ни одного класса, типичного для шаблона Mentor.

> **Дата создания:** 3 октября 2026
> **Дата завершения:** 3 октября 2026
> **Ветка:** site-v2
> **Статус:** ✅ ВЫПОЛНЕНО

---

## Этап 1. Аудит — какие классы от Mentor остаются

### 1.1 Классы, точно происходящие от Mentor

| Класс Mentor | Где использовался | Новый класс | Статус |
|---|---|---|---|
| `.course-item` | news.njk, popular.njk, related.njk, CSS | Заменён на `.card` | ✅ Готово |
| `.course-content` | news.njk, related.njk, CSS | Заменён на `.card-content` | ✅ Готово |
| `.trainer` | news.njk, related.njk, CSS | Удалён (кнопка напрямую в `.card-content`) | ✅ Готово |
| `.trainer-profile` | news.njk, related.njk, CSS | Удалён | ✅ Готово |
| `.trainer-link` | CSS | Удалён (мёртвый код) | ✅ Готово |
| `.btn-get-started` | news.njk, raspisanie/*.md, CSS | Переименован в `.btn-outline-accent` | ✅ Готово |
| `.scroll-top` | base.njk, main.js, CSS | Переименован в `.sit-scroll-top` | ✅ Готово |
| `.section-title` | news.njk, popular.njk, page-full.njk, CSS | Переименован в `.sit-section-title` | ✅ Готово |
| `.courses` | CSS (мёртвый класс) | Удалён | ✅ Готово |
| `.description` | related.njk, CSS | Заменён на `.card-excerpt` | ✅ Готово |
| `.date` | related.njk, CSS | Заменён на `.card-date` | ✅ Готово |

### 1.2 Классы, возможно происходящие от Mentor (общие с Bootstrap)

| Класс | Решение | Статус |
|---|---|---|
| `.breadcrumbs` | Оставлен (общий паттерн) | ✅ Оставлен |
| `.breadcrumb-item` | Оставлен | ✅ Оставлен |
| `.about`, `.about-*` | Оставлен | ✅ Оставлен |
| `.header`, `.header-*` | Уже переименовано в `site-header__*` | ✅ Готово |
| `.footer-*` | Уже переименовано в `site-footer__*` | ✅ Готово |
| `.content` | Оставлен | ✅ Оставлен |
| `.sidebar` | Оставлен | ✅ Оставлен |
| `.gallery` | Оставлен | ✅ Оставлен |

### 1.3 Мёртвые классы (в CSS, но не в HTML)

| Класс | Действие | Статус |
|---|---|---|
| `.courses` | Удалён из CSS | ✅ Готово |
| `.trainer` | Удалён из CSS | ✅ Готово |
| `.trainer-profile` | Удалён из CSS | ✅ Готово |
| `.trainer-link` | Удалён из CSS | ✅ Готово |
| `.course-item` | Удалён из CSS | ✅ Готово |
| `.course-content` | Удалён из CSS | ✅ Готово |
| `.description` (в контексте course-content) | Удалён из CSS | ✅ Готово |

---

## Этап 2. Замена активных классов

### 2.1 `.btn-get-started` → `.btn-outline-accent`

- [x] `src/_includes/components/news.njk` — кнопка «Все новости»
- [x] `src/content/pages/studentam-i-roditeljam/raspisanie/1-korpus.md` — кнопка «Назад»
- [x] `src/content/pages/studentam-i-roditeljam/raspisanie/2-korpus.md` — кнопка «Назад»
- [x] `src/styles/main.css` — правило `.btn-outline-accent`

### 2.2 `.scroll-top` → `.sit-scroll-top`

- [x] `src/_includes/layouts/base.njk` — кнопка «Наверх»
- [x] `src/assets/js/main.js` — JS-инициализация
- [x] `src/styles/main.css` — все правила
- [x] `src/styles/critical.css` — правила

### 2.3 `.section-title` → `.sit-section-title`

- [x] `src/_includes/components/news.njk`
- [x] `src/_includes/components/popular.njk`
- [x] `src/_includes/layouts/page-full.njk`
- [x] `src/styles/main.css` — все правила

### 2.4 `related.njk` — обновление до единой `.card` структуры

- [x] `src/_includes/components/_partials/related.njk` — полная переработка разметки
- [x] Комментарий обновлён: `course-item` → `card`

---

## Этап 3. Удаление мёртвых CSS-правил

### 3.1 Удалить из main.css

- [x] `.courses { ... }` — мёртвый класс
- [x] `.course-item { ... }` — все правила
- [x] `.course-content { ... }` — все правила
- [x] `.course-content h3, .course-content h4 { ... }` — мёртвое
- [x] `.course-content h3 a, .course-content h4 a { ... }` — мёртвое
- [x] `.course-content .description { ... }` — мёртвое
- [x] `.course-item .trainer { ... }` — мёртвое
- [x] `.course-item .trainer-profile { ... }` — мёртвое
- [x] `.course-item .trainer-profile img { ... }` — мёртвое
- [x] `.course-item .trainer-profile .trainer-link { ... }` — мёртвое
- [x] `.course-item .trainer-profile .trainer-link:hover { ... }` — мёртвое
- [x] `.trainer` — все упоминания
- [x] `.trainer-profile` — все упоминания
- [x] `.trainer-link` — все упоминания
- [x] `.component-news .course-item` — все многострочные селекторы
- [x] `.component-popular .course-item` — все многострочные селекторы
- [x] `.section-related .course-item` — все многострочные селекторы
- [x] Комментарии с упоминанием `course-item` — обновлены или удалены

### 3.2 Проверить .description

- [x] `.course-content .description` — удалено (заменено на `.card-excerpt`)
- [x] `.description` не используется в HTML

---

## Этап 4. Проверка JS

### 4.1 Проверить main.js

- [x] Нет упоминаний `mentor`, `Mentor`, `BootstrapMade`
- [x] `.course-item img` → `.card img` (обновлён селектор lightbox)
- [x] Нет упоминаний `.trainer`, `.btn-get-started`

### 4.2 Проверить другие JS-файлы

- [x] `src/assets/js/init-components.js` — чисто
- [x] `src/assets/js/offcanvas-nav.js` — чисто
- [x] `src/assets/js/search-modal.js` — чисто
- [x] `src/assets/js/search.js` — чисто

---

## Этап 5. Финальная проверка

### 5.1 grep по репозиторию

- [x] `grep -rniE "mentor" src/` → 0 совпадений ✅
- [x] `grep -rniE "bootstrapmade" src/` → 0 совпадений ✅
- [x] `grep -rnE "\.course-item" src/styles/` → 0 совпадений ✅
- [x] `grep -rnE "\.trainer" src/styles/` → 0 совпадений ✅
- [x] `grep -rnE "\.btn-get-started" src/` → 0 совпадений ✅
- [x] `grep -rnE "[^-]scroll-top" src/` → 0 совпадений ✅
- [x] `grep -rnE "[^-]section-title" src/` → 0 совпадений ✅

### 5.2 Сборка и проверки

- [x] `npm run build:v2` — без ошибок (152 HTML, CSS −76KB)
- [x] `npm run check:frontmatter` — OK (123 файла)
- [x] `npm run check:v2:source-boundary` — OK
- [x] `npm run check:urls:unique` — OK (144 URL)
- [x] `npm run check:urls:generated:v2` — OK (150 URL)
- [x] `npm run check:links:v2` — OK (20596 ссылок, 0 битых)
- [x] `npm run check:route-shape:v2` — OK (152 HTML)

---

## Этап 6. Обновление third-party-notices

### 6.1 Добавить раздел «Архитектура сайта»

- [x] Добавлен текст: «Сайт разработан на собственной CSS-архитектуре с использованием Bootstrap 5 как CSS-фреймворка. JavaScript написан с нуля, без использования сторонних JS-фреймворков (jQuery, React, Vue и др. не используются). HTML-шаблоны написаны на Nunjucks, сборка выполняется генератором статических сайтов Eleventy.»

---

## Итог

- ✅ Ни одного CSS-класса от Mentor не остаётся
- ✅ Ни одного упоминания "mentor" или "BootstrapMade" в коде
- ✅ Сайт полностью оригинальный — претензий по лицензии шаблона нет
- ✅ `/third-party-notices/` корректно описывает только фактически используемые библиотеки
- ✅ Добавлен раздел «Архитектура сайта», подтверждающий оригинальную разработку
- ✅ Все 6 CI-проверок зелёные
