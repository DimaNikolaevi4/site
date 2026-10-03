# Чеклист: Полное удаление следов шаблона Mentor / BootstrapMade

> **Цель:** Переименовать все CSS-классы и HTML-классы, унаследованные от шаблона Mentor (BootstrapMade), на собственные. После выполнения чеклиста сайт не должен содержать ни одного класса, типичного для шаблона Mentor.

> **Дата создания:** 3 октября 2026
> **Ветка:** site-v2

---

## Этап 1. Аудит — какие классы от Mentor остаются

### 1.1 Классы, точно происходящие от Mentor

| Класс Mentor | Где используется | Новый класс | Статус |
|---|---|---|---|
| `.course-item` | news.njk (до унификации), CSS | ~~уже заменён на `.card`~~ | ✅ Готово |
| `.course-content` | news.njk (до унификации), CSS | ~~уже заменён на `.card-content`~~ | ✅ Готово |
| `.trainer` | news.njk (до унификации), CSS | ~~уже заменён на `.card-content > .read-more`~~ | ✅ Готово |
| `.trainer-profile` | news.njk (до унификации), CSS | ~~уже не используется в HTML~~ | ⬜ Удалить из CSS |
| `.trainer-link` | CSS | ~~уже не используется в HTML~~ | ⬜ Удалить из CSS |
| `.btn-get-started` | news.njk, page-full.njk, CSS | `.btn-primary-outline` или оставить (Bootstrap-совместимый) | ⬜ Заменить |
| `.scroll-top` | base.njk, CSS | `.sit-scroll-top` | ⬜ Заменить |
| `.section-title` | все шаблоны, CSS | `.sit-section-title` | ⬜ Заменить |
| `.section` | base.njk, CSS | `.sit-section` | ⬜ Заменить |
| `.courses` | CSS (мертвый класс) | — | ⬜ Удалить |

### 1.2 Классы, возможно происходящие от Mentor (общие с Bootstrap)

| Класс | Риск | Решение |
|---|---|---|
| `.breadcrumbs` | Общий паттерн, не уникален для Mentor | Оставить |
| `.breadcrumb-item` | Общий паттерн | Оставить |
| `.about`, `.about-*` | Общий паттерн | Оставить |
| `.header`, `.header-*` | Уже переименовано в `site-header__*` | ✅ Готово |
| `.footer-*` | Уже переименовано в `site-footer__*` | ✅ Готово |
| `.content` | Общий паттерн | Оставить |
| `.sidebar` | Общий паттерн | Оставить |
| `.gallery` | Общий паттерн | Оставить |

### 1.3 Мёртвые классы (в CSS, но не в HTML)

| Класс | Действие |
|---|---|
| `.courses` | Удалить из CSS |
| `.trainer` | Удалить из CSS |
| `.trainer-profile` | Удалить из CSS |
| `.trainer-link` | Удалить из CSS |
| `.course-item` | Удалить из CSS (если остался) |
| `.course-content` | Удалить из CSS (если остался) |
| `.description` (в `.course-content .description`) | Удалить из CSS |

---

## Этап 2. Замена активных классов

### 2.1 `.btn-get-started` → `.btn-outline-accent`

**Файлы для замены:**
- [ ] `src/_includes/components/news.njk` — кнопка «Все новости»
- [ ] `src/_includes/layouts/page-full.njk` — кнопка «Назад»
- [ ] `src/content/pages/studentam-i-roditeljam/raspisanie.md` — кнопка «Назад к расписанию»
- [ ] `src/content/pages/studentam-i-roditeljam/raspisanie/1-korpus.md` — кнопка «Назад»
- [ ] `src/content/pages/studentam-i-roditeljam/raspisanie/2-korpus.md` — кнопка «Назад»
- [ ] `src/styles/main.css` — правило `.btn-get-started`
- [ ] `src/styles/critical.css` — если есть

### 2.2 `.scroll-top` → `.sit-scroll-top`

**Файлы для замены:**
- [ ] `src/_includes/layouts/base.njk` — кнопка «Наверх»
- [ ] `src/assets/js/main.js` — JS-инициализация
- [ ] `src/styles/main.css` — правило `.scroll-top`

### 2.3 `.section-title` → `.sit-section-title`

**Файлы для замены:**
- [ ] `src/_includes/components/news.njk`
- [ ] `src/_includes/components/popular.njk`
- [ ] `src/_includes/components/about.njk`
- [ ] `src/_includes/layouts/base.njk`
- [ ] `src/styles/main.css` — все правила с `.section-title`
- [ ] `src/styles/critical.css` — если есть

### 2.4 `.section` → оставить (Bootstrap-совместимый)

Класс `.section` используется слишком широко и не является уникальным для Mentor. Оставляем.

---

## Этап 3. Удаление мёртвых CSS-правил

### 3.1 Удалить из main.css

- [ ] `.courses { ... }` — мёртвый класс
- [ ] `.course-item { ... }` — если остался, удалить
- [ ] `.course-content { ... }` — если остался, удалить
- [ ] `.course-content h3, .course-content h4 { ... }` — мёртвое
- [ ] `.course-content h3 a, .course-content h4 a { ... }` — мёртвое
- [ ] `.course-content .description { ... }` — мёртвое
- [ ] `.course-item .trainer { ... }` — мёртвое
- [ ] `.course-item .trainer-profile { ... }` — мёртвое
- [ ] `.course-item .trainer-profile img { ... }` — мёртвое
- [ ] `.course-item .trainer-profile .trainer-link { ... }` — мёртвое
- [ ] `.course-item .trainer-profile .trainer-link:hover { ... }` — мёртвое
- [ ] `.trainer` — любое упоминание, удалить
- [ ] `.trainer-profile` — любое упоминание, удалить
- [ ] `.trainer-link` — любое упоминание, удалить

### 3.2 Проверить .description

- [ ] `.course-content .description` — удалить (заменено на `.card-excerpt`)
- [ ] Проверить, не используется ли `.description` где-то ещё в HTML

---

## Этап 4. Проверка JS

### 4.1 Проверить main.js

- [ ] Нет упоминаний `mentor`, `Mentor`, `BootstrapMade`
- [ ] Нет упоминаний `.course-item`, `.trainer`, `.btn-get-started`
- [ ] Селекторы в JS используют только наши классы (`.card`, `.read-more`, `.sit-*`)

### 4.2 Проверить другие JS-файлы

- [ ] `src/assets/js/init-components.js`
- [ ] `src/assets/js/offcanvas-nav.js`
- [ ] `src/assets/js/search-modal.js`
- [ ] `src/assets/js/search.js`

---

## Этап 5. Финальная проверка

### 5.1 grep по репозиторию

- [ ] `grep -rniE "mentor" src/` → 0 совпадений
- [ ] `grep -rniE "bootstrapmade" src/` → 0 совпадений
- [ ] `grep -rnE "\.course-item" src/styles/` → 0 совпадений
- [ ] `grep -rnE "\.trainer" src/styles/` → 0 совпадений
- [ ] `grep -rnE "\.btn-get-started" src/` → 0 совпадений
- [ ] `grep -rnE "\.scroll-top" src/` → 0 совпадений (заменено на `.sit-scroll-top`)
- [ ] `grep -rnE "\.section-title" src/` → 0 совпадений (заменено на `.sit-section-title`)

### 5.2 Сборка и проверки

- [ ] `npm run build:v2` — без ошибок
- [ ] `npm run check:links:v2` — OK
- [ ] `npm run check:urls:generated:v2` — OK
- [ ] `npm run check:route-shape:v2` — OK
- [ ] `npm run check:frontmatter` — OK

### 5.3 Визуальная проверка

- [ ] Главная страница — hero, новости, популярное, footer
- [ ] /news/ — карточки новостей
- [ ] /news/page/2/ — пагинация
- [ ] /studentam-i-roditeljam/raspisanie/ — кнопки расписания
- [ ] /studentam-i-roditeljam/raspisanie/1-korpus/ — таблица расписания
- [ ] Кнопка «Наверх» работает
- [ ] Кнопка «Все новости» работает
- [ ] Кнопки «Назад» работают

---

## Этап 6. Обновление third-party-notices

### 6.1 Удалить упоминание шаблона Mentor (если было)

- [ ] Проверить `src/content/pages/third-party-notices.md` — нет упоминаний Mentor / BootstrapMade
- [ ] Если есть — удалить

### 6.2 Добавить примечание

- [ ] Добавить примечание: «Сайт разработан на собственной CSS-архитектуре с использованием Bootstrap 5 как CSS-фреймворка»

---

## Итог

После выполнения всех пунктов:
- ✅ Ни одного CSS-класса от Mentor не остаётся
- ✅ Ни одного упоминания "mentor" или "BootstrapMade" в коде
- ✅ Сайт полностью оригинальный — претензий по лицензии шаблона нет
- ✅ `/third-party-notices/` корректно описывает только фактически используемые библиотеки
