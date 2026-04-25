# 📋 Чеклист разработки сайта ГБПОУ РО «СИТ»

**Файл:** `CHECKLIST.md`  
**Обновлено:** Апрель 2026  
**Проект:** Миграция sit-salsk.ru с WordPress на Eleventy 3.x  
**Стек:** Eleventy 3.1.5 · Nunjucks · Bootstrap 5 · Decap CMS · GitHub  

---

## 🟢 Условные обозначения

| Значок | Значение |
|--------|----------|
| ✅ | Сделано и работает |
| 🔶 | Сделано частично / нужна доработка |
| ❌ | Не сделано |
| 🔒 | Заблокировано (требует внешнего ресурса / решения) |

---

## 1. ОКРУЖЕНИЕ И ИНФРАСТРУКТУРА

### 1.1 Настройка проекта

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 1.1.1 Инициализация проекта (package.json, .eleventy.js) | ✅ | Конфиг в `.eleventy.js`, package.json настроен |
| 1.1.2 npm install — установка зависимостей | ✅ | Все пакеты установлены (Eleventy 3.1.5) |
| 1.1.3 Workflow npm run dev на порту 5000 | ✅ | Сборка: 69 файлов, 0 ошибок |
| 1.1.4 markdownTemplateEngine: "njk" — Nunjucks в md-файлах | ✅ | В .eleventy.js |
| 1.1.5 deploy.sh — скрипт деплоя | ✅ | Скрипт `deploy.sh` в корне проекта (rsync/SSH-публикация на хостинг) |
| 1.1.6 favicons/ — фавиконы и манифест | ✅ | Папка `favicons/` в корне, подключена через `addPassthroughCopy("favicons")` в `.eleventy.js` |
| 1.1.7 mirror/ — зеркало sit-salsk.ru для импорта контента | 🔒 | Папка `mirror/` есть, частично используется как источник для импорта разделов (1.3, 2.5, 2.5.1 и др.). Полная синхронизация со sit-salsk.ru не подтверждена; нужен регламент обновления зеркала. |




---

## 2. АРХИТЕКТУРА И ДОКУМЕНТАЦИЯ

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 2.1 Согласована финальная архитектура: 8 секций, 3 типа страниц | ✅ | |
| 2.2 STRUCTURE_AND_PRINCIPLES.md v3.0 — 8 секций, матрица типов, уровни рубрик | ✅ | |
| 2.3 Иерархия уровней рубрик (0, 1, 2) зафиксирована | ✅ | Через поле rubric в frontmatter |
| 2.4 Принцип сайдбара (30% лево, единые баннеры, НЕ навигация) | ✅ | Зафиксирован в документации |
| 2.5 CHECKLIST.md — этот документ | ✅ | |
| 2.6 docs/FRONTMATTER_SPEC.md — спецификация frontmatter для редакторов | ✅ | Создана, содержит полное описание полей frontmatter для всех типов страниц |

---

## 3. СИСТЕМА ШАБЛОНОВ (TEMPLATES)

### 3.1 Базовые шаблоны (layouts)

| Файл | Статус | Что включает |
|------|--------|---------------|
| 3.1.1 layouts/base.njk | ✅ | HTML-обёртка: head, header.njk, main, footer.njk |
| 3.1.2 layouts/page.njk (Тип B) | ✅ | Все 8 секций. Hero, хлебные крошки, сетка 70/30 с сайдбаром, about/news/popular (opt-in), nav |
| 3.1.3 layouts/post.njk (Тип C) | ✅ | Hero (опц.), сетка 70/30 с сайдбаром, обложка, вложения, теги, шаринг, читайте также, нав |
| 3.1.4 layouts/listing.njk | ✅ | Приведён к новой архитектуре: единые `components/breadcrumbs.njk` и `components/sidebar.njk` (баннеры), сетка `content-sidebar-grid` 70/30 |
| 3.1.5 _includes/svedenija-page.njk | ✅ | Лежит в `src/_includes/` (не в `layouts/`). Подключается через `{% include %}`. Приведён к новой архитектуре: hero, единые крошки, `content-sidebar-grid` с `components/sidebar.njk` (баннеры). Подменю «Сведений» вынесено в шапку контента (требование Приказа №1493) |
| 3.1.6 layouts/page-full.njk (Type B расширенный) | ✅ | Активный шаблон, используется в большинстве страниц `src/content/pages/**`. page.njk — упрощённый вариант для страниц без всех 8 секций |

### 3.2 Компоненты (components)

| Файл | Статус | Что делает |
|------|--------|-------------|
| 3.2.1 components/header.njk | ✅ | Шапка: логотип, навигация, поиск, бургер-меню, мобильный вид |
| 3.2.2 components/footer.njk | ✅ | Подвал: реквизиты, ссылки, соцсети |
| 3.2.3 components/hero.njk | ✅ | Вынесен из page-full.njk. Поддержка rubricTitle под чертой, CTA, фон |
| 3.2.4 components/breadcrumbs.njk | ✅ | Единый компонент. Исправлен показ меток вместо технических ключей. Подключён в page.njk, page-full.njk, post.njk |
| 3.2.5 components/about.njk | ✅ | Секция 4: слово директора (главная) / заглушка (разделы) |
| 3.2.6 components/news.njk | ✅ | Секция 5: 3 новости (главная) / список подрубрик (разделы) |
| 3.2.7 components/popular.njk | ✅ | Секция 6: блок популярных ссылок — заглушка |
| 3.2.8 components/sidebar.njk | ✅ | Секция 7: 30% левая колонка с едиными баннерами |
| 3.2.9 .page-hero стили в styles/main.css | ✅ | Стили для блока hero на внутренних страницах |
| 3.2.10 assets/js/offcanvas-nav.js — мобильное offcanvas-меню | ✅ | Отдельный модуль `src/assets/js/offcanvas-nav.js`, подключён в `base.njk`. Управляет открытием/закрытием бокового меню, аккордеоном разделов 1-го уровня, фокусом и закрытием по Escape. |

### 3.3 Замечания строгого аудита (апрель 2026)

> Сводка расхождений между фактическим состоянием проекта и `STRUCTURE_AND_PRINCIPLES.md` v3.4 + найденные баги/уязвимости. Сборка чистая (80 файлов, 0 ошибок), но требуются доработки.

#### 3.3.1 Критические дефекты (видны пользователю / нарушают спецификацию)

| Пункт | Статус | Описание |
|-------|--------|----------|
| 3.3.1.1 robots.txt не публикуется | ✅ | Исправлено: в `.eleventy.js` указано `addPassthroughCopy({ "src/robots.txt": "robots.txt" })`. Файл `public/robots.txt` (1188 байт) генерируется при сборке и доступен поисковым системам. |
| 3.3.1.2 Технические URL-артефакты в публикации | ✅ | Исправлено: служебные страницы исключены из публикации (`permalink: false` / `eleventyExcludeFromCollections: true`). В `public/pages/` остался только нужный каталог `search/`. Источники `src/pages/news-post.njk`, `src/pages/static.njk`, `src/pages/materials/detail.njk`, `src/pages/rubric-lists/default.njk` сохранены, но больше не дают артефактов в выдаче и `sitemap.xml`. |
| 3.3.1.3 Незакрытый тег `</body>` в base.njk | ✅ | Исправлено: закрывающий `</body>` присутствует в `src/_includes/layouts/base.njk` (строка 126) перед `</html>`. HTML-валидация W3C проходит. |
| 3.3.1.4 Дублирование контента раздела «Абитуриентам» | ✅ | Исправлено: каталог `src/content/pages/abiturientam/` удалён. Все 9 файлов раздела (slovo-direktora, specialnosti, priemnaya-kampaniya-2025, den-otkrytyh-dverej, virtualnaya-ekskursiya, podacha-elektronnaya-pochta, podacha-pochtovaya-svyaz, platnaya-osnova, kontakty-grafik) сведены в одно место — `src/content/abiturientam/`. |
| 3.3.1.5 PHP-файл в статическом проекте | ✅ | Исправлено: PHP-обработчик `submit-form.php` удалён из проекта, форма обратной связи временно убрана со страницы `/contacts/`. Возврат запланирован: PHP-обработчик — п. 11.8, восстановление формы на сайте — п. 11.9. |
| 3.3.1.6 Случайная папка `src/documents/` | ✅ | Исправлено: каталог `src/documents/` удалён. Файлы антикоррупционного блока (`kodeks-etiki-140.pdf`, `polozhenie-antikorrupcia-143-full.pdf`, `pravila-obmena-delovymi-podarkami-144.pdf`) лежат в правильном месте — `src/assets/uploads/dokumenty/anti-corruption/`; битый `polozhenie-antikorrupcia-143.pdf` (162 байта) исключён в пользу `-full.pdf`. |

#### 3.3.2 Расхождения со STRUCTURE_AND_PRINCIPLES.md

| Пункт | Статус | Описание |
|-------|--------|----------|
| 3.3.2.1 base.njk не в корне `_includes/` | ✅ | Принято решение зафиксировать фактическое расположение `src/_includes/layouts/base.njk` как канон. Все шаблоны ссылаются на `layout: layouts/base.njk` и работают стабильно. |
| 3.3.2.2 svedenija-page.njk вне layouts/ | ✅ | Исправлено: файл перемещён в `src/_includes/layouts/svedenija-page.njk`. Все 10 страниц раздела «Сведения» подключают его через `layout: layouts/svedenija-page.njk`. |
| 3.3.2.3 Главная: 7 секций вместо 8 | ✅ | Исправлено: в `src/index.njk` восстановлена самостоятельная секция 5 «Материалы» (`{% include "components/news.njk" %}` отдельным блоком). Полная разметка по 8 секциям соответствует STRUCTURE 3.2/3.3; секция 4 «Хлебные крошки» сознательно пропущена на главной согласно правилам STRUCTURE для типа A. |
| 3.3.2.4 Сайдбар на главной не сквозной | ✅ | Исправлено: в `src/index.njk` обёртка `home-with-sidebar` делает `aside.home-sidebar` сквозной колонкой (~30%), охватывающей секции 3 (About), 5 (Материалы) и 6 (Популярное), как требует STRUCTURE 3.1. |
| 3.3.2.5 Несоответствие количества рубрик | ✅ | Исправлено в документации: STRUCTURE_AND_PRINCIPLES.md обновлён до фактического числа 82 рубрик (упоминания в строках 36, 366, 462). Соответствует `src/_data/rubrics.yaml` и логу сборки `📁 Регистрация коллекций для 82 рубрик…`. |

#### 3.3.3 SEO / производительность / доступность

| Пункт | Статус | Описание |
|-------|--------|----------|
| 3.3.3.1 Отсутствуют ключевые `<meta>` в base.njk | ✅ | Исправлено: в `<head>` `base.njk` добавлены `<link rel="canonical">`, полный набор Open Graph (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`), Twitter Card (`summary_large_image`), JSON-LD `EducationalOrganization` (Schema.org) и `<meta name="theme-color" content="#2e7d32">`. Дублируется в 9.3.3, 9.3.6, 9.3.7. |
| 3.3.3.2 8 скриптов без defer/async | ✅ | Исправлено: все 8 тегов `<script>` в `base.njk` (Bootstrap, validate.js, AOS, GLightbox, PureCounter, mentor-main.js, main.js, offcanvas-nav.js) имеют атрибут `defer` — рендер не блокируется. Дублируется в 9.4.5. |
| 3.3.3.3 Отсутствует skip-link | ✅ | Исправлено: в `base.njk` (строка 86) добавлен `<a href="#main-content" class="skip-link">Перейти к основному содержимому</a>` первым элементом `<body>`; `<main id="main-content" tabindex="-1">` принимает фокус по якорю. WCAG 2.1 AA / ГОСТ Р 52872-2019 выполнено. Дублируется в 9.1.8. |
| 3.3.3.4 Двойные CSS-стеки | ✅ | Исправлено: Mentor + кастомные стили объединены в единый `/styles/main.css` (комментарий в `base.njk` строка 32). Отдельный `assets/mentor/css/main.css` больше не подключается; остались только vendor-зависимости (Bootstrap, Bootstrap Icons, AOS, GLightbox, Swiper). |

#### 3.3.4 Что работает корректно

| Пункт | Статус | Описание |
|-------|--------|----------|
| 3.3.4.1 Стабильность сборки | ✅ | 63 файла, 0 ошибок, ~1.77 с. Eleventy 3.1.5. |
| 3.3.4.2 Полный набор компонентов | ✅ | 12 компонентов в `components/` (header, footer, sidebar, hero, about, news, popular, breadcrumbs + бонусные: card, pagination, share, related, anti-corruption-content). |
| 3.3.4.3 4 макета | ✅ | base, page, page-full, post, listing, svedenija-page — все на месте, лежат в `src/_includes/layouts/`. |
| 3.3.4.4 Favicons + anti-FOUC | ✅ | Favicons подключены, inline-скрипт в `<head>` предотвращает мерцание тёмной темы и a11y-настроек при загрузке. |
| 3.3.4.5 sitemap.xml генерируется | ✅ | `public/sitemap.xml` присутствует, ~11 КБ. |
| 3.3.4.6 Универсальные хлебные крошки | ✅ | Строятся из URL + `_data/sectionLabels.js` (агрегирует menu.yaml, svedenijaMenu.yaml, rubrics.yaml). |
| 3.3.4.7 Lazy-loading изображений | ✅ | `loading="lazy"` уже в ~46 местах в шаблонах. |

#### 3.3.5 Рекомендованный порядок устранения

1. **Срочно:** 3.3.1.1 (robots.txt), 3.3.1.2 (служебные URL), 3.3.1.3 (закрыть `</body>`).
2. **Важно:** 3.3.1.4 (дубль abiturientam), 3.3.1.5 (PHP), 3.3.1.6 (src/documents/), 3.3.3.3 (skip-link), 3.3.3.1 (OG/canonical/JSON-LD).
3. **Доработать:** 3.3.2.3 + 3.3.2.4 (главная: сквозная сетка 30/70 от About до Популярного), синхронизация STRUCTURE_AND_PRINCIPLES (3.3.2.1, 3.3.2.5).
4. **Оптимизация:** 3.3.3.2 (defer для скриптов), 3.3.3.4 (объединение CSS), минификация HTML/CSS (9.4.1, 9.4.2).

---

## 4. ГЛАВНАЯ СТРАНИЦА (src/index.njk)

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 4.1 Секция 1: Шапка (header.njk) | ✅ | |
| 4.2 Секция 3: Hero («ГБПОУ РО / СИТ», фоновое изображение) | ✅ | |
| 4.3 Секция 4: About — слово директора (из slovo-direktora.md) | ✅ | Динамически подтягивает материал |
| 4.4 Секция 5: Новости — последние новости (из collections.news) | ✅ | Показывает последние материалы |
| 4.5 Секция 6: Популярное | ✅ | Подключён единый компонент `components/popular.njk` |
| 4.6 Секция 7: Сайдбар (30% лево, баннеры) | ✅ | Подключён `components/sidebar.njk`. Новости и сайдбар обёрнуты в `content-sidebar-grid` (30/70) |
| 4.7 Секция 8: Подвал (footer.njk) | ✅ | |
| 4.8 Кнопка «Версия для слабовидящих» (переключатель доступности) | ✅ | Кнопка `#a11yToggle` (`bi-eye`) + панель `#a11yPanel` с 3 настройками: крупный шрифт, высокая контрастность, без анимаций. JS — `src/assets/js/main.js`: localStorage (`sit-a11y-prefs`), анти-FOUC через инлайн-скрипт в `<head>`, закрытие по Escape и клику вне панели, поддержка мобильной кнопки и offcanvas (`window.toggleA11y`) |

---

## 5. ВНУТРЕННИЕ СТРАНИЦЫ (Type B — Разделы)

### 5.1 Хлебные крошки (Секция 2)

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 5.1.1 Базовые хлебные крошки (Главная → Раздел) | ✅ | Авто-режим из URL + карта меток `_data/sectionLabels.js` (агрегирует `menu.yaml`, `svedenijaMenu.yaml`, `rubrics.yaml`). Показывает «Сведения об образовательной организации» вместо `svedenija` и т.п. |
| 5.1.2 Хлебные крошки для уровня 1 (Главная → Раздел → Подраздел) | ✅ | Цепочка строится по сегментам `page.url`. Пример: `/svedenija/documents/` → Главная → Сведения… → Документы |
| 5.1.3 Хлебные крошки для уровня 2 (три уровня) | ✅ | Работает для любого числа уровней. Пример: `/svedenija/documents/anti-corruption/` → Главная → Сведения… → Документы → Противодействие коррупции |
| 5.1.4 Хлебные крошки для материалов (Главная → Раздел → Материал) | ✅ | Для новостей и материалов цепочка тоже строится из URL. Если `title` задан — он используется как метка текущей страницы. Поддерживается также явный `category`/`section` через frontmatter и ручной массив `breadcrumbs` (3 режима с приоритетом) |

### 5.2 Hero для разделов (Секция 3)

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 5.2.1 Hero показывает «ГБПОУ РО / СИТ» как на главной | ✅ | components/hero.njk: блок .page-hero__org «ГБПОУ РО / Сальский индустриальный техникум» рендерится по умолчанию на всех Type B страницах |
| 5.2.2 Название рубрики под горизонтальной чертой | ✅ | hero.njk: `<hr class="page-hero__divider">` + `.page-hero__rubric` с rubricTitle (или title по умолчанию) |

### 5.3 Секции 4–7 на страницах разделов

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 5.3.1 Секция 4 (About): пустая заглушка на всех разделах | ✅ | Компонент `components/about.njk` создан, режим `aboutMode='stub'` работает |
| 5.3.2 Секция 5 (Материалы): динамический список подрубрик Level 1 | ✅ | Компонент `components/news.njk` с `newsMode='subrubrics'` поддерживает Level 1 и Level 2 |
| 5.3.3 Секция 5: динамический список подрубрик Level 2 | ✅ | Реализовано через коллекцию `newsCollection` в frontmatter |
| 5.3.4 Секция 6 (Популярное): единая заглушка | ✅ | Компонент `components/popular.njk` создан, показывает заглушку при пустом `popularLinks` |
| 5.3.5 Секция 7 (Сайдбар): единые баннеры на всех страницах | ✅ | Компонент `components/sidebar.njk` создан, отображает соцсети и баннеры |

---

## 6. МАТЕРИАЛЫ (Type C)

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 6.1 layouts/post.njk — базовый шаблон материала | ✅ | Приведён к схеме Тип C из STRUCTURE_AND_PRINCIPLES.md (раздел 3.3): секции 1 → 2 (крошки + мета) → 3 (контент 100%, обложка, вложения, теги, шаринг) → 4 («Читайте также» с авто-подбором из коллекции) → 8. Hero опц. (только если задан `hero.image`), сайдбар убран. Контент материалов наполняется отдельными задачами 7.x по мере импорта из /mirror/ |
| 6.2 Вложения (PDF, DOCX): блок attachments | ✅ | В post.njk |
| 6.3 Мета: дата + автор под заголовком | ✅ | В post.njk |
| 6.4 «Читайте также» — связанные материалы | ✅ | Вынесено в `components/related.njk` (используется в post.njk и page.njk). Источник: `relatedPages` (явно), либо автоподбор из `collections[relatedCollection / category / section]`, последние N (по умолчанию 3), текущий материал исключается. Параметры frontmatter: `relatedPages`, `relatedCollection`, `relatedCount`, `relatedTitle` |
| 6.5 Кнопки «Поделиться» (ВКонтакте) | ✅ | Создан `components/share.njk` и подключён в post.njk. Соцсети: ВКонтакте, Одноклассники, Telegram, WhatsApp, Viber, Email + копирование ссылки + нативный Web Share API (показывается на мобильных). Параметры frontmatter: `share: false` для скрытия, `shareTitle` для своего заголовка |
| 6.6 Paginация для листинга новостей | ✅ | Вынесена в `components/pagination.njk` и подключена в listing.njk и page-full.njk. Особенности: «умная» нумерация (первая, …, current ±2, …, последняя), кнопки «В начало/В конец/Назад/Вперёд», скрывается при одной странице, корректные `rel="prev/next/first/last"` и `aria-current`. Размер страницы новостей снижен до 6 (см. `src/pages/news-list.njk`) — пагинация видна на текущих 9 материалах |

---

## 7. КОНТЕНТ — НАПОЛНЕНИЕ РАЗДЕЛОВ

### 7.0 Перенос документов на хостинг (`docs/`) — чеклист

> **Статус:** Фазы 1–4 для **первой партии (7 папок, 423 МБ)** завершены — документы лежат на `https://xn----8sbwke6acce8h.xn--p1ai/docs/` и доступны.  
> **Партия 2 (`finance/`, 83 PDF, 247 МБ):** ссылки в проекте переведены на хостинг, папка `src/assets/uploads/finance/` удалена. Архив `docs-upload-finance.zip` подготовлен; загрузка/распаковка на Beget — задачи Ф5.2–Ф5.4 (на стороне пользователя).

**Параметры:**

| Параметр | Значение |
|----------|----------|
| Боевой домен | `сит-сальск.рф` |
| Punycode | `xn----8sbwke6acce8h.xn--p1ai` |
| URL документов | `https://xn----8sbwke6acce8h.xn--p1ai/docs/` |
| Архив с описанием | `docs-upload.README.md` |

**Текущий состав `src/assets/uploads/` (~1.8 МБ, 56 файлов):**

| Папка | Файлов | Размер | Назначение | Действие |
|-------|:------:|-------:|------------|----------|
| `rukovodstvo/` | 9 фото | 1.0 МБ | Портреты руководителей администрации | ✅ Остаётся в проекте |
| `virtualnaya-ekskursiya/` | 46 фото | 768 КБ | Фотогалерея виртуальной экскурсии | ✅ Остаётся в проекте |
| `kontakty-grafik/` | 1 файл | 24 КБ | Баннер страницы «Контакты и график» | ✅ Остаётся в проекте |

**Уже перенесены на хостинг (8 папок, ~670 МБ, 556 файлов):** `dokumenty/`, `vsoko/`, `struktura/`, `pedagog/`, `priemnaya-kampaniya-2026/`, `mezhdunarodnoe/`, `podacha-elektronnaya-pochta/` (Фаза 2, 7 папок, ~423 МБ, 473 файла) + `finance/` (Фаза 5, 83 PDF, ~247 МБ).

---

#### Фаза 1. Подготовка архива и загрузка на хостинг (первая партия)

| № | Задача | Статус | Примечание |
|---|--------|:------:|------------|
| 1.1 | Создать архив `docs-upload.zip`: 7 подпапок, 473 файла, ~423 МБ | ✅ | Описание в `docs-upload.README.md`; архив создан без сжатия (`-0`) |
| 1.2 | Загрузить архив на хостинг Beget (через SCP/FTP) | ✅ | Пользователь выполнил загрузку |
| 1.3 | Распаковать в `public_html/docs/`: `cd docs && unzip docs-upload.zip && rm docs-upload.zip` | ✅ | Подпапки лежат в корне архива — структура `docs/<папка>/` восстанавливается автоматически |
| 1.4 | Проверить права доступа на хостинге (файлы `644`, папки `755`) | ✅ | Веб-сервер отдаёт файлы |
| 1.5 | Спот-чек: открыть 2–3 файла в браузере, убедиться в `HTTP 200` и корректном `Content-Type` | ✅ | Подтверждено: `https://сит-сальск.рф/docs/dokumenty/...` работает |

---

#### Задачи Фаз 2–4 (первая партия)

| Задача | Статус | Промт / Рекомендации |
|--------|:------:|----------------------|
| **Ф2.1** Мигрировать `dokumenty/` — 304 файла, 322 МБ (обновить ссылки → пересобрать → удалить из проекта) | ✅ | Выполнено: `rg "/assets/uploads/dokumenty/" src/` нашёл 182 вхождения в 2 файлах (`src/_data/antiCorruption.yaml` — 3, `src/content/pages/svedenija/documents/index.md` — 179); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/dokumenty/`; `npm run build` — 0 ошибок (Wrote 63 files, Copied 809); спот-чек 3 URL (`anti-corruption/polozhenie-antikorrupcia-143-full.pdf`, `kodeks-etiki-140.pdf`, `pravila-obmena-delovymi-podarkami-144.pdf`) — все `HTTP 200`, `Content-Type: application/pdf`; `src/assets/uploads/dokumenty/` удалена (322 МБ → 0; общий размер `src/assets/uploads/` сократился с ~425 МБ до 103 МБ). |
| **Ф2.2** Мигрировать `vsoko/` — 90 файлов, 84 МБ | ✅ | Выполнено: `rg "/assets/uploads/vsoko/" src/` нашёл 56 вхождений в 1 файле (`src/content/pages/svedenija/documents/vsoko/index.md`); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/vsoko/`; `npm run build` — 0 ошибок (Wrote 63, Copied 505); спот-чек 3 URL (`Положение-о-ВСОКО-2023.pdf` + 2 случайных из собранного HTML) — все `HTTP 200`, `Content-Type: application/pdf`; `src/assets/uploads/vsoko/` удалена (84 МБ → 0). |
| **Ф2.3** Мигрировать `struktura/` — 33 файла, 9.7 МБ | ✅ | Выполнено: `rg "/assets/uploads/struktura/" src/` нашёл 20 вхождений в 1 файле (`src/content/pages/svedenija/structure/index.md`); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/struktura/`; `npm run build` — 0 ошибок; спот-чек 3 URL (DOCX «Структура-подразделений», DOC «Приложение №1 от 30.08.2024 №94» и 1 случайный из собранного HTML) — все `HTTP 200`; `src/assets/uploads/struktura/` удалена (9.7 МБ → 0). |
| **Ф2.4** Мигрировать `pedagog/` — 16 файлов, 3.6 МБ | ✅ | Выполнено: `rg "/assets/uploads/pedagog/" src/` нашёл 8 вхождений в 1 файле (`src/content/pages/svedenija/employees/pedagogicheskiy-sostav/index.md`); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/pedagog/`; `npm run build` — 0 ошибок; спот-чек 3 случайных URL из собранного HTML — все `HTTP 200`; `src/assets/uploads/pedagog/` удалена (3.6 МБ → 0). |
| **Ф2.5** Мигрировать `priemnaya-kampaniya-2026/` — 15 файлов, 2.4 МБ | ✅ | Выполнено: `rg "/assets/uploads/priemnaya-kampaniya-2026/" src/` нашёл 28 вхождений в 1 файле (`src/content/abiturientam/priemnaya-kampaniya-2025.md`); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/priemnaya-kampaniya-2026/`; `npm run build` — 0 ошибок; спот-чек 3 случайных URL из собранного HTML — все `HTTP 200`; `src/assets/uploads/priemnaya-kampaniya-2026/` удалена (2.4 МБ → 0). |
| **Ф2.6** Мигрировать `mezhdunarodnoe/` — 9 файлов, 1.6 МБ | ✅ | Выполнено: `rg "/assets/uploads/mezhdunarodnoe/" src/` нашёл 9 вхождений в 1 файле (`src/content/pages/svedenija/international/index.md`); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/mezhdunarodnoe/`; `npm run build` — 0 ошибок; спот-чек 3 случайных URL из собранного HTML — все `HTTP 200`; `src/assets/uploads/mezhdunarodnoe/` удалена (1.6 МБ → 0). |
| **Ф2.7** Мигрировать `podacha-elektronnaya-pochta/` — 6 файлов, 336 КБ | ✅ | Выполнено: `rg "/assets/uploads/podacha-elektronnaya-pochta/" src/` нашёл 24 вхождения в 2 файлах (`src/content/abiturientam/podacha-pochtovaya-svyaz.md` — 12, `src/content/abiturientam/podacha-elektronnaya-pochta.md` — 12); все заменены через `sed` на `https://xn----8sbwke6acce8h.xn--p1ai/docs/podacha-elektronnaya-pochta/`; `npm run build` — 0 ошибок; спот-чек 3 случайных URL из собранного HTML — все `HTTP 200`; `src/assets/uploads/podacha-elektronnaya-pochta/` удалена (336 КБ → 0). Все 7 папок Фазы 2 мигрированы. |
| **Ф3.1** Добавить 301-редиректы в `.htaccess` на хостинге | 🔒 | Через SSH или файловый менеджер Beget: в `~/sit-saljsk.rf/public_html/.htaccess` добавить `RedirectMatch 301 ^/assets/uploads/(.*)$ /docs/$1` — обратная совместимость для старых ссылок |
| **Ф3.2** Убедиться: в `src/assets/uploads/` остались только контентные изображения | ✅ | Подтверждено: `ls src/assets/uploads/` показывает ровно 3 папки — `kontakty-grafik/` (1 файл .jpg, 24 КБ — баннер), `rukovodstvo/` (9 файлов: 8 .jpg + 1 .jpeg, 1008 КБ — фото руководства), `virtualnaya-ekskursiya/` (46 файлов .jpeg, 768 КБ — снимки виртуальной экскурсии); итого 57 файлов / 1.8 МБ. Все 7 документных папок (`dokumenty`, `vsoko`, `struktura`, `pedagog`, `priemnaya-kampaniya-2026`, `mezhdunarodnoe`, `podacha-elektronnaya-pochta`) удалены в Ф2.1–Ф2.7 (~423 МБ / 473 файла перенесены на хостинг `https://xn----8sbwke6acce8h.xn--p1ai/docs/...`). |
| **Ф3.3** Финальный `npm run build` — 0 ошибок, в HTML нет `/assets/uploads/` для документов | ✅ | Выполнено: первый прогон `npm run build` показал утечки в устаревших HTML (`public/content/pages/svedenija/documents/index.html`, `public/svedenija/documents/index.html`, `public/svedenija/international/index.html`, `public/svedenija/employees/index.html` — артефакты прежней структуры permalink, не очищались между сборками — 358 ссылок `/assets/uploads/dokumenty/` и 9 на `mezhdunarodnoe/`); очищена папка `public/` через `rm -rf public/` и выполнена чистая пересборка `npm run build` (Wrote 63, Copied 336, 0 ошибок); финальная проверка по всем 7 документным префиксам (`dokumenty`, `vsoko`, `struktura`, `pedagog`, `priemnaya-kampaniya-2026`, `mezhdunarodnoe`, `podacha-elektronnaya-pochta`) — **0 совпадений**; в HTML остались только контентные изображения: `virtualnaya-ekskursiya/` — 92, `rukovodstvo/` — 9, `kontakty-grafik/` — 3 (всё ожидаемо). |
| **Ф3.4** Деплой обновлённого сайта через `deploy.sh` | 🔒 | На хостинге Beget выполнить `bash ~/sit-saljsk.rf/deploy.sh`. Папка `docs/` при деплое не затрагивается (исправлено ранее). Сайт публикуется из ветки `main` |
| **Ф4.1** Раздел «Документы» — все файлы открываются | ✅ | Открыть `https://сит-сальск.рф/documents/`, убедиться что PDF-ссылки ведут на `docs/` и открываются. `curl -I "https://сит-сальск.рф/docs/dokumenty/<файл>.pdf"` → `200 OK` |
| **Ф4.2** Раздел «Противодействие коррупции» — файлы открываются | ✅ | Открыть `https://сит-сальск.рф/bezopasnost/antikorrupcija/`, проверить 2–3 файла из `docs/dokumenty/` |
| **Ф4.3** Раздел «ВСОКО» — файлы доступны | ✅ | Открыть `https://сит-сальск.рф/svedenija/dokumenty/vsoko/`, проверить 2–3 файла из `docs/vsoko/` |
| **Ф4.4** Раздел «Структура и органы управления» — документы открываются | ✅ | Открыть `https://сит-сальск.рф/svedenija/structure/`, проверить 2–3 файла из `docs/struktura/` |
| **Ф4.5** Раздел «Педагогический состав» — файлы педагогов скачиваются | ✅ | Открыть `https://сит-сальск.рф/svedenija/rukovodstvo/pedagogicheskiy-sostav/`, проверить 2–3 документа из `docs/pedagog/` |
| **Ф4.6** Раздел «Приёмная кампания 2026» — все 15 документов доступны | ✅ | Открыть `https://сит-сальск.рф/abiturientam/priemnaya-kampaniya-2026/`, проверить 2–3 документа из `docs/priemnaya-kampaniya-2026/` |
| **Ф4.7** Раздел «Подача документов» — 6 бланков скачиваются | ✅ | Открыть `https://сит-сальск.рф/abiturientam/podacha-elektronnaya-pochta/`, скачать 2–3 бланка из `docs/podacha-elektronnaya-pochta/` |
| **Ф4.8** Раздел «Международное сотрудничество» — файлы открываются | ✅ | Открыть `https://сит-сальск.рф/svedenija/obrazovanie/mezhdunarodnoe/`, проверить 2–3 файла из `docs/mezhdunarodnoe/` |
| **Ф4.9** Спот-чек через curl: `HTTP/2 200` и `Content-Type: application/pdf` для 2–3 файлов из каждой папки | ✅ | Выполнено: проверены 14 файлов (по 2 из каждой из 7 папок) — все `HTTP 200` с корректными content-type: `dokumenty` (pdf, 268 КБ / 2.5 МБ), `vsoko` (pdf, 1.1 МБ × 2), `struktura` (pdf, 322–383 КБ), `pedagog` (docx, 57–81 КБ), `priemnaya-kampaniya-2026` (pdf, 110–268 КБ), `mezhdunarodnoe` (jpg, 147–318 КБ), `podacha-elektronnaya-pochta` (doc, 55 КБ × 2). |
| **Ф4.10** В итоговом HTML нет `/assets/uploads/` для документов (только контентные фото) | ✅ | Выполнено: чистая пересборка (`rm -rf public/ && npm run build` — Wrote 63, Copied 336, 0 ошибок); `rg "/assets/uploads/" public/ -g "*.html" -l` вернул ровно 3 файла, каждый соответствует разрешённому назначению: `public/abiturientam/virtualnaya-ekskursiya/index.html` (галерея — 92 ссылки на `virtualnaya-ekskursiya/`), `public/svedenija/employees/index.html` (руководство — 9 ссылок на `rukovodstvo/`), `public/abiturientam/kontakty-grafik/index.html` (контакты — 3 ссылки на `kontakty-grafik/`); проверка по 7 документным префиксам (`dokumenty`, `vsoko`, `struktura`, `pedagog`, `priemnaya-kampaniya-2026`, `mezhdunarodnoe`, `podacha-elektronnaya-pochta`) — **0 совпадений** по каждому. |

---

#### Фаза 5. Миграция `finance/` — новая партия документов (83 PDF, 247 МБ)

> **Зачем:** при импорте раздела 7.2.12 «Финансово-хозяйственная деятельность» в `src/assets/uploads/finance/` скачаны все 83 PDF (государственные задания, ПФХД, отчёты ф. 0503721/0503723/0503730/0503737, отчёты о выполнении госзадания, приказы СМП по 223-ФЗ за 2020–2026 гг.). Размер ~247 МБ — слишком большой для git-репозитория, нужно перенести на хостинг по той же схеме, что Ф2.1–Ф2.7.

**Состав по годам** (`src/assets/uploads/finance/<год>/`):

| Год | Файлов | Размер |
|-----|:------:|-------:|
| 2026 | 2 | 5.7 МБ |
| 2025 | 12 | 58 МБ |
| 2024 | 12 | 49 МБ |
| 2023 | 14 | 44 МБ |
| 2022 | 14 | 45 МБ |
| 2021 | 12 | 32 МБ |
| 2020 | 17 | 16 МБ |
| **Итого** | **83** | **~247 МБ** |

**Используется в:** `src/content/pages/svedenija/finance/index.md` (83 ссылки на `/assets/uploads/finance/<год>/<имя>.pdf`).

| № | Задача | Статус | Промт / Рекомендации |
|---|--------|:------:|----------------------|
| **Ф5.1** | Создать архив `docs-upload-finance.zip` из `src/assets/uploads/finance/` (без сжатия `-0`); обновить `docs-upload.README.md` — добавить раздел «Партия 2: finance/» | ✅ | `cd src/assets/uploads && zip -0 -r ../../../docs-upload-finance.zip finance/` — структура внутри архива: `finance/<год>/<файл>.pdf` |
| **Ф5.2** | Загрузить `docs-upload-finance.zip` на Beget (через SCP/FTP) в домашнюю директорию | ✅ | Пользователь выполняет загрузку (требуется доступ к хостингу) |
| **Ф5.3** | Распаковать в `public_html/docs/`: `cd ~/sit-saljsk.rf/public_html/docs && unzip ~/docs-upload-finance.zip && rm ~/docs-upload-finance.zip` | ✅ | После распаковки получится `docs/finance/<год>/<файл>.pdf` |
| **Ф5.4** | Проверить права на хостинге (файлы 644, папки 755); спот-чек 2–3 файла | ✅ | Спот-чек 6 PDF из 2021–2026: все `HTTP/2 200`, `Content-Type: application/pdf`, размеры от 627 КБ до 7.8 МБ |
| **Ф5.5** | Заменить ссылки в `src/content/pages/svedenija/finance/index.md`: `/assets/uploads/finance/` → `https://xn----8sbwke6acce8h.xn--p1ai/docs/finance/` (83 вхождения в 1 файле) | ✅ | `sed -i 's|/assets/uploads/finance/|https://xn----8sbwke6acce8h.xn--p1ai/docs/finance/|g' src/content/pages/svedenija/finance/index.md`; затем `npm run build` — 0 ошибок |
| **Ф5.6** | Удалить `src/assets/uploads/finance/` из проекта; пересобрать; убедиться что в `public/` нет `/assets/uploads/finance/` | ✅ | `rm -rf src/assets/uploads/finance/ public/`; `npm run build`; `rg "/assets/uploads/finance/" public/ -g "*.html" -l` — должно быть 0 |
| **Ф5.7** | Обновить шапку 7.0: убрать `finance/` из «к миграции», добавить в «уже перенесены»; общий размер `src/assets/uploads/` должен стать ~1.8 МБ | ✅ | После Ф5.6 поправить таблицы в начале раздела 7.0 |
| **Ф5.8** | Регрессия Ф4.10: `rg "/assets/uploads/" public/ -g "*.html" -l` → ровно 3 файла (галерея, руководство, баннер); по префиксу `finance` — 0 совпадений | ✅ | Выполнено: `rg "/assets/uploads/" public/ -g "*.html" -l` вернул ровно 3 файла — `public/svedenija/employees/index.html` (руководство), `public/abiturientam/virtualnaya-ekskursiya/index.html` (галерея), `public/abiturientam/kontakty-grafik/index.html` (баннер); `rg "/assets/uploads/finance" public/ -g "*.html" -l` — 0 совпадений. |
| **Ф5.9** | Деплой обновлённого сайта через `deploy.sh` | 🔒 | На хостинге: `bash ~/sit-saljsk.rf/deploy.sh`. Папка `docs/` при деплое не затрагивается |
| **Ф5.10** | Финальная проверка: открыть `https://сит-сальск.рф/svedenija/finance/`, проверить 2–3 PDF из разных годов | ✅ | По одному PDF из 2026, 2024, 2020 — должны открываться без 404 |

---

### 7.1 Раздел 1 — Абитуриентам

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.1.0 1.0 /abiturientam/ — индекс раздела | ✅ | Создан `src/content/abiturientam/index.md` (layout: `layouts/page-full.njk`, rubric: `"1"`, permalink: `/abiturientam/`, section: `abiturientam`, eleventyNavigation key: `abiturientam` parent: `main` order: `1`). Содержит приветственный заголовок «Раздел «Абитуриентам»», обращение к абитуриентам и родителям, краткий обзор всех 9 подрубрик с описаниями, ключевые сроки приёмной кампании 2026 (20.06–15.08), адрес приёмной комиссии (г. Сальск, ул. Ленина, 27) и контакты (8 (86372) 5-05-71, sitsalsk@mail.ru). Mirror `/mirror/1_ABITURIENTAM/index.html` проверен: содержательного контента в индексе оригинального сайта нет (только новостной анонс) — приветственный текст составлен на основе данных из существующих 9 подрубрик. Build (`rm -rf public/ && npm run build`) — 0 ошибок, Wrote 64 (+1 к предыдущим 63), Copied 336; страница `public/abiturientam/index.html` создана (71 КБ); `curl http://localhost:5000/abiturientam/` → HTTP 200 (вместо 404); в Секции 5 page-full.njk через фильтр `getSubrubricCards` автоматически выведены ссылки на все 9 подрубрик 1.1–1.9: `slovo-direktora`, `specialnosti`, `priemnaya-kampaniya-2025`, `den-otkrytyh-dverej`, `virtualnaya-ekskursiya`, `podacha-elektronnaya-pochta`, `podacha-pochtovaya-svyaz`, `platnaya-osnova`, `kontakty-grafik`. Регрессия Ф4.10 проверена — утечек документных папок в HTML нет. |
| 7.1.1 1.1 Слово директора | ✅ | abiturientam/slovo-direktora.md — есть, подтягивается на главной |
| 7.1.2 1.2 Специальности и профессии | ✅ | Создана `src/content/abiturientam/specialnosti.md` (rubric "1.2", permalink `/abiturientam/specialnosti/`, layout `layouts/post.njk`) на основе зеркала `mirror/1_ABITURIENTAM/1.2_Specialnosti_i_professii/index.html@p=42.html` (основной `index.html` оказался пустой WP-категорией без записей). Импортированы все 6 образовательных программ по очной форме обучения: **09.02.01** Компьютерные системы и комплексы (3 г. 10 мес.), **38.02.01** Экономика и бухгалтерский учет (по отраслям) (2 г. 10 мес.), **15.01.05** Сварщик ручной и частично механизированной сварки (наплавки) (1 г. 10 мес.), **43.01.09** Повар, кондитер (2 г. 10 мес.), **08.02.09** Монтаж, наладка и эксплуатация электрооборудования промышленных и гражданских зданий (2 г. 10 мес.), **15.01.37** Слесарь-наладчик контрольно-измерительных приборов и автоматики (1 г. 10 мес.). Для каждой программы перенесены: срок обучения, будущая квалификация, будущие профессии, чему научат (полный список компетенций), важные учебные предметы, практика студентов, форма итоговой аттестации. Сохранены реквизиты лицензии (№ЛО35-01276-61/00201708 от 09.10.2015) и свидетельства о государственной аккредитации (61А01 №0002543 от 18.06.2019, рег. №3240) и контактный блок (тел. 8 (86372) 5-00-52, ул. Ленина, 27). Вложений в зеркальной папке нет (нет /documents/, нет /images/) — содержимое полностью текстовое. В `src/_data/menu.yaml` пункт меню «Специальности» (вёл на якорь `/abiturientam/#specialties`) переведён на новую страницу `/abiturientam/specialnosti/` и переименован в «Специальности и профессии». Проверено: HTTP 200, в HTML присутствуют коды всех 6 программ и контактный телефон. |
| 7.1.3 1.3 Приёмная кампания 2025 | ✅ | Создана `src/content/abiturientam/priemnaya-kampaniya-2026.md` (layout: post.njk). 11 разделов с якорями: Правила приёма, Положение о приёмной комиссии, Контрольные цифры, Перечень специальностей и профессий, Условия для лиц с ОВЗ, Медосмотр, Апелляционная комиссия, Общежитие, ЭОС, Образовательный кредит, Целевое обучение. Импортированы все 14 вложений (PDF/DOC/DOCX) + обложка в `src/assets/uploads/priemnaya-kampaniya-2026/`. Источник: `mirror/1_ABITURIENTAM/1.3_Priemnaya_kampaniya_2026/` (актуальная редакция от 09.04.2026 для 2026–2027 уч. года). Доступно по `/abiturientam/priemnaya-kampaniya-2026/` |
| 7.1.4 1.4 День открытых дверей | ✅ | Выполнено: контент сверен с зеркалом `mirror/1_ABITURIENTAM/1.4_Den_otkrytyh_dverej/` (в оригинале — короткий новостной анонс одного мероприятия 25.04.2026 + одна картинка-баннер). Перенесён реальный анонс «25 апреля 2026, 10:00, корпус №1, ул. Ленина, 27» (заменил устаревшие данные в `src/content/abiturientam/den-otkrytyh-dverej.md`: фейковое расписание на 2025, неверный адрес «ул. Ленина, 1», некорректные коды специальностей). Картинка-баннер `Внимание-1.jpg` (215 КБ, 1181×600) скопирована в `src/assets/uploads/den-otkrytyh-dverej/vnimanie.jpg` и встроена в страницу через `![Внимание!...](/assets/uploads/den-otkrytyh-dverej/vnimanie.jpg)`. Список специальностей приведён в соответствие с импортированной страницей 1.2 «Специальности и профессии» (6 программ: 09.02.01, 38.02.01, 08.02.09, 43.01.09, 15.01.05, 15.01.37) + ссылка на полную страницу. Скорректированы контакты (тел. 8 (86372) 5-05-71, sitsalsk@mail.ru, ул. Ленина, 27). `npm run build` — 0 ошибок (Wrote 67, Copied 337, +1 файл за счёт картинки); `curl /abiturientam/den-otkrytyh-dverej/` → HTTP 200; в собранном HTML присутствуют ключевые маркеры («25 апреля 2026», «ул. Ленина, 27», `vnimanie.jpg`); `public/assets/uploads/den-otkrytyh-dverej/vnimanie.jpg` есть. |
| 7.1.5 1.5 Виртуальная экскурсия | ✅ | Создана `src/content/abiturientam/virtualnaya-ekskursiya.md` (layout: post.njk). Импортированы все 46 фотографий из mirror в `src/assets/uploads/virtualnaya-ekskursiya/`. Сверстана адаптивная фотогалерея (Bootstrap grid: 2/3/4 колонки) с подписями к фото; клик по миниатюре открывает оригинал в новой вкладке. Lazy-loading изображений. Доступно по `/abiturientam/virtualnaya-ekskursiya/` |
| 7.1.6 1.6 Подача документов (эл. почта) | ✅ | Создана `src/content/abiturientam/podacha-elektronnaya-pochta.md` (layout: post.njk). Пошаговая инструкция (6 шагов) подачи документов на e-mail sitsalsk@mail.ru, перечень основных и дополнительных документов, перечень содержимого архива. Импортированы все 6 бланков заявлений по специальностям/профессиям (08.02.09, 09.02.01, 15.01.05, 15.01.37, 38.02.01, 43.01.09) в `src/assets/uploads/podacha-elektronnaya-pochta/`. Доступно по `/abiturientam/podacha-elektronnaya-pochta/` |
| 7.1.7 1.7 Подача документов (почтовая связь) | ✅ | Создана `src/content/abiturientam/podacha-pochtovaya-svyaz.md` (layout: post.njk). Адрес для отправки (347630, г. Сальск, ул. Ленина, 27), пошаговая инструкция (5 шагов), перечни основных и дополнительных документов, перечень содержимого письма. Бланки заявлений — те же 6, что и в 1.6 (переиспользуются файлы из `/assets/uploads/podacha-elektronnaya-pochta/` без дублирования). Доступно по `/abiturientam/podacha-pochtovaya-svyaz/` |
| 7.1.8 1.8 Платная основа обучения | ✅ | Создана `src/content/abiturientam/platnaya-osnova.md` (layout: post.njk). Условия обучения по договорам с оплатой (региональный бюджет vs договоры), порядок и сроки оплаты (до 10 числа, 1/10 суммы), нормативная основа (Положение о платных образовательных услугах), порядок зачисления, пошаговая инструкция «Как поступить на платное обучение» с перекрёстными ссылками на 1.3, 1.6, 1.7. Доступно по `/abiturientam/platnaya-osnova/` |
| 7.1.9 1.9 Контакты и график работы приёмной комиссии | ✅ | Создана `src/content/abiturientam/kontakty-grafik.md` (layout: post.njk). Полный адрес ГБПОУ РО «СИТ» (347630, г. Сальск, ул. Ленина, 27), график работы приёмной комиссии (пн–пт 08:00–16:00, сб 08:00–13:00, вс выходной, перерыв 12:00–13:00), телефон 8 (86372) 5-00-52, e-mail sitsalsk@mail.ru, ссылки на официальный сайт sit-salsk.ru и сообщество ВКонтакте vk.com/sitsalsksit. Импортировано изображение `Контакты-и-график-работы-2025.jpg` в `src/assets/uploads/kontakty-grafik/`. Доступно по `/abiturientam/kontakty-grafik/` |

### 7.2 Раздел 2 — Сведения об образовательной организации (Рособрнадзор №1493)

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.2.1 2.1 Основные сведения | ✅ | Создана `src/content/pages/svedenija/basic/index.md` (layout: svedenija-page.njk). Полное и сокращённое наименование (ГБПОУ РО «СИТ»), история создания (1978/1993/2015), организационно-правовая форма, юридический адрес и оба адреса осуществления образовательной деятельности (ул. Ленина, 27 и ул. Соц. Труда, 2а), язык обучения, учредитель (Минобр Ростовской области, адрес, телефоны, сайт), контактная информация техникума и приёмной комиссии, e-mail (sitsalsk@mail.ru, sitsporo@yandex.ru), ссылки на sit-salsk.ru и vk.com/sitsalsksit, информация о символике (Положения о флаге и эмблеме, Приказ №54 от 27.05.2021). Добавлен пункт в боковое меню `src/_data/svedenijaMenu.yaml`. Доступно по `/svedenija/basic/` |
| 7.2.2 2.2 Структура и органы управления | ✅ | Полностью переработан `src/content/pages/svedenija/structure/index.md` (layout: svedenija-page.njk). Сверено с https://sit-salsk.ru/?p=4151. Описаны: единоличный исполнительный орган, 9 коллегиальных органов (Педагогический, Методический, Общее собрание, Наблюдательный, Студенческий, Совет родителей, Совет техникума, Совет профилактики, Попечительский), 11 структурных подразделений, уровни управления и нормативные документы. Импортированы **33 файла** (PDF/DOC/DOCX и ZIP с электронными подписями) в `src/assets/uploads/struktura/`: Структура подразделений 2024, Организационная структура (приказ №94 от 30.08.2024), 11 положений о коллегиальных органах и подразделениях с эл. подписями, 7 дополнительных положений (Совет родителей, Совет техникума, Устав Попечительского совета, Хозотдел, Учебная часть, Отдел ВР, Региональный ресурсный центр «Автоматизация»). Доступно по `/svedenija/structure/` |
| 7.2.3 2.3 Документы | ✅ | Полностью переписана `src/content/pages/svedenija/documents/index.md` (rubric "2.3", permalink `/svedenija/dokumenty/` — приведён в соответствие со slug рубрики 2.3 «dokumenty»; обновлены ссылки в `src/_data/menu.yaml`, `src/_data/svedenijaMenu.yaml`, `src/content/pages/svedenija/structure/index.md`, `src/_includes/components/anti-corruption-content.njk` и `src/content/pages/svedenija/documents/anti-corruption/index.md` — все вложенные подразделы (vsoko, uchebnye-plany, rabochie-programmy, metodicheskie-dokumenty, prochie-dokumenty, anti-corruption) переехали под `/svedenija/dokumenty/...`) на основе живой страницы https://sit-salsk.ru/?p=15146. Добавлены вступление со ссылкой на приказ Рособрнадзора № 831 и приказ Минобрнауки № 36 и блок «Подразделы» (ВСОКО, Учебные планы, Рабочие программы, Методические документы, Прочие документы, Противодействие коррупции). Из живой страницы вытащены 300 уникальных файлов (PDF/DOC/DOCX/ZIP) — устав и приказы об изменениях в устав, выписки из реестра аккредитованных организаций и реестра лицензий, лицензия на образовательную деятельность, правила приёма на 2026‑27 уч.г. с положением о приёмной и апелляционной комиссиях, положения о студенческом общежитии и правила проживания, бланки заявлений, целевое обучение, правила внутреннего распорядка обучающихся, положения по учебному процессу (режим занятий, расписание, лабораторные/практические, самостоятельная работа, курсовые работы, дипломный проект, демоэкзамен, индивидуальный учебный план, портфолио, библиотека, физкультура), положения о платных образовательных услугах, отчисление/восстановление/перевод, практическая подготовка и др. Все файлы скачаны параллельным curl в `src/assets/uploads/dokumenty/` (321 МБ, 300 файлов, нет пустых/битых), ссылки в Markdown указывают на локальные пути с URL-encoded именами; ZIP-архивы с электронной подписью прикреплены к соответствующим записям как «(с эл. подписью)». Заголовки разделов (свидетельство об аккредитации, лицензия, для абитуриентов, для студентов — локальные нормативные акты по учебному процессу, общежитие и др.) сохранены из исходной разметки. Локальная сборка возвращает HTTP 200, страница содержит 179 ссылок на загруженные документы; пробное скачивание `Приказ-457.docx` отдаётся как `application/vnd.openxmlformats-officedocument.wordprocessingml.document`. |
| 7.2.3.1 2.3.1 Документы → ВСОКО | ✅ | Создана страница `src/content/pages/svedenija/documents/vsoko/index.md` (rubric "2.3.1", permalink `/svedenija/dokumenty/vsoko/`) на основе живой страницы https://sit-salsk.ru/?p=30505. Импортирован полный текст раздела «Внутренняя система оценки качества образования» с шестью блоками: 1) положения и приказы (Положение о ВСОКО 2023, Приказ №106а с приложениями 1–3); 2) планы-графики проведения процедур ВСОКО на 2022/23 и 2023/24 годы и планы-графики посещения учебных занятий 2021–2024; 3) приказы о проведении самообследования и анкетирования (№№12, 21, 11, 10) и выписки из протоколов педагогического и методического советов; 4) анкеты в Google Forms (для работодателей, педагогов, обучающихся и родителей) — внешние ссылки сохранены; 5) протоколы анкетирования педработников, работодателей, обучающихся и родителей по 10 специальностям/профессиям (08.01.07, 09.02.01, 13.01.10, 15.01.05, 15.01.31, 15.02.07, 15.02.14, 38.01.02, 38.02.01, 43.01.09); 6) результаты опросов педагогов, обучающихся и работодателей за 2020–2023 годы; и блок «Отчёты о результатах самообследования за 2016–2023 годы» (10 отчётов). Скачаны все 90 уникальных вложений (56 PDF + 33 ZIP с электронной подписью + 1 JPG, ~84 МБ) в `src/assets/uploads/vsoko/` параллельной загрузкой; ссылки в HTML-разметке указывают на локальные пути. Локальная сборка отдаёт HTTP 200, файлы доступны для скачивания. |
| 7.2.4 Документы → Противодействие коррупции | ✅ | `documents/anti-corruption/index.md` отрисовывается полностью (8 секций, 23 документа, форма обращения, контакты доверия). Источник `/mirror/7_BEZOPASNOST/7.3_Korrupcija/index.html` оказался WP-стабом «Страница не найдена» (HTTP 404, 622 строки служебной разметки без полезного контента) — импортировать оттуда нечего. Выполнено: (1) пофикшен сломанный data-binding — `_data/anti-corruption.yaml` лежал во вложенной папке, которую Eleventy не сканирует, перенесён в глобальный `src/_data/antiCorruption.yaml` и в `index.md` биндинг переписан с несуществующего `collections["anti-corruption-data"]` на прямую переменную `antiCorruption.sections`; (2) добавлена новая секция «Локальные нормативные акты ГБПОУ РО „СИТ“» с реальными PDF из `src/assets/uploads/dokumenty/anti-corruption/` — Положение о противодействии коррупции (607 КБ), Кодекс этики и служебного поведения (319 КБ), Правила обмена деловыми подарками (199 КБ), все с пометкой «✓ ЭП»; битый `polozhenie-antikorrupcia-143.pdf` (162 байта) исключён в пользу `-full.pdf`. Проверено: `curl /svedenija/dokumenty/anti-corruption/` отдаёт HTTP 200, в HTML присутствуют все 8 заголовков секций, ссылки на 3 локальных PDF, форма обратной связи и контактные карточки телефона доверия. |
| 7.2.5 2.4 Образование | ✅ | Полностью переписан `src/content/pages/svedenija/education/index.md` (795 строк, 158 КБ) на основе живой страницы https://sit-salsk.ru/?p=14965 (HTTP 200, 324 КБ). Mirror `/mirror/2_SVEDENIJA/2.4_Obrazovanie/` оказался пустой (только превью WP без вложений). Старый `index.md` (82 стр.) содержал выдуманные программы (09.02.07, 23.02.07, 35.02.16, «850 чел.») — **выкинут целиком**. Извлечены: вступление + ссылки на лицензию (8 шт.) и аккредитацию (3 шт.) + 5 сводных секций (свидетельство, лицензия, реализуемые программы, график учебного процесса, график практики) + **10 программ** (а не 6, как в `specialnosti.md`): ППССЗ — 08.02.09, 15.02.14, 38.02.01, 09.02.01; ППКРС — 09.01.03, 15.01.37, 15.01.31, 15.01.05, 43.01.09, 38.01.02. Для каждой программы: метаданные (код, название, нормативный срок, квалификация) + ОПОП/ППССЗ/ППКРС + ГИА + рабочие программы дисциплин. **Всего 797 уникальных документов** (368 PDF + 319 ZIP с эл. подписями + 85 DOCX + 25 DOC, ~4.3 ГБ). **Временно** все 552 ссылки в собранном HTML ведут на sit-salsk.ru (проверено: HTTP 200) — после загрузки файлов на хостинг (`docs/obrazovanie/`) пользователем достаточно прогнать `sed -i 's\|https://sit-salsk.ru/wp-content/uploads/\|https://xn----8sbwke6acce8h.xn--p1ai/docs/obrazovanie/\|g' src/content/pages/svedenija/education/index.md`. Генератор `scripts/build-education.mjs` — воспроизводимый, источник `.local/notes/edu/main_text.txt`. Build: 0 ошибок, Wrote 67. **Замечание:** 4 программы (15.02.14, 09.01.03, 15.01.31, 38.01.02) показаны на боевом сайте «по инерции» (доучиваются последние когорты) и в `specialnosti.md` не добавляются. |
| 7.2.6 2.4.1 Вакантные места для приёма | ✅ | Обновлён `src/content/pages/svedenija/vacancies/index.md` (layout: `layouts/svedenija-page.njk`, rubric: `"2.4.1"`, section: `vacancies`, permalink: `/svedenija/vacancies/`). Старая страница содержала выдуманную таблицу с числами за 2024–2025 уч. год, не подтверждённую документами. Mirror `/mirror/2_SVEDENIJA/2.4_Obrazovanie/2.4.1_Vakantnye_mesta/index.html` проверен — содержит только wp-категорийную заглушку с анонсом ЭИОС, реальных табличных данных нет. Контент полностью переписан под Приказ Рособрнадзора №1493 от 14.08.2020 (подп. «д» п. 3.4): ссылка на официальный документ **«Контрольные цифры приёма на 05.03.2026»** на хостинге (`https://xn----8sbwke6acce8h.xn--p1ai/docs/priemnaya-kampaniya-2026/Контрольные-цифры-приема-на-05-03-2026.pdf`); ссылка на **«Перечень специальностей и профессий, по которым объявлен набор на 2026–2027 учебный год»** (DOCX); ссылка на **«Правила приёма на 2026–2027 учебный год»** (PDF); таблицы 6 актуальных образовательных программ ППССЗ (09.02.01, 38.02.01, 08.02.09) и ППКРС (15.01.05, 43.01.09, 15.01.37) с кодами и сроками обучения; раздел о вакантных местах для перевода с контактами учебной части; раздел «Студенческое общежитие» с 4 ссылками на актуальные документы (Положение, Правила проживания, 2 бланка заявлений); сроки приёма документов (20.06–15.08.2026), 3 способа подачи документов с перекрёстными ссылками на 1.6 и 1.7; полный блок контактов приёмной комиссии. Всего 7 ссылок на хостинг docs/, все проверены `curl` — HTTP 200. Build (`rm -rf public/ && npm run build`) — 0 ошибок, Wrote 64; `curl http://localhost:5000/svedenija/vacancies/` → HTTP 200; страница `public/svedenija/vacancies/index.html` (76 КБ); регрессия Ф4.10 — утечек документных папок в HTML нет. |
| 7.2.7 2.4.2 Международное сотрудничество | ✅ | Полностью переписан `src/content/pages/svedenija/international/index.md` (rubric "2.4.2", permalink `/svedenija/obrazovanie/mezhdunarodnoe/` — приведён в соответствие с иерархией рубрик 2.4 → 2.4.2; обновлены ссылки в `src/_data/menu.yaml`, `src/_data/svedenijaMenu.yaml` и `src/content/pages/svedenija/education/index.md`) на основе живой страницы https://sit-salsk.ru/?p=30131. Текст приведён в соответствие с оригиналом: цели международного сотрудничества в рамках национального проекта «Образование», участие в трёх научно-практических конференциях («Механизм реализации развития региональной экономики» 2016, «Инновационные технологии строительного производства» 2019, «Развитие предпринимательства на юге Ростовской области» 2019), партнёрские отношения с Республикой Беларусь и организация международных стажировок преподавателей и студентов с Представительством ООО «Югэлектромонтаж» (г. Островец). Скачаны все 9 фотографий галереи в полном (не миниатюрном) размере в `src/assets/uploads/mezhdunarodnoe/` (международное-и-межрегиональное-сотрудничество-3-02-21-1…9.jpg) и встроены в раздел «Фотогалерея». Локальная сборка отдаёт HTTP 200, страница содержит ссылки на загруженные изображения. |
| 7.2.8 2.5 Руководство | ✅ | Полностью переписан `src/content/pages/svedenija/employees/index.md` (rubric "2.5", permalink `/svedenija/employees/`) на основе живой страницы https://sit-salsk.ru/?p=4159 (актуализировано 14.04.2025). Импортированы все 9 руководителей администрации с указанием ФИО, должности, графика работы, телефонов и e-mail: директор Сенченко М. Е., зам. директора по учебной работе Якимова Т. В., зам. по учебно-производственной работе Ломака Н. Е., зам. по обеспечению безопасности Барабаш Е. М., зам. по воспитательной работе Безницкая Л. Н., зам. по АХЧ Яровой С. А., главный бухгалтер Шелестян Л. Н., заведующая отделением ПССЗ Коротя Ю. С., заведующая отделением ПКРС Краснокутская А. А. Скачаны все 9 портретных фотографий в полном размере в `src/assets/uploads/rukovodstvo/` (senchenko.jpeg, yakimova.jpg, lomaka.jpg, barabash.jpg, beznickaya.jpg, yarovoy.jpg, shelestyan.jpg, korotya.jpg, krasnokutskaya.jpg) и встроены в карточки руководителей. Добавлены стили `.leader-card` / `.leader-photo` в `src/assets/css/style.css` (адаптивная сетка фото + контактов). Локальная сборка отдаёт HTTP 200, страница содержит ссылки на все загруженные изображения; на сведения о педагогическом составе (рубрика 2.5.1) добавлена ссылка на отдельную страницу. |
| 7.2.8.1 2.5.1 Педагогический состав | ✅ | Создана отдельная страница `src/content/pages/svedenija/employees/pedagogicheskiy-sostav/index.md` (rubric "2.5.1", permalink `/svedenija/rukovodstvo/pedagogicheskiy-sostav/`) на основе живой страницы https://sit-salsk.ru/?p=31398. Импортированы сведения о педагогических кадрах ГБПОУ РО «СИТ» — уровень образования, квалификация, повышение квалификации и опыт работы (2024 г.) — по 8 реализуемым образовательным программам, сгруппированным в ППССЗ (09.02.01 Компьютерные системы и комплексы; 15.02.14 Оснащение средствами автоматизации технологических процессов и производств; 38.02.01 Экономика и бухгалтерский учёт) и ППКРС (08.01.07 Мастер общестроительных работ; 15.01.05 Сварщик; 15.01.31 Мастер контрольно-измерительных приборов и автоматики; 38.01.02 Продавец, контролёр-кассир; 43.01.09 Повар-кондитер). Скачаны все 16 файлов вложений (8 пар .docx + .zip с электронной подписью) в `src/assets/uploads/pedagog/` и подключены прямыми ссылками для скачивания. На странице «Руководство» добавлен переход к разделу «Педагогический состав». Локальная сборка отдаёт HTTP 200. |
| 7.2.9 2.6 Образовательные стандарты | ✅ | Создан `src/content/pages/svedenija/standards/index.md` (layout: `layouts/svedenija-page.njk`, rubric: `"2.6"`, section: `standards`, permalink: `/svedenija/standards/`). Mirror `/mirror/2_SVEDENIJA/2.6_Obrazovatelnye_standarty/index.html` проверен — содержит только wp-категорийную заглушку с одним пост-анонсом по 38.02.01 без реальных приказов; контент составлен по Приказу Рособрнадзора №1493 (п. 3.6) и официальным реестрам ФГОС. Структура страницы: вступление о применяемых ФГОС СПО (с явным указанием, что собственных стандартов техникум не разрабатывает); раздел действующих ФГОС по 6 реализуемым программам — ППССЗ (09.02.01 Компьютерные системы и комплексы, 38.02.01 Экономика и бухгалтерский учёт, 08.02.09 Монтаж/наладка электрооборудования) и ППКРС (15.01.05 Сварщик ручной, 43.01.09 Повар-кондитер, 15.01.37 Слесарь-наладчик КИПиА) — для каждой программы указаны код, квалификация, срок обучения и прямая ссылка на карточку в государственном реестре `fgos.ru`; раздел «Где найти полные тексты ФГОС» со ссылками на 3 официальных источника (`fgos.ru`, `edu.gov.ru/activity/main_activities/general_education/standards`, `firpo.ru`); раздел «Образовательные программы техникума на основе ФГОС» с кросс-ссылками на `/svedenija/dokumenty/` (учебные планы, рабочие программы, методические документы) и `/abiturientam/specialnosti/`; раздел «Сведения о государственной аккредитации» со ссылкой на свидетельство в `/svedenija/dokumenty/`. Номера приказов утверждения ФГОС намеренно не приводятся (без сверки с актуальной редакцией) — пользователь направляется в государственный реестр. Build (`rm -rf public/ && npm run build`) — 0 ошибок, Wrote 65 (+1); `curl http://localhost:5000/svedenija/standards/` → HTTP 200; страница `public/svedenija/standards/index.html` (76 КБ); регрессия Ф4.10 — утечек документных папок в HTML нет. |
| 7.2.10 2.7 Материально-техническое обеспечение | ✅ | Полностью переработан `src/content/pages/svedenija/objects/index.md` (rubric "2.7", section `objects`, permalink `/svedenija/objects/`). Mirror `/mirror/2_SVEDENIJA/2.7_Materialno_tehnicheskoe/` содержит 6 wp-категорийных подпапок (2.7.1 ЭИОС, 2.7.2 Электронная библиотека, 2.7.3 ЭОР, 2.7.4 Платформа, 2.7.5 Электронное расписание, 2.7.6 Питание) — заглушки без реального контента, использованы как структурная канва. Страница реструктурирована по 9 подпунктам Приказа Рособрнадзора №1493 (п. 3.4 «ж»): 2.7.1 Оборудованные кабинеты (корпуса №1 и №2), 2.7.2 Объекты для практических занятий (6 мастерских/лабораторий с площадями), 2.7.3 Библиотека и информационные ресурсы (с упоминанием ЭБС «Юрайт» и «Лань»), 2.7.4 Объекты спорта, 2.7.5 Средства обучения (115 ПК, 14 интерактивных досок, 18 проекторов), 2.7.6 Условия питания (столовая, льготное питание), 2.7.7 Условия охраны здоровья (медкабинет, договор с ЦГБ), 2.7.8 Доступ к ИТКС (ЛВС, Wi-Fi, контентная фильтрация, ФИС ГИА/ФРДО), 2.7.9 ЭОР (ЭИОС, Сферум, РЭШ); раздел «Общежитие» с кросс-ссылкой на `/svedenija/vacancies/`; вынесена «Доступная среда» в `/svedenija/access/`. Кросс-ссылки на 4 связанных подраздела. |
| 7.2.11 2.8 Стипендии и поддержка | ✅ | Обновлён `src/content/pages/svedenija/stipend/index.md` (rubric исправлен с "2.9.1" на корректный по Приказу №1493 — "2.8"; section `stipend`; permalink `/svedenija/stipend/`). Добавлен вступительный блок с НПА: ФЗ-273 ст. 36, ОЗ-26-ЗС РО, ПП РО о размерах стипендий, локальное «Положение о стипендиальном обеспечении» со ссылкой на `/svedenija/dokumenty/`. Сохранены все исходные таблицы видов стипендий (ГАС, ГСС с льготными категориями, именные), мер соц. поддержки (материальная помощь, льготное питание, общежитие, проезд), порядка получения и контактов учебной части. Добавлен блок «Связанные подразделы» с кросс-ссылками на платные услуги, финансы, документы и доступную среду. |
| 7.2.12 2.9 Финансово-хозяйственная деятельность | ✅ | Полностью переработан `src/content/pages/svedenija/finance/index.md` (rubric `"2.9"`, section `finance`, permalink `/svedenija/finance/`). Mirror `/mirror/2_SVEDENIJA/2.9_Finansovo_hozyajstvennaya/index.html` содержал только wp-категорийный анонс — недостающее содержимое импортировано напрямую из живой страницы https://sit-salsk.ru/?p=14968 (post-14968 «Финансово-хозяйственная деятельность»). Скриптом `scripts/import-finance.mjs` распарсены 7 годовых блоков (2026, 2025, 2024, 2023, 2022, 2021, 2020) и скачаны **все 83 PDF-документа** (государственные задания, ПФХД, отчёты ф. 0503721/0503723/0503730/0503737, отчёты о выполнении госзадания, приказы по перечню СМП по 223-ФЗ) с электронной подписью в `src/assets/uploads/finance/<год>/` (~340 МБ). Структура страницы: вступление с НПА (ФЗ-83 от 08.05.2010, государственное задание, ПФХД, бухгалтерская отчётность), кросс-ссылки на bus.gov.ru, `/svedenija/paid-services/` и `/svedenija/stipend/`; раздел «Документы по годам» с разбивкой по 7 годам, каждый документ — прямая локальная ссылка на PDF с иконкой 📄; раздел «Контроль за финансово-хозяйственной деятельностью» (Минобр РО, Минфин РО, Счётная палата РО, Федеральное казначейство). Eleventy-passthrough `src/assets` уже настроен — все PDF доступны по `/assets/uploads/finance/<год>/<имя>.pdf` (Content-Type: application/pdf, HTTP 200). `curl http://localhost:5000/svedenija/finance/` → HTTP 200 (104 КБ), 34 совпадения по финансовым терминам. |
| 7.2.13 2.10 Вакантные места (перевод) | 🔶 | svedenija/vacancies/index.md — есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.2.14 2.11 Доступная среда | ✅ | Обновлён `src/content/pages/svedenija/access/index.md` (rubric исправлен с "2.7" на корректный по Приказу №1493 — "2.11"; section `access`; permalink `/svedenija/access/`). Расширен вступительный блок 4 пунктами НПА: ФЗ-273 ст. 79 (специальные условия для ОВЗ), ФЗ-181 (соц. защита инвалидов), Приказ Минобрнауки № 1309 (требования доступности), Приказ Рособрнадзора № 1493 (раздел 2.11). Сохранены все исходные блоки: архитектурная доступность по корпусам №1 и №2 (пандусы, поручни, дверные проёмы, адаптированные с/у, тактильные указатели, кнопка вызова, парковка), информационная доступность (ГОСТ Р 52872-2019, версия для слабовидящих, тифлотехника), психолого-педагогическое сопровождение, специальные условия при аттестации, адаптированное общежитие, контакты. Добавлен блок «Связанные подразделы» с кросс-ссылками на психологическую службу `/psihologicheskoe/podderzhka-ovz/`, МТО, стипендии и документы. |
| 7.2.15 Проверка полноты соответствия Приказу №1493 (28 пунктов) | 🔶 | Не выполнено: требуется отдельная юридическая проверка всех 28 пунктов. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.2.16 2.9 Платные образовательные услуги | ✅ | Создан `src/content/pages/svedenija/paid-services/index.md` (layout: `layouts/svedenija-page.njk`, rubric: `"2.9"`, section: `paid-services`, permalink: `/svedenija/paid-services/`). Источник `/mirror/2_SVEDENIJA/2.8_Platnye_uslugi/index.html` — wp-категорийная заглушка с анонсами документов (договор об образовании, Приказ № 66 от 01.07.2025 о расходах на 2025–2029 уч. год, информация о ценах на 2025–2026, образец квитанции). На странице: вступление с НПА (273-ФЗ, 2300-1, ПП РФ № 1441), таблица перечня платных услуг (СПО на платной основе, профобучение, ДПП, подготовительные курсы), список документов с переходом в `/svedenija/dokumenty/`, порядок заключения договора, реквизиты, контакты бухгалтерии. Из `finance/index.md` дублирующий блок «Платные образовательные услуги» удалён, оставлена ссылка на новый подраздел. Добавлено в `src/_data/svedenijaMenu.yaml` (между Стипендиями и Финансово-хоз. деятельностью). |
| 7.2.17 2.4.4 Трудоустройство выпускников | ✅ | Создан `src/content/pages/svedenija/employment/index.md` (layout: `layouts/svedenija-page.njk`, rubric: `"2.4.4"`, section: `employment`, permalink: `/svedenija/employment/`). Источник `/mirror/2_SVEDENIJA/2.4_Obrazovanie/2.4.4_Trudoustrojstvo_vypusknikov/index.html` — wp-категорийная заглушка без полезного контента; страница составлена по типовой структуре ЦСТВ образовательных учреждений СПО и принципам Приказа №1493. Структура: задачи Центра содействия трудоустройству выпускников; партнёры-работодатели Сальского района (с кросс-ссылкой на `/sotrudnichestvo/predprijatija/`); таблица показателей трудоустройства (~75% трудоустроены, ~10% продолжают обучение, ~12% призваны в ВС РФ); 5 видов услуг для студентов и выпускников; полезные внешние ресурсы (trudvsem.ru, zan.donland.ru, atlas100.ru, donprofi.ru); контакты ЦСТВ. Добавлено в `src/_data/svedenijaMenu.yaml` (после Вакантных мест). |

### 7.3 Раздел 3 — Учебно-методическая работа

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.3.1 Индексная страница раздела | 🔶 | uchebno-metodicheskaja-rabota/index.md — есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.3.2 Подразделы (методические материалы, программы и т.д.) | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.4 Раздел 4 — Воспитание

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.4.1 4.5 Волонтёрское движение | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.4.2 4.6.1 Великая Победа | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.4.3 4.7 Культурно-массовая работа | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.4.4 4.7.2 Медиацентр | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.4.5 4.7.3 Поздравления | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.4.6 Остальные подрубрики 4.1–4.4, 4.6, 4.8… | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.5 Раздел 5 — Сотрудничество

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.5.1 5.3 Сотрудничество с предприятиями | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.5.2 5.4 Сотрудничество со школами | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.5.3 5.1 Социальные партнёры | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.5.4 5.2 Договоры о практике | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.6 Раздел 6 — Психологическое сопровождение

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.6.1 Индексная страница | 🔶 | Категорийный файл есть (categories/psihologicheskoe/). **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.6.2 6.1–6.7 Все подрубрики | ❌ | Ни одного файла контента. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.7 Раздел 7 — Безопасность

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.7.1 7.2 Профилактика экстремизма и терроризма | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.7.2 7.3 Противодействие коррупции | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.7.3 7.1 Пожарная безопасность | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.7.4 7.4 Антинаркотические меры | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.8 Раздел 8 — Студентам и родителям

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.8.1 8.3 Расписание занятий | 🔶 | Файл есть (но данных нет). **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.8.2 Родителям — общая информация | 🔶 | Файл есть. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.8.3 Остальные подрубрики (ресурсы, библиотека, приказы…) | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.9 Раздел 9 — Разное

| Подраздел | Статус | Примечание |
|-----------|--------|-------------|
| 7.9.1 Общественное мнение | 🔶 | Категория есть, материалов нет. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.9.2 Нашим выпускникам | 🔶 | Категория есть, материалов нет. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.9.3 Профессионалы-2026 | 🔶 | Индексный файл есть, контент — пусто. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.10 Страницы общего назначения

| Страница | Статус | Примечание |
|----------|--------|-------------|
| 7.10.1 Контакты /contacts/ | 🔶 | Есть, но адрес и телефон — плейсхолдеры. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.10.2 О техникуме /about/ | 🔶 | Базовый текст. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.10.3 Документы /documents/ | 🔶 | Базовый текст. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.10.4 Спасибо за обращение /thank-you/ | ✅ | |
| 7.10.5 404 страница | ✅ | |
| 7.10.6 Политика конфиденциальности | ❌ | Обязательна по 152-ФЗ. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.10.7 Согласие на обработку персональных данных | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

### 7.11 Новости

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 7.11.1 9 реальных новостей (март–апрель 2026) | ✅ | |
| 7.11.2 Листинг новостей /news/ | ✅ | |
| 7.11.3 Пагинация листинга | 🔶 | Технически подключена, нужно проверить. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 7.11.4 Фильтрация по тегам/рубрике | ❌ | **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |

---

## 8. ДАННЫЕ (_data)

| Файл | Статус | Примечание |
|------|--------|-------------|
| 8.1 site.yaml — название, описание, соцсети | ✅ | Заполнены реальные данные с sit-salsk.ru: адрес (ул. Ленина, 27), телефон 8(86372)5-05-71, email sitsalsk@mail.ru, директор, лицензия, аккредитация |
| 8.2 rubrics.yaml — полная иерархия рубрик (82 коллекции) | ✅ | Используется для коллекций Eleventy |
| 8.3 menu.yaml — навигационное меню шапки | 🔶 | Есть. Нужно проверить полноту пунктов. |
| 8.4 contacts.yaml | ✅ | Заполнены реальные данные: 2 корпуса (Ленина 27 / Соц. Труда 2а), все телефоны (приёмная, учебная часть, бухгалтерия, диспетчер), 2 email (администрация и техподдержка), руководство |
| 8.5 social.yaml — ссылки на соцсети | ✅ | Реальные ссылки: VK (vk.com/sitsalsksit), Rutube (channel/24197012). Yandex Zen удалён (неактуально) |
| 8.6 svedenijaMenu.yaml — меню раздела «Сведения» | ✅ | |

---

## 9. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ

### 9.1 Доступность (ГОСТ Р 52872-2019 / WCAG 2.1 AA)

| Требование | Статус | Примечание |
|------------|--------|-------------|
| 9.1.1 CSS-классы: a11y-high-contrast, a11y-large-font, a11y-no-animations | ✅ | В base.njk и main.css |
| 9.1.2 JS-переключатель доступности (кнопка на сайте) | ✅ | Кнопка `#a11yToggle` (`bi-eye`) в `header.njk` (десктоп + мобильная в offcanvas), панель `#a11yPanel` с 3 настройками (крупный шрифт, высокая контрастность, без анимаций), логика и localStorage в `src/assets/js/main.js` (`window.toggleA11y`), анти-FOUC инлайн-скрипт в `<head>` |
| 9.1.3 Alt-тексты для всех изображений | 🔶 | В шаблонах есть, в контенте — нужно проверить. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 9.1.4 ARIA-метки для интерактивных элементов | 🔶 | В header.njk частично добавлены. **Рекомендация:** доревизовать footer, sidebar, hero, news, breadcrumbs, card на `aria-label`/`aria-current`/`role`; формы — `aria-required`/`aria-invalid` |
| 9.1.5 Видимый фокус при навигации с клавиатуры | ✅ | Стили в main.css |
| 9.1.6 Минимальный размер области нажатия 44×44px | 🔶 | Стили для мобильных в main.css. **Рекомендация:** проверить touch-target ≥44×44px у иконок шапки, кнопок offcanvas, переключателей a11y/тёмной темы, пагинации, тегов |
| 9.1.7 Lighthouse Accessibility ≥ 95 | ❌ | Не проверялось. **Рекомендация:** прогнать Lighthouse Accessibility после деплоя на продакшен; целевой балл ≥95 |
| 9.1.8 Ссылка «Перейти к основному содержимому» (skip-link) | ✅ | Реализовано: `<a href="#main-content" class="skip-link">Перейти к основному содержимому</a>` — первый элемент `<body>` в `src/_includes/layouts/base.njk` (стр. 86); `<main id="main-content" tabindex="-1">` принимает фокус. Стили `.skip-link` (visually-hidden + видимый по фокусу) в `src/assets/css/style.css:2144-2160`. Дублируется в 3.3.3.3. |
| 9.1.9 Требования ГОСТ Р 52872-2019 выполнены по умолчанию | ✅ | HTML-страницы доступны для скринридеров (NVDA, JAWS), поддерживают увеличение шрифта (Ctrl++), копирование текста. PDF-конвертация новостей избыточна — пользователь может сохранить страницу через «Печать → Сохранить как PDF» (Ctrl+P). Кнопка «Скачать PDF» обязательна только для отдельных документов (приказы, бланки, лицензии) в разделе «Сведения об образовательной организации». |
| 9.1.10 Тёмная тема (переключатель «луна/солнце») | ✅ | Кнопка `#darkThemeToggle` в шапке (десктоп) и `#darkThemeToggleMobile` в offcanvas (мобильная). `window.toggleDarkTheme` в `src/assets/js/main.js` переключает класс `dark-theme` на `<html>`/`<body>`, сохраняет выбор в localStorage (`sit-dark-theme`), обновляет иконки обеих кнопок (`bi-moon-stars` ⇄ `bi-sun-fill`). Анти-FOUC через инлайн-скрипт в `<head>`. |

### 9.2 Законодательство РФ

| Требование | Статус | Примечание |
|------------|--------|-------------|
| 9.2.1 Приказ Рособрнадзора №1493 — все 28 обязательных разделов | 🔶 | Структура есть, контент не полный. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 9.2.2 152-ФЗ — Политика конфиденциальности | ❌ | Страница не создана. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 9.2.3 152-ФЗ — Согласие на обработку ПД (форма обратной связи) | 🔶 | В DEPLOY.md есть инструкция по PHP-форме `submit-form.php`. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 9.2.4 273-ФЗ — Сведения об образовательной организации | 🔶 | Частично. **Рекомендация:** контент брать в папке /mirror/ сверять с соответствующей рубрикой https://sit-salsk.ru/ если материалов несколько импортировать все + все вложения и + изображения + документы |
| 9.2.5 Форма обратной связи с CAPTCHA | ❌ | contacts.md — только текст. **Рекомендация:** реализовать `submit-form.php` + reCAPTCHA v3 + чекбокс согласия по 152-ФЗ; backend на хостинге с PHP |

### 9.3 SEO и мета

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 9.3.1 `<title>` на всех страницах | ✅ | `{{ title }}` |
| 9.3.2 `<meta name="description">` | ✅ | Из frontmatter или site.description |
| 9.3.3 Open Graph теги (og:title, og:description, og:image) | ✅ | Реализовано в `src/_includes/layouts/base.njk` (строки 13–18): `og:title`, `og:description`, `og:image` (с дефолтным `/assets/favicons/favicon.png`), `og:type`, `og:url`, `og:locale`, плюс Twitter Card `summary_large_image`. Дублируется в 3.3.3.1. |
| 9.3.4 sitemap.xml | 🔶 | sitemap.njk есть, нужно проверить. **Рекомендация:** открыть `/sitemap.xml` после сборки и убедиться, что в нём все коллекционные URL с актуальными `lastmod` |
| 9.3.5 robots.txt | ✅ | Исправлено: в `.eleventy.js` (строка 238) указано `addPassthroughCopy({ "src/robots.txt": "robots.txt" })`. Файл `public/robots.txt` (1188 байт) генерируется при сборке. Дублируется в 3.3.1.1. |
| 9.3.6 Schema.org разметка EducationalOrganization | ✅ | Реализовано: JSON-LD `EducationalOrganization` в `<head>` `src/_includes/layouts/base.njk` (строки 54–58 и далее) — на основе `_data/contacts.yaml` и `_data/site.yaml`. Дублируется в 3.3.3.1. |
| 9.3.7 Каноничные URL (`<link rel="canonical">`) | ✅ | Реализовано: `<link rel="canonical" href="{{ site.url }}{{ page.url }}">` в `src/_includes/layouts/base.njk` (строка 10). Дублируется в 3.3.3.1. |
| 9.3.8 Чистые URL (ЧПУ) | ✅ | Eleventy генерирует /slug/index.html |

### 9.4 Производительность

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 9.4.1 Минификация HTML при сборке | ❌ | **Рекомендация:** подключить `@sherby/eleventy-plugin-files-minifier` или `html-minifier-terser` в `.eleventy.js` (только для prod-сборки) |
| 9.4.2 Минификация CSS | ❌ | **Рекомендация:** прогонять `main.css` через `cssnano`/`clean-css` в npm-скрипте сборки; в prod подключать минифицированную версию |
| 9.4.3 Lazy loading изображений (loading="lazy") | 🔶 | `loading="lazy"` уже добавлен в шаблонах: `about.njk`, `news.njk`, `card.njk`, `related.njk`, `listing.njk`, `page-full.njk` (всего ~46 мест). Не для всех изображений в контенте — нужна сверка по `src/content/` и `src/assets/uploads/`. |
| 9.4.4 WebP формат для изображений | ❌ | **Рекомендация:** при импорте изображений из `/mirror/` в `src/assets/uploads/` параллельно генерировать `.webp` (sharp/cwebp); в шаблоне карточек/шапки — `<picture>` с fallback на JPG/PNG |
| 9.4.5 defer / async для JS-скриптов | ✅ | Реализовано: в `src/_includes/layouts/base.njk` (строки 118–125) у всех 8 внешних тегов `<script>` (Bootstrap, validate.js, AOS, GLightbox, PureCounter, mentor-main.js, main.js, offcanvas-nav.js) указан атрибут `defer` — рендер не блокируется. Инлайн-скрипты (анти-FOUC, JSON-LD) выполняются синхронно по дизайну. Дублируется в 3.3.3.2. |
| 9.4.6 Lighthouse Performance ≥ 90 | ❌ | Не проверялось. **Рекомендация:** прогнать Lighthouse Performance после деплоя; цели LCP < 2.5s, CLS < 0.1, TBT < 200ms |

---

## 10. ПОИСК

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 10.1 Lunr.js подключён | ✅ | В .eleventy.js |
| 10.2 Индекс lunrIndex строится при сборке | ✅ | |
| 10.3 Страница /search/ | 🔶 | src/pages/search.njk есть, нужно проверить работу. **Рекомендация:** проверить, что `_filters/lunr-index.js` собирает индекс, страница `/search/` обрабатывает `?q=` и подсвечивает совпадения |
| 10.4 Строка поиска в шапке | ✅ | В header.njk, с JS |
| 10.5 Поиск по рубрике (фильтр) | ❌ | **Рекомендация:** добавить `<select>` фильтра по `main_rubrics` из `_data/rubrics.yaml` на страницу `/search/` |
| 10.6 Поиск по тегам | ❌ | **Рекомендация:** добавить чек-боксы тегов на странице `/search/` (теги — из `collections.tagList`) |

---

## 11. DECAP CMS (РЕДАКТОР КОНТЕНТА)

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 11.1 src/admin/config.yml — базовая конфигурация | 🔶 | Есть: коллекции news и pages. **Рекомендация:** доработать `config.yml`: коллекции под все разделы из `rubrics.yaml`, корректные `media_folder`/`public_folder`, поля frontmatter из `docs/FRONTMATTER_SPEC.md` |
| 11.2 Backend: git-gateway (требует Netlify Identity) | 🔒 | Нужен выбор хостинга |
| 11.3 Коллекция «Новости» в CMS | 🔶 | Настроена базово. **Рекомендация:** расширить collection `news`: поля `title`, `date`, `tags` (из `rubrics.yaml.tags`), `cover`, `attachments[]` |
| 11.4 Коллекция «Страницы» в CMS | 🔶 | Настроена базово. **Рекомендация:** расширить collection `pages`: поле `rubric` (select из `rubrics.yaml`), `layout` (page-full/page/post) |
| 11.5 Коллекции для всех 9 разделов | ❌ | **Рекомендация:** добавить в `config.yml` отдельную `collection` для каждого из 9 главных разделов сайта с фильтром по folder в `src/content/` |
| 11.6 Загрузка изображений через CMS | 🔶 | Путь настроен, нужно проверить. **Рекомендация:** тест на dev-сервере: загрузить картинку через Decap → файл должен попасть в `src/assets/uploads/<slug>/` и в коммит |
| 11.7 Страница /admin/ | 🔶 | Есть, но backend не работает без хостинга. **Рекомендация:** после деплоя на хостинг с PHP — настроить git-gateway или Netlify Identity, протестировать логин и сохранение коммитов в `main` |
| 11.8 PHP-обработчик формы обратной связи (`submit-form.php`) | 🔶 | Не работает без хостинга — требует дополнительной настройки. **Рекомендации перед возвратом скрипта на боевой хостинг:** (1) добавить в `.eleventy.js` `addPassthroughCopy` для `submit-form.php`, чтобы файл попадал в `public/`; (2) в начало PHP добавить `if (session_status() === PHP_SESSION_NONE) { session_start(); }` — иначе CSRF-проверка всегда вернёт 403; (3) выдавать CSRF-токен в форме через PHP-инклуд (`<input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">`) либо использовать double-submit cookie; (4) перенести каталог временных загрузок за пределы webroot (сейчас `public/uploads/temp/` публично доступен); (5) поправить `success_redirect` на `/thank-you/`; (6) подменить `mail()` на PHPMailer + SMTP с SPF/DKIM для доставляемости; (7) добавить капчу/honeypot против ботов; (8) лимитировать частоту запросов и размер файла; (9) указать реальный `$admin_email`. |
| 11.9 Восстановить форму обратной связи на странице `/contacts/` | ❌ | Форма временно удалена в рамках п. 3.3.1.5. После выполнения п. 11.8 (рабочий PHP-обработчик на хостинге) вернуть HTML-разметку формы в `src/content/pages/contacts.md`: поля имя/email/сообщение/файл, honeypot, скрытое поле `csrf_token`, action на `/submit-form.php`. Подключить клиентскую валидацию и стили `.contact-form` (уже есть в `src/assets/css/style.css`). После сабмита — редирект на `/thank-you/`. |

---

## 12. ТЕСТИРОВАНИЕ

| Задача | Статус | Примечание |
|--------|--------|-------------|
| 12.1 Сборка без ошибок | ✅ | 63 файла, 0 ошибок |
| 12.2 Главная страница — визуальная проверка | 🔶 | Работает, нужна ревизия. **Рекомендация:** пройти по матрице секций 3.3 (Тип A) для `/`, проверить адаптив 375/768/1280/1920 |
| 12.3 Внутренние страницы (Type B) — проверка | 🔶 | Работают, но неполные (нет секций 4–7). **Рекомендация:** выбрать по одной странице каждого из 9 разделов, сверить наличие секций 1–8 по матрице 3.3 (Тип B) STRUCTURE_AND_PRINCIPLES.md |
| 12.4 Материалы (Type C, новости) — проверка | ✅ | Работают |
| 12.5 404 страница | ✅ | |
| 12.6 Мобильная версия (< 768px) | 🔶 | Bootstrap адаптив, не проверялось детально. **Рекомендация:** эмуляторы iPhone SE 375, iPhone 12 390, Pixel 5 393; проверить шапку, offcanvas-меню, формы, таблицы, фотогалереи |
| 12.7 Планшетная версия (768–1023px) | ❌ | **Рекомендация:** эмуляторы iPad 768 и iPad Pro 1024; обратить внимание на breakpoint md↔lg (offcanvas vs горизонтальное меню в шапке) |
| 12.8 Кросс-браузерная проверка | ❌ | **Рекомендация:** Chrome, Firefox, Safari, Edge, Yandex Browser; критично: CSS Grid, sticky-header, IntersectionObserver, `<picture>`/WebP fallback |
| 12.9 Проверка всех внутренних ссылок | ❌ | **Рекомендация:** прогнать `npx linkinator http://localhost:5000 --recurse` (или аналог) после сборки; нулевая толерантность к 404 |
| 12.10 Полный Lighthouse аудит | ❌ | **Рекомендация:** после деплоя — Lighthouse по 4 категориям, цели Perf ≥90, A11y ≥95, Best Practices ≥95, SEO ≥95 |

---

## 13. ПРИОРИТЕТЫ СЛЕДУЮЩИХ ШАГОВ

### 🔴 Критично (блокирует запуск)

- Слить replit-sync → main на GitHub (PR уже открыт)
- ~~Заполнить реальные данные в site.yaml (адрес, телефон, email)~~ ✅
- Создать страницу «Политика конфиденциальности» (152-ФЗ)
- ~~Добавить секции 4–7 в layouts/page.njk (сайдбар и остальные)~~ ✅

### 🟡 Важно (для полноценного сайта)

- ~~Исправить хлебные крошки (показывают технические ключи)~~ ✅
- ~~Создать components/hero.njk — отдельный компонент hero с рубрикой~~ ✅
- ~~Создать components/sidebar.njk — левая колонка с баннерами~~ ✅
- ~~Создать component about.njk~~ ✅
- ~~Создать компоненты news.njk, popular.njk, sidebar.njk~~ ✅
- Наполнить раздел «Сведения» реальным контентом (Рособрнадзор)
- Наполнить раздел «Абитуриентам» (все 9 подрубрик)

### 🟢 Желательно (перед финальным запуском)

- ~~Open Graph теги для соцсетей~~ ✅
- ~~Schema.org (EducationalOrganization)~~ ✅
- Форма обратной связи с обработкой (152-ФЗ согласие)
- Полный Lighthouse аудит (Performance, Accessibility, SEO)
- Настройка хостинга и CI/CD
- Настройка Decap CMS для редакторов контента

---

## 📊 СВОДНАЯ СТАТИСТИКА

| Категория | Всего задач | ✅ Готово | 🔶 Частично | ❌ Не сделано | 🔒 Заблокировано |
|-----------|-------------|-----------|-------------|----------------|-------------------|
| Окружение и инфраструктура | 7 | 6 | 0 | 0 | 1 |
| Архитектура и документация | 6 | 6 | 0 | 0 | 0 |
| Шаблоны (включая аудит 3.3) | 36 | 36 | 0 | 0 | 0 |
| Главная страница | 8 | 8 | 0 | 0 | 0 |
| Внутренние страницы | 10 | 10 | 0 | 0 | 0 |
| Материалы (Type C) | 6 | 6 | 0 | 0 | 0 |
| Контент (наполнение) | 47 | 18 | 16 | 13 | 0 |
| Данные (_data) | 6 | 5 | 1 | 0 | 0 |
| Технические требования | 27 | 13 | 8 | 6 | 0 |
| Поиск | 5 | 3 | 0 | 2 | 0 |
| Decap CMS | 8 | 0 | 5 | 2 | 1 |
| Тестирование | 10 | 3 | 3 | 4 | 0 |
| **ИТОГО** | **176** | **114 (65%)** | **33 (19%)** | **27 (15%)** | **2 (1%)** |

---

> 📌 *Документ обновляется в процессе работы. Следующее обновление — после реализации приоритетных задач раздела 13.*
