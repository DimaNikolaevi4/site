# Минимальная сборка сайта техникума

Это стартовый шаблон для сайта ГБПОУ РО "Сальский индустриальный техникум" на базе Eleventy.

## 📁 Структура проекта

```
src/
├── _data/              # Глобальные данные: site, menu, svedenijaMenu, contacts,
│                       # rubrics, social, sectionLabels.js (агрегатор меток)
├── _filters/           # Пользовательские фильтры Nunjucks (dateRu, slugify, truncate, lunr-index)
├── _includes/          # Шаблоны и компоненты
│   ├── base.njk        # Базовый макет (head, header, main, footer)
│   ├── components/     # 8 компонентов секций (порядок канона §3.0.1):
│   │                   # 1 header, 2 hero, 3 breadcrumbs, 4 about,
│   │                   # 5 news, 6 popular, 7 sidebar, 8 footer
│   │                   # + _partials/ (card, pagination, share, related, anti-corruption-content)
│   ├── layouts/        # base.njk, page.njk (Тип B), page-full.njk (Type B расширенный),
│   │                   # post.njk (Тип C), listing.njk
│   └── layouts/svedenija-page.njk  # Шаблон раздела «Сведения» (layout: layouts/svedenija-page.njk)
├── admin/              # Decap CMS: index.html + config.yml
├── assets/             # Статические файлы (JS, SCSS-исходники, изображения)
├── styles/             # Скомпилированный main.css (используется на страницах)
├── content/            # Контент сайта
│   ├── abiturientam/   # Раздел «Абитуриентам» (отдельные .md)
│   ├── categories/     # Индексные страницы рубрик
│   ├── documents/      # Документы (устав и др.)
│   ├── news/           # Новости
│   └── pages/          # Статические страницы и разделы (svedenija/, vospitanie/ и др.)
├── pages/              # Шаблонные страницы (search, news-list, news-post, materials, ...)
└── index.njk           # Главная страница (Тип A)
```

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск локального сервера разработки
```bash
npm run dev
```
Сайт будет доступен по адресу: http://localhost:5000

### 3. Сборка для продакшена
```bash
npm run build
```
Результат сборки появится в папке `public/`

## 📄 Типы страниц

В сборке используются **3 типа страниц** в рамках **8 фиксированных секций**:

| Тип | Назначение | Файл шаблона | Секции | Описание |
|-----|------------|--------------|--------|----------|
| **A** | Главная страница | `src/index.njk` | 1, 2, 4, 5, 6, 7, 8 | Hero без рубрики, About `home` (4 блока), 3 последние новости, 3 карточки «Популярное», sticky-сайдбар 30% |
| **B** | Раздел / Рубрика | `layouts/page-full.njk` | 1, 2, 3, 4, 5, 6, 7, 8 | Все 8 секций канона §3.0.1: Hero с рубрикой → крошки → About `razdel` (баннеры) → подрубрики (`news` razdel) → 3 карточки «Популярное» → sticky-сайдбар 30% → backnav |
| **C** | Материал / Новость / 404 | `layouts/post.njk` | 1, 2, 3, контент, «Читайте также», 8 | Шапка, Hero с названием, крошки + мета, контент материала, «Читайте также» (вместо секции 6), подвал. Секции 4, 5, 7 отсутствуют. |

> **🟢 Канон Type B зафиксирован (v3.5, апрель 2026).** Эталон — `src/content/abiturientam/index.md`. Все 11 разделов сайта приводятся к этому единому виду. Подробное описание — `STRUCTURE_AND_PRINCIPLES.md` § 3.6 и `docs/FRONTMATTER_SPEC.md` § 2.

**Примеры front matter:**

```yaml
# Тип B — Раздел (канон)
title: Абитуриентам
layout: layouts/page-full.njk
permalink: /abiturientam/
rubric: "1"
section: abiturientam
sectionTitle: Абитуриентам
subrubricTitle: "Полезные материалы"
aboutMode: razdel            # фиксированно для всех 11 разделов
suppressSubrubrics: true     # подрубрики выводим вручную в теле
```

```yaml
# Тип C — Материал
layout: layouts/post.njk
title: День открытых дверей
date: 2026-04-17
tags: [Новости]
```

Подробнее: см. [`STRUCTURE_AND_PRINCIPLES.md`](STRUCTURE_AND_PRINCIPLES.md#3-архитектура-страниц-8-секций-3-типа-v30--финальная)

## 🎨 Стилизация

Проект использует **Bootstrap 5.3.x + плоский CSS** для адаптивной вёрстки:

- **Bootstrap 5** — базовая сетка, компоненты (navbar, cards, buttons, modals); подключается из npm-пакета через passthrough (см. `.eleventy.js`)
- **Mobile First** — базовые стили для мобильных, затем media queries для планшетов и десктопов
- **Доступность** — соответствие WCAG 2.1 AA (контраст, фокус, ARIA-атрибуты, переключатель «версии для слабовидящих»)

Канонический стиль:
- `src/styles/main.css` — единственный продакшен-CSS (~7 300 строк), копируется как есть в `public/styles/main.css`. SCSS-исходников в проекте нет — правки вносятся напрямую в `main.css`.

Подробнее: см. [`STRUCTURE_AND_PRINCIPLES.md`](STRUCTURE_AND_PRINCIPLES.md#15-технологический-стек)

## ⚙️ Конфигурация

Основной конфиг Eleventy: `.eleventy.js`

Ключевые настройки:
- Входная директория: `src/`
- Выходная директория: `public/`
- Шаблоны: Nunjucks (.njk) + Markdown (.md)
- Поддержка YAML для данных

## 📝 Текущий статус и следующие шаги

Проект находится в активной разработке. Основная инфраструктура готова, ведётся наполнение контентом.

**Ближайшие задачи (чеклист 7.0):**

1. Обновить ссылки на документы в шаблонах (`/assets/uploads/` → `https://xn----8sbwke6acce8h.xn--p1ai/docs/`) по каждой из 7 папок.
2. Удалить перенесённые папки из `src/assets/uploads/` после обновления ссылок.
3. Добавить 301-редиректы в `.htaccess` хостинга.
4. Проверить работу всех разделов с документами на сайте.

Подробный чеклист: [`CHECKLIST.md`](CHECKLIST.md), раздел 7.0.

> **Документы на хостинге:** ~423 МБ PDF/DOC/ZIP файлов размещены вне репозитория в папке `docs/` на хостинге Beget. Подробнее: [`docs-upload.README.md`](docs-upload.README.md) и [`docs/DEPLOY.md`](docs/DEPLOY.md#-структура-docs-на-хостинге--документы-вне-репозитория).

## 📦 Зависимости

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `@11ty/eleventy` | 3.1.x | Генератор статических сайтов (devDependency) |
| `@11ty/eleventy-navigation` | 0.3.x | Навигация и иерархия страниц |
| `js-yaml` | 4.x | Парсинг YAML файлов данных (devDependency) |
| `bootstrap` | 5.3.x | UI-компоненты (offcanvas-меню, dropdowns, collapse) |
| `bootstrap-icons` | 1.13.x | Иконочный шрифт |
| `aos` | 2.3.x | Анимации появления при скролле (`data-aos`) |
| `glightbox` | 3.3.x | Лайтбокс для изображений |
| `swiper` | 12.1.x | Слайдеры/карусели |
| `@srexi/purecounterjs` | 1.5.x | Счётчики цифр в hero/about-блоках |
| `lunr` | 2.3.x | Серверная генерация поискового индекса (фильтр `lunrIndex` в `.eleventy.js`) |

> ℹ️ Все vendor-библиотеки (Bootstrap, AOS, Swiper, GLightbox, PureCounter) копируются Eleventy из `node_modules/` в `public/assets/mentor/vendor/` через точечные `addPassthroughCopy`. Decap CMS подключается из CDN в `src/admin/index.html`.

Установка:
```bash
npm install
```

## 📁 Дополнительные директории

- `mirror/` — оригинальное зеркало сайта sit-salsk.ru (источник контента для миграции, **не загружается** на хостинг). См. `mirror/MIRROR_README.md` и `mirror/SITE_RUBRICS_STRUCTURE.md`.

## 📚 Документация проекта

- [`STRUCTURE_AND_PRINCIPLES.md`](STRUCTURE_AND_PRINCIPLES.md) — архитектура, принципы, дерево проекта
- [`ROADMAP.md`](ROADMAP.md) — план разработки
- [`CHECKLIST.md`](CHECKLIST.md) — статус задач
- [`docs/FRONTMATTER_SPEC.md`](docs/FRONTMATTER_SPEC.md) — спецификация front matter
- [`docs/COLLECTIONS_SETUP.md`](docs/COLLECTIONS_SETUP.md) — настройка коллекций
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — инструкция по деплою
- [`docs/MIGRATION_PLAN.md`](docs/MIGRATION_PLAN.md) — план миграции контента

## 📞 Контакты

При возникновении вопросов обращайтесь к документации Eleventy: https://www.11ty.dev/docs/
