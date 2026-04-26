# Аудит `src/assets/css/style.css` (CHECKLIST 2.7.3)

**Дата:** 2026-04-26
**Файл:** `src/assets/css/style.css` — 5337 строк, **643 уникальных селектора**.  
**Сравнение с:** `src/styles/main.css` — 7283 строк, **837 уникальных селекторов**.  
**Контекст:** `style.css` объявлен deprecated (см. § 2.4 STRUCTURE_AND_PRINCIPLES.md), физически не подключён ни в одном шаблоне (`rg 'assets/css/style\.css' src` = 0 совпадений). Цель аудита — подготовить разметку для удаления файла без регрессий (задача 2.7.4 в CHECKLIST).

## Сводка

| Категория | Что это | Селекторов | Действие |
|---|---|---:|---|
| **А — Дубликаты** | Селектор есть и в `style.css`, и в `main.css` | 60 | удалить из `style.css` |
| ↳ из них с идентичным телом | Совпадает 1-в-1 | 3 | без риска |
| ↳ из них с разным телом | Конфликтующие версии | 57 | удалить из `style.css` (активна версия из `main.css`) |
| **Б — Уникальные нужные (классовые)** | Только в `style.css`, имена классов используются в шаблонах | 317 | мигрировать в `main.css` (после ручной проверки) |
| **Б — Типовые/псевдо** | Селекторы без классов (`*`, `html`, `button`, медиа-запросы) | 23 | проверить вручную, по большей части дубли с `main.css` через типы |
| **В — Мёртвый код** | Имя класса не встречается ни в одном шаблоне (`src/`, `_mentor/`) | 243 | удалить безусловно |
| **Итого** | | 643 | |

---

## Категория А — дубликаты с `main.css` (60)

Селектор присутствует в обоих файлах. После удаления `style.css` активной останется версия из `main.css`. Проверять каждое тело отдельно не нужно — `style.css` не подключён, на сайт уже не влияет.

### А.1. Идентичные тела правил (3) — безопасное удаление

- `.a11y-panel[hidden]`
- `.sidebar-image-banners`
- `.post-meta__item`

### А.2. Конфликтующие тела правил (57) — версия из `main.css` уже активна

> Для каждого селектора показаны первые 140 символов тела правила в обоих файлах. На сайт сейчас применяется столбец **main.css**, столбец **style.css** — мёртвый код.

| Селектор | style.css (мёртвое) | main.css (активное) |
|---|---|---|
| `:root` | --sit-primary: #0d4a6b; --sit-accent: #e67e22; --sit-accent-hover: #d35400; --sit-border: #dee2e6; --focus-outline: 0.12… | --home-img-radius: 0.375rem; --home-img-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075);… |
| `body` | font-family: var(--font-family-base); font-size: var(--font-size-base); line-height: var(--line-height-base); color: var… | transition: background-color 0.3s ease, color 0.2s ease;… |
| `a` | color: var(--text-link); text-decoration: none; transition: color var(--transition-fast);… | color: var(--accent-color); text-decoration: none; transition: 0.3s;… |
| `a:hover` | color: var(--text-link-hover);… | color: color-mix(in srgb, var(--accent-color), transparent 25%); text-decoration: none;… |
| `@media (min-width: 768px)` | .news-grid { grid-template-columns: repeat(2, 1fr); } .news-card.featured { grid-column: 1 / -1; } .news-card.featured .… | .sidebar-image-banners { gap: 1.75rem; }… |
| `.hero` | background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%); color: var(--text-light);… | width: 100%; min-height: 80vh; position: relative; padding: 80px 0; display: flex; align-items: center; justify-content:… |
| `.hero p` | font-size: var(--font-size-lg); margin-bottom: var(--spacing-xl); opacity: 0.9;… | color: color-mix(in srgb, var(--default-color), transparent 20%); margin: 10px 0 0 0; font-size: 24px;… |
| `.section-title` | font-size: clamp(1.5rem, 3vw, 2rem); color: var(--color-primary); margin-bottom: 2rem; padding-bottom: 0.5rem; border-bo… | padding-bottom: 60px; position: relative;… |
| `@media (max-width: 992px)` | .rubric-selector { margin-left: 0; margin-top: var(--spacing-md); width: 100%; } .rubric-selector-label { display: block… | .tabs .nav-link { border: 0; padding: 15px; } .tabs .nav-link.active { color: var(--accent-color); background: var(--acc… |
| `@media (max-width: 768px)` | .hero-slider { height: 400px; } .info-cards-grid { grid-template-columns: 1fr; } .quick-access-grid { grid-template-colu… | .hero .site-title { letter-spacing: 0.04em; }… |
| `@media (max-width: 767px)` | .post-title { font-size: 1.35rem; } .post-meta { gap: 0.4rem 0.85rem; font-size: 0.8rem; } .post-cover__img { max-height… | .page-hero { min-height: 200px; } .page-hero__title { font-size: 1.5rem; } .page-hero__divider { width: 80px; margin: 12… |
| `.site-footer` | position: relative; background: radial-gradient(circle at 0% 0%, rgba(26, 95, 138, 0.35) 0%, transparent 45%), radial-gr… | --footer-bg-1: color-mix(in srgb, var(--accent-color), #ffffff 92%); --footer-bg-2: color-mix(in srgb, var(--accent-colo… |
| `@media (max-width: 575px)` | .site-footer { padding-top: 2.5rem; } .footer-bottom { flex-direction: column; text-align: center; align-items: center; … | .section-context { padding: 1rem 0 0.75rem; } .section-main { padding: 1.25rem 0 1.75rem; } .section-related { padding: … |
| `.skip-link` | position: absolute; top: -100%; left: 0; background: #0d4a6b; color: #fff; padding: 1rem 1.5rem; z-index: 10000; text-de… | position: absolute; top: -100%; left: 1rem; z-index: 9999; padding: 0.5rem 1rem; background: #2e7d32; color: #fff; font-… |
| `.skip-link:focus` | top: 0; outline: 2px solid #ffd700; outline-offset: 2px;… | top: 0; outline: 3px solid #ff0; outline-offset: 2px;… |
| `.a11y-panel` | position: fixed; bottom: 80px; right: 20px; z-index: 9999; background: #fff; border: 2px solid #0d4a6b; border-radius: 1… | z-index: 1060; min-width: 220px; background: var(--surface-color, #fff); border: 1.5px solid color-mix(in srgb, var(--ac… |
| `.a11y-options` | display: flex; flex-direction: column; gap: 0.75rem;… | display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 0.85rem;… |
| `.a11y-option` | display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.5rem; border-radius: 4px; transition: back… | display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.85rem; color: var(--default-color); padd… |
| `.a11y-option:hover` | background: #f8f9fa;… | background: color-mix(in srgb, var(--accent-color), transparent 88%);… |
| `.a11y-option input[type="checkbox"]` | width: 20px; height: 20px; cursor: pointer; accent-color: #0d4a6b;… | width: 16px; height: 16px; accent-color: var(--accent-color); cursor: pointer; flex-shrink: 0;… |
| `.a11y-reset` | background: #6c757d; color: #fff;… | flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; border-radius: 6px; border: 1.5px solid color-mix(in srgb, var(--d… |
| `.a11y-close` | background: #0d4a6b; color: #fff;… | flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; border-radius: 6px; border: 1.5px solid color-mix(in srgb, var(--d… |
| `.a11y-reset:hover` | background: #5a6268; outline: 2px solid #0d4a6b; outline-offset: 2px;… | background: color-mix(in srgb, var(--accent-color), transparent 88%); border-color: var(--accent-color);… |
| `.a11y-close:hover` | background: #1a5f8a; outline: 2px solid #ffd700; outline-offset: 2px;… | background: color-mix(in srgb, var(--accent-color), transparent 88%); border-color: var(--accent-color);… |
| `@media (max-width: 480px)` | .post-share { padding: 1rem 0.85rem 1.1rem; border-radius: 12px; } .post-share__list { grid-template-columns: repeat(2, … | .a11y-panel { right: -0.5rem; min-width: 200px; }… |
| `@media (prefers-reduced-motion: reduce)` | .post-share__tag, .post-share__icon { transition: none; } .post-share__tag:hover, .post-share__tag:focus-visible { trans… | .oc-side-panel, .oc-side-panel.is-open, #ocPanel3.is-open { transition: visibility 0s linear 0s; transition-delay: 0s; }… |
| `@media (min-width: 992px)` | .page-with-sidebar { display: grid; grid-template-columns: 30% 1fr; gap: 2rem; align-items: start; } .component-sidebar … | .home-with-sidebar { gap: 4rem; } .home-bg { padding-top: 3.5rem; padding-bottom: 3.5rem; }… |
| `.read-more` | color: var(--color-accent); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: color 0.3s ease;… | background: var(--accent-color); color: var(--contrast-color); font-family: var(--heading-font); font-weight: 500; font-… |
| `.read-more:hover` | color: var(--color-accent-hover);… | background: color-mix(in srgb, var(--accent-color), transparent 20%); color: var(--contrast-color); padding-right: 19px;… |
| `.sidebar` | display: flex; flex-direction: column; gap: 1.5rem;… | position: sticky; top: 88px; display: flex; flex-direction: column; gap: 1.25rem;… |
| `.component-sidebar` | display: flex; flex-direction: column; gap: 1rem; width: 100%;… | background-color: color-mix(in srgb, var(--accent-color) 10%, transparent); border-radius: var(--home-img-radius); paddi… |
| `.sidebar-image-banner` | display: block; position: relative; border-radius: 16px; overflow: hidden; text-decoration: none; background: var(--surf… | border-radius: var(--home-img-radius); overflow: hidden; box-shadow: var(--home-img-shadow); display: block;… |
| `.sidebar-image-banner__figure` | margin: 0; display: block; position: relative;… | margin: 0; border-radius: inherit; overflow: hidden;… |
| `.sidebar-image-banner__img` | display: block; width: 100%; height: auto; object-fit: cover; transition: transform .4s ease;… | display: block; width: 100%; height: auto; border-radius: var(--home-img-radius);… |
| `@media (max-width: 991px)` | .component-sidebar { margin-top: 2rem; }… | .sidebar { position: static; top: auto; }… |
| `.post-title` | font-size: clamp(1.4rem, 4vw, 2.2rem); font-weight: 700; line-height: 1.25; margin: 0.5rem 0 0.75rem; color: var(--text-… | font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; color: var(--heading-color, #1a2e1a); margin: 0 0 0.6rem; line-he… |
| `.post-meta` | display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25re… | display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.875rem; color: var(--text-muted, #5a6a5a);… |
| `.post-date` | color: var(--text-muted);… | font-weight: 500;… |
| `.post-content h2` | margin-top: 2rem; margin-bottom: 0.75rem; font-weight: 700; line-height: 1.3;… | font-size: 1.35rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; color: var(--heading-color, #1a2e1a);… |
| `.post-content h3` | margin-top: 2rem; margin-bottom: 0.75rem; font-weight: 700; line-height: 1.3;… | font-size: 1.15rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--heading-color, #1a2e1a);… |
| `.post-attachments` | margin-top: 2rem; padding: 1.25rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-rad… | margin-top: 2rem; padding: 1.25rem 1.5rem; background: color-mix(in srgb, var(--accent-color, #5fcf80), var(--surface-co… |
| `.attachments-title` | font-size: 1rem; font-weight: 700; margin-bottom: 0.85rem; color: var(--text-primary); display: flex; align-items: cente… | font-size: 1rem; font-weight: 700; margin: 0 0 0.85rem; display: flex; align-items: center; gap: 0.4rem;… |
| `.attachments-list` | list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem;… | list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.45rem;… |
| `.attachment-link` | display: flex; align-items: center; gap: 0.55rem; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); text-decorat… | display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: var(--text-color, #333); font-size… |
| `.attachment-link:hover` | background: color-mix(in srgb, var(--color-primary) 8%, transparent); color: var(--color-primary);… | background: color-mix(in srgb, var(--accent-color, #5fcf80), transparent 80%); color: var(--heading-color, #1a2e1a);… |
| `.attachment-icon` | font-size: 1.4rem; flex-shrink: 0;… | font-size: 1.15rem;… |
| `.attachment-icon--pdf` | color: #e74c3c;… | color: #d32f2f;… |
| `.attachment-icon--doc` | color: #2980b9;… | color: #1565c0;… |
| `.attachment-icon--xls` | color: #27ae60;… | color: #2e7d32;… |
| `.attachment-icon--ppt` | color: #e67e22;… | color: #e65100;… |
| `.attachment-name` | flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;… | flex: 1;… |
| `.attachment-size` | flex-shrink: 0; font-size: 0.78rem; color: var(--text-muted);… | font-size: 0.8rem; color: var(--text-muted, #888);… |
| `.post-footer` | margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);… | margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #e0e0e0);… |
| `.post-tags` | display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem;… | display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; font-size: 0.875rem;… |
| `.tags-label` | font-size: 0.85rem; color: var(--text-muted); font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;… | color: var(--text-muted, #666); font-weight: 600;… |
| `.tag` | display: inline-block; padding: 0.2rem 0.7rem; font-size: 0.78rem; border-radius: 20px; background: var(--bg-card); bord… | display: inline-block; padding: 0.2rem 0.65rem; border-radius: 2rem; background: color-mix(in srgb, var(--accent-color, … |
| `.tag:hover` | background: var(--color-primary); color: #fff; border-color: var(--color-primary);… | background: color-mix(in srgb, var(--accent-color, #5fcf80), transparent 50%);… |

---

## Категория Б — уникальные правила, имена классов используются в шаблонах (317)

Эти селекторы есть **только** в `style.css`, но имена их классов встречаются в шаблонах `src/` или `_mentor/`. Перед удалением файла каждое такое правило надо вручную просмотреть и перенести в `main.css`, если оно действительно даёт визуальный вклад. Если в `main.css` уже есть эквивалентная стилизация — можно не переносить.

### Приоритетные кандидаты на перенос (упомянуты в CHECKLIST 2.7.3)

- `.content-sidebar-grid`
- `.content-sidebar-grid--full`

Используются в шаблонах: `src/_includes/layouts/listing.njk`, `src/_includes/svedenija-page.njk`. **Без переноса — внутренние страницы потеряют сетку 70/30.**

### Полный список Категории Б (317)

<details><summary>Раскрыть список</summary>

- `.a11y-close:focus`
- `.a11y-high-contrast .footer-bottom-links a`
- `.a11y-high-contrast .footer-contacts li`
- `.a11y-high-contrast .footer-copyright`
- `.a11y-high-contrast .footer-corp-address`
- `.a11y-high-contrast .footer-corp-card`
- `.a11y-high-contrast .footer-legal`
- `.a11y-high-contrast .footer-links li a`
- `.a11y-high-contrast .footer-meta`
- `.a11y-high-contrast .footer-phone-label`
- `.a11y-high-contrast .footer-tagline`
- `.a11y-high-contrast .site-footer`
- `.a11y-option span`
- `.a11y-panel h3`
- `.a11y-reset:focus`
- `.anti-corruption-page`
- `.attachment-item`
- `.btn`
- `.btn-outline`
- `.btn-outline:hover`
- `.btn-primary`
- `.btn-primary:hover`
- `.btn-secondary`
- `.btn-secondary:hover`
- `.btn-submit`
- `.btn-submit svg`
- `.btn-submit:focus`
- `.btn-submit:hover`
- `.btn:disabled`
- `.btn:focus-visible`
- `.card`
- `.card-content`
- `.card-image`
- `.card-text`
- `.card-title`
- `.card:hover`
- `.component-news--subrubrics .subrubric-card`
- `.component-news--subrubrics .subrubric-card:hover`
- `.component-news--subrubrics .subrubric-card__body`
- `.component-news--subrubrics .subrubric-card__desc`
- `.component-news--subrubrics .subrubric-card__img-wrap img`
- `.component-news--subrubrics .subrubric-card__link`
- `.component-news--subrubrics .subrubric-card__link:hover`
- `.component-news--subrubrics .subrubric-card__title`
- `.component-news--subrubrics .subrubric-card__title a`
- `.component-news--subrubrics .subrubric-card__title a:hover`
- `.component-popular .member`
- `.component-popular .member-icon`
- `.component-popular .member-icon-wrap`
- `.component-popular .member:hover .member-icon-wrap`
- `.contact-card`
- `.contact-cards`
- `.contact-label`
- `.contact-value`
- `.container`
- `.content-col`
- `.content-sidebar-grid`
- `.content-sidebar-grid--full`
- `.doc-date`
- `.doc-download`
- `.doc-download:focus`
- `.doc-download:hover`
- `.doc-info`
- `.doc-item`
- `.doc-item:hover`
- `.doc-list`
- `.doc-meta`
- `.doc-section`
- `.doc-section h2`
- `.doc-section-header`
- `.doc-section:hover`
- `.doc-signed`
- `.doc-size`
- `.doc-title`
- `.doc-type`
- `.doc-type.doc`
- `.doc-type.docx`
- `.doc-type.jpeg`
- `.doc-type.jpg`
- `.doc-type.pdf`
- `.doc-type.png`
- `.documents-download`
- `.documents-download:hover`
- `.documents-icon`
- `.documents-info`
- `.documents-item`
- `.documents-item:hover`
- `.documents-list`
- `.documents-meta`
- `.documents-title`
- `.dropdown-item`
- `.dropdown-item.active`
- `.dropdown-item.active::before`
- `.dropdown-item:focus`
- `.dropdown-item:hover`
- `.dropdown-menu`
- `.footer-bottom`
- `.footer-bottom-links`
- `.footer-bottom-links a`
- `.footer-bottom-links a:hover`
- `.footer-bottom-links span`
- `.footer-brand`
- `.footer-contact-hint`
- `.footer-contacts`
- `.footer-contacts li`
- `.footer-contacts li a`
- `.footer-contacts li a:hover`
- `.footer-contacts li i`
- `.footer-copyright`
- `.footer-corp-address`
- `.footer-corp-address i`
- `.footer-corp-card`
- `.footer-corp-card:hover`
- `.footer-corp-header`
- `.footer-corp-header i`
- `.footer-corp-phones`
- `.footer-corp-phones li`
- `.footer-corp-phones li:hover`
- `.footer-corp-title`
- `.footer-corps-wrap`
- `.footer-decoration`
- `.footer-heading`
- `.footer-heading::after`
- `.footer-legal`
- `.footer-legal-item strong`
- `.footer-links`
- `.footer-links li a`
- `.footer-links li a i`
- `.footer-links li a:focus-visible`
- `.footer-links li a:hover`
- `.footer-links li a:hover i`
- `.footer-logo`
- `.footer-logo-mark`
- `.footer-logo-name`
- `.footer-logo-org`
- `.footer-logo-text`
- `.footer-meta`
- `.footer-meta-item`
- `.footer-meta-item i`
- `.footer-nav`
- `.footer-phone-label`
- `.footer-phone-link`
- `.footer-phone-link:hover`
- `.footer-social`
- `.footer-social-link`
- `.footer-social-link:focus-visible`
- `.footer-social-link:hover`
- `.footer-tagline`
- `.footer-top`
- `.form-consent`
- `.form-consent a`
- `.form-consent a:hover`
- `.form-consent input[type="checkbox"]`
- `.form-consent label`
- `.form-group`
- `.form-group .error-message`
- `.form-group .required`
- `.form-group input`
- `.form-group input:focus`
- `.form-group input[type="email"]`
- `.form-group input[type="file"]`
- `.form-group input[type="tel"]`
- `.form-group input[type="text"]`
- `.form-group label`
- `.form-group select`
- `.form-group select:focus`
- `.form-group textarea`
- `.form-group textarea:focus`
- `.form-hint`
- `.hero h1`
- `.hero-slider`
- `.hero::before`
- `.honeypot`
- `.icon-download`
- `.info-card`
- `.info-card h3`
- `.info-card p`
- `.info-card:hover`
- `.info-item`
- `.info-item a`
- `.info-item a:hover`
- `.info-item i`
- `.leader-card`
- `.leader-card img`
- `.leader-card img.leader-photo`
- `.leader-card p`
- `.leader-card ul`
- `.leader-card ul li`
- `.nav-link`
- `.nav-link.active`
- `.nav-link.active::before`
- `.nav-link:focus`
- `.nav-link:hover`
- `.navbar`
- `.navbar-nav`
- `.news-card`
- `.news-card.featured`
- `.news-card:hover`
- `.news-grid`
- `.post-author`
- `.post-content`
- `.post-content a`
- `.post-content a:hover`
- `.post-content blockquote`
- `.post-content h4`
- `.post-content img`
- `.post-content p`
- `.post-content table`
- `.post-content td`
- `.post-content th`
- `.post-content tr:nth-child(even) td`
- `.post-cover`
- `.post-cover__img`
- `.post-meta__item i`
- `.post-reading-time`
- `.post-share`
- `.post-share__head`
- `.post-share__icon`
- `.post-share__icon .bi`
- `.post-share__icon svg`
- `.post-share__item`
- `.post-share__label`
- `.post-share__label .bi`
- `.post-share__list`
- `.post-share__tag`
- `.post-share__tag--btn`
- `.post-share__tag--copy:focus-visible .post-share__icon`
- `.post-share__tag--copy:hover .post-share__icon`
- `.post-share__tag--mail:focus-visible .post-share__icon`
- `.post-share__tag--mail:hover .post-share__icon`
- `.post-share__tag--more:focus-visible .post-share__icon`
- `.post-share__tag--more:hover .post-share__icon`
- `.post-share__tag--ok:focus-visible .post-share__icon`
- `.post-share__tag--ok:hover .post-share__icon`
- `.post-share__tag--vk:focus-visible .post-share__icon`
- `.post-share__tag--vk:hover .post-share__icon`
- `.post-share__tag-text`
- `.post-share__tag.is-copied`
- `.post-share__tag.is-copied .post-share__icon`
- `.post-share__tag.is-copied:hover`
- `.post-share__tag:focus-visible`
- `.post-share__tag:hover`
- `.report-form`
- `.required`
- `.rubric-select`
- `.rubric-select option`
- `.rubric-select:focus`
- `.rubric-select:hover`
- `.search-form`
- `.search-input`
- `.search-input:focus`
- `.search-no-results`
- `.search-result-item`
- `.search-result-item h3`
- `.search-result-item h3 a`
- `.search-result-item h3 a:hover`
- `.search-result-item:last-child`
- `.search-result-rubric`
- `.search-results`
- `.section-content`
- `.section-content li`
- `.section-content p`
- `.section-content ul`
- `.section-context--post`
- `.section-desc`
- `.section-title::after`
- `.sidebar-banner`
- `.sidebar-banner:hover`
- `.sidebar-banner__body`
- `.sidebar-banner__icon`
- `.sidebar-banner__link`
- `.sidebar-banner__link:hover`
- `.sidebar-banner__text`
- `.sidebar-banner__title`
- `.sidebar-col`
- `.sidebar-image-banner:focus-visible`
- `.sidebar-image-banner:hover`
- `.sidebar-image-banner:hover .sidebar-image-banner__cta i`
- `.sidebar-image-banner:hover .sidebar-image-banner__img`
- `.sidebar-image-banner__caption`
- `.sidebar-image-banner__cta`
- `.sidebar-image-banner__cta i`
- `.sidebar-image-banner__text`
- `.sidebar-image-banner__title`
- `.site-footer > .container`
- `.site-footer::before`
- `.slide`
- `.slide.active`
- `.slider-dot`
- `.slider-dot.active`
- `.slider-dots`
- `.slider-next`
- `.slider-next:hover`
- `.slider-prev`
- `.slider-prev:hover`
- `.submit-button`
- `.submit-button:disabled`
- `.submit-button:hover`
- `.svedenija-content`
- `.svedenija-content h1`
- `.svedenija-page`
- `.svedenija-page .container`
- `.svedenija-submenu`
- `.svedenija-submenu__link`
- `.svedenija-submenu__link--active`
- `.svedenija-submenu__link--active:hover`
- `.svedenija-submenu__link:hover`
- `.svedenija-submenu__list`
- `.thank-you-page`
- `.thank-you-page h1`
- `.thank-you-page p`
- `.visually-hidden`
- `.widget`
- `.widget img`
- `body.dark-theme .sidebar-image-banner`
- `body.dark-theme .sidebar-image-banner:focus-visible`
- `body.dark-theme .sidebar-image-banner:hover`

</details>

## Категория Б — типовые/псевдо без классов (23)

Селекторы без классов (`*`, `html`, `button`, `input`, ряд узких медиа-запросов). По большей части — нормализация / reset, которые в `main.css` обычно уже покрыты Bootstrap-ом. Проверить вручную; если вносят дополнительный сброс, который реально нужен — перенести.

- `*`
- `*::before`
- `*::after`
- `html`
- `img`
- `picture`
- `video`
- `canvas`
- `svg`
- `button`
- `input`
- `textarea`
- `select`
- `@media (max-width: 48rem)`
- `@media (max-width: 30rem)`
- `@media (min-width: 900px)`
- `@media (max-width: 899px)`
- `@media (min-width: 1100px)`
- `@media (min-width: 560px)`
- `@keyframes fadeIn`
- `@media print`
- `@media (max-width: 900px)`
- `@media (max-width: 600px)`

---

## Категория В — мёртвый код (243)

Селекторы, в которых **хотя бы одно** имя класса не встречается ни в одном шаблоне (`src/**`, `_mentor/**`). Такие правила никогда не применяются — удалить безусловно.

### Топ «убийц» — классы, из-за которых правила никогда не сработают

| Неиспользуемый класс/id | Сколько правил он уносит |
|---|---:|
| `.a11y-enabled` | 72 |
| `.page-body` | 18 |
| `.svedenija-sidebar` | 6 |
| `.svedenija-nav` | 6 |
| `.news-card-content` | 5 |
| `.btn-icon` | 4 |
| `.svedeniya-block` | 4 |
| `.news-item-header` | 4 |
| `.input-error` | 4 |
| `.search-widget` | 4 |
| `.quick-access-item` | 4 |
| `.eos-link` | 3 |
| `.search-button` | 3 |
| `.form-status` | 3 |
| `.dev-banner-link` | 3 |
| `.a11y-toggle` | 3 |
| `.slide-content` | 3 |
| `.poll-form` | 3 |
| `.site-main` | 2 |
| `.logo-link` | 2 |
| `.gerb-link` | 2 |
| `.site-title` | 2 |
| `.nav-section-icon` | 2 |
| `.active-section` | 2 |
| `.navbar-toggler` | 2 |
| `.quick-link-card` | 2 |
| `.news-item` | 2 |
| `.news-item-date` | 2 |
| `.news-item-link` | 2 |
| `.rubric-select-wrapper` | 2 |

**Самый крупный убийца — `.a11y-enabled`** (72 селектора). Это класс, который раньше добавлялся на `<body>` при включении «Версии для слабовидящих». Сейчас в шаблонах его нет, JS его не выставляет → все каскадные правила вида `.a11y-enabled .header-info-bar { … }` мёртвые.

### Полный список Категории В (243)

<details><summary>Раскрыть список</summary>

- `.a11y-enabled *:focus-visible`
- `.a11y-enabled.a11y-high-contrast`
- `.a11y-enabled.a11y-high-contrast .a11y-option span`
- `.a11y-enabled.a11y-high-contrast .a11y-option:hover`
- `.a11y-enabled.a11y-high-contrast .a11y-panel`
- `.a11y-enabled.a11y-high-contrast .a11y-panel h3`
- `.a11y-enabled.a11y-high-contrast .a11y-toggle`
- `.a11y-enabled.a11y-high-contrast .btn-primary`
- `.a11y-enabled.a11y-high-contrast .btn-submit`
- `.a11y-enabled.a11y-high-contrast .card`
- `.a11y-enabled.a11y-high-contrast .dev-banner`
- `.a11y-enabled.a11y-high-contrast .dev-banner-link`
- `.a11y-enabled.a11y-high-contrast .dev-banner-link:focus`
- `.a11y-enabled.a11y-high-contrast .dev-banner-link:hover`
- `.a11y-enabled.a11y-high-contrast .dev-banner-text`
- `.a11y-enabled.a11y-high-contrast .doc-download`
- `.a11y-enabled.a11y-high-contrast .doc-download:hover`
- `.a11y-enabled.a11y-high-contrast .doc-item`
- `.a11y-enabled.a11y-high-contrast .doc-item:hover`
- `.a11y-enabled.a11y-high-contrast .doc-section`
- `.a11y-enabled.a11y-high-contrast .doc-section h2`
- `.a11y-enabled.a11y-high-contrast .doc-title`
- `.a11y-enabled.a11y-high-contrast .documents-item`
- `.a11y-enabled.a11y-high-contrast .form-group input`
- `.a11y-enabled.a11y-high-contrast .form-group input:focus`
- `.a11y-enabled.a11y-high-contrast .form-group textarea`
- `.a11y-enabled.a11y-high-contrast .form-group textarea:focus`
- `.a11y-enabled.a11y-high-contrast .hero`
- `.a11y-enabled.a11y-high-contrast .main-nav a.active`
- `.a11y-enabled.a11y-high-contrast .main-nav a:hover`
- `.a11y-enabled.a11y-high-contrast .news-item`
- `.a11y-enabled.a11y-high-contrast .quick-link-card`
- `.a11y-enabled.a11y-high-contrast .report-form`
- `.a11y-enabled.a11y-high-contrast .rubric-select`
- `.a11y-enabled.a11y-high-contrast .rubric-select option`
- `.a11y-enabled.a11y-high-contrast .search-button`
- `.a11y-enabled.a11y-high-contrast .site-footer`
- `.a11y-enabled.a11y-high-contrast .site-header`
- `.a11y-enabled.a11y-high-contrast .site-header .logo`
- `.a11y-enabled.a11y-high-contrast .site-header a`
- `.a11y-enabled.a11y-high-contrast .site-main`
- `.a11y-enabled.a11y-high-contrast .submit-button`
- `.a11y-enabled.a11y-high-contrast .svedenija-sidebar`
- `.a11y-enabled.a11y-high-contrast .svedenija-sidebar a`
- `.a11y-enabled.a11y-high-contrast .svedenija-sidebar a.active`
- `.a11y-enabled.a11y-high-contrast .svedenija-sidebar a:hover`
- `.a11y-enabled.a11y-high-contrast a`
- `.a11y-enabled.a11y-high-contrast a:hover`
- `.a11y-enabled.a11y-high-contrast body`
- `.a11y-enabled.a11y-high-contrast button`
- `.a11y-enabled.a11y-high-contrast input`
- `.a11y-enabled.a11y-high-contrast select`
- `.a11y-enabled.a11y-high-contrast textarea`
- `.a11y-enabled.a11y-large-font`
- `.a11y-enabled.a11y-large-font .dev-banner`
- `.a11y-enabled.a11y-large-font .dev-banner-link`
- `.a11y-enabled.a11y-large-font .dev-banner-text`
- `.a11y-enabled.a11y-large-font .doc-section h2`
- `.a11y-enabled.a11y-large-font .doc-title`
- `.a11y-enabled.a11y-large-font .form-group input`
- `.a11y-enabled.a11y-large-font .form-group label`
- `.a11y-enabled.a11y-large-font .form-group textarea`
- `.a11y-enabled.a11y-large-font .rubric-select`
- `.a11y-enabled.a11y-large-font h1`
- `.a11y-enabled.a11y-large-font h2`
- `.a11y-enabled.a11y-large-font h3`
- `.a11y-enabled.a11y-large-font h4`
- `.a11y-enabled.a11y-large-font h5`
- `.a11y-enabled.a11y-large-font h6`
- `.a11y-enabled.a11y-no-animations *`
- `.a11y-enabled.a11y-no-animations *::after`
- `.a11y-enabled.a11y-no-animations *::before`
- `.a11y-panel-content`
- `.a11y-toggle`
- `.a11y-toggle-icon`
- `.a11y-toggle:focus`
- `.a11y-toggle:hover`
- `.banner-widget img`
- `.banner-widget img:hover`
- `.btn-icon`
- `.btn-icon:focus`
- `.btn-icon:focus-visible`
- `.btn-icon:hover`
- `.contact-form`
- `.content-layout`
- `.dev-banner`
- `.dev-banner-content`
- `.dev-banner-link`
- `.dev-banner-link:focus`
- `.dev-banner-link:hover`
- `.dev-banner-text`
- `.eos-link`
- `.eos-link:focus`
- `.eos-link:hover`
- `.form-group .help-text`
- `.form-group-hidden`
- `.form-group.input-error input`
- `.form-group.input-error input:focus`
- `.form-group.input-error textarea`
- `.form-group.input-error textarea:focus`
- `.form-status`
- `.form-status.error`
- `.form-status.success`
- `.gerb-link`
- `.gerb-link img`
- `.header-actions-panel`
- `.header-brand-row`
- `.header-info-bar`
- `.header-mobile-pill`
- `.header-nav`
- `.header-top`
- `.hero-buttons`
- `.hero-content`
- `.info-card-icon`
- `.info-cards-grid`
- `.info-cards-section`
- `.logo-link`
- `.logo-link img`
- `.main-content-section`
- `.nav-item.active-section > .nav-link .nav-section-icon`
- `.nav-item.active-section > .nav-link::before`
- `.nav-link.active .nav-section-icon`
- `.nav-section-icon`
- `.navbar-toggler`
- `.navbar-toggler:focus`
- `.news-all`
- `.news-card-content`
- `.news-card-content h3`
- `.news-card-content h3 a`
- `.news-card-content h3 a:hover`
- `.news-card-content p`
- `.news-card-image`
- `.news-date`
- `.news-feed`
- `.news-item`
- `.news-item-date`
- `.news-item-date::before`
- `.news-item-description`
- `.news-item-header`
- `.news-item-header h2`
- `.news-item-header h2 a`
- `.news-item-header h2 a:hover`
- `.news-item-link`
- `.news-item-link:hover`
- `.news-item:hover`
- `.news-list`
- `.news-section`
- `.page-body`
- `.page-body .svedenija-page`
- `.page-body a`
- `.page-body a:hover`
- `.page-body blockquote`
- `.page-body h1`
- `.page-body h2`
- `.page-body h3`
- `.page-body h4`
- `.page-body img`
- `.page-body li`
- `.page-body ol`
- `.page-body p`
- `.page-body table`
- `.page-body td`
- `.page-body th`
- `.page-body tr:nth-child(even) td`
- `.page-body ul`
- `.poll-form .btn-sm`
- `.poll-form input[type="radio"]`
- `.poll-form label`
- `.poll-widget .poll-content p`
- `.quick-access-grid`
- `.quick-access-item`
- `.quick-access-item .icon`
- `.quick-access-item span`
- `.quick-access-item:hover`
- `.quick-access-section`
- `.quick-link-card`
- `.quick-link-card:hover`
- `.quick-link-description`
- `.quick-link-icon`
- `.quick-link-title`
- `.quick-links`
- `.quick-links-grid`
- `.rubric-select option.rubric-level-0`
- `.rubric-select option.rubric-level-1`
- `.rubric-select option.rubric-level-2`
- `.rubric-select-arrow`
- `.rubric-select-wrapper`
- `.rubric-select-wrapper:hover .rubric-select-arrow`
- `.rubric-selector`
- `.rubric-selector-label`
- `.search-button`
- `.search-button:focus-visible`
- `.search-button:hover`
- `.search-widget .search-form`
- `.search-widget button`
- `.search-widget button:hover`
- `.search-widget input[type="search"]`
- `.sidebar-banner--accent`
- `.sidebar-banner--info`
- `.sidebar-banner--primary`
- `.sidebar-banner--success`
- `.sidebar-social`
- `.sidebar-social__link`
- `.sidebar-social__link--tg`
- `.sidebar-social__link--tg:hover`
- `.sidebar-social__link--vk`
- `.sidebar-social__link--vk:hover`
- `.sidebar-social__link--yt`
- `.sidebar-social__link--yt:hover`
- `.sidebar-social__links`
- `.sidebar-social__title`
- `.site-header`
- `.site-main`
- `.site-main > *`
- `.site-title`
- `.site-title small`
- `.slide-buttons`
- `.slide-content`
- `.slide-content h1`
- `.slide-content p`
- `.slider-container`
- `.slider-controls`
- `.svedenija-container`
- `.svedenija-nav a`
- `.svedenija-nav a.active`
- `.svedenija-nav a:hover`
- `.svedenija-nav h2`
- `.svedenija-nav li`
- `.svedenija-nav ul`
- `.svedenija-sidebar`
- `.svedenija-sidebar a`
- `.svedenija-sidebar a.active`
- `.svedenija-sidebar a:hover`
- `.svedenija-sidebar li`
- `.svedenija-sidebar ul`
- `.svedeniya-block`
- `.svedeniya-block .nav-link`
- `.svedeniya-block .nav-link:focus`
- `.svedeniya-block .nav-link:hover`
- `.widget-title`
- `option.level-0`
- `option.level-1`
- `option.level-2`

</details>

---

## Рекомендуемый порядок действий (для CHECKLIST 2.7.4)

1. **Перенести в `main.css` критичный блок Категории Б**:
   - `.content-sidebar-grid`, `.content-sidebar-grid--full` и связанный мобильный медиа-запрос (бывшие стр. 4574–4595 в `style.css`).
   - Прогнать `npm run build`, проверить визуально `/svedenija/` и `/abiturientam/`.
2. **По очереди разобрать остальные 315 селекторов Категории Б** — для каждого решить: перенести в `main.css` или признать ненужным (если в `main.css` уже есть эквивалент через другие классы / Bootstrap).
3. **Удалить файл `src/assets/css/style.css` целиком.**
4. **Снять passthrough** `eleventyConfig.addPassthroughCopy("src/assets")` или ограничить его до подпапок без CSS (см. CHECKLIST 2.7.4).
5. **Удалить пустую копию** `public/assets/css/style.css`, если она остаётся после билда.

## Что НЕ переносить

- Все **243 селектора Категории В** — целиком, без раздумий.
- Все **57 селекторов Категории А.2** — у `main.css` своя актуальная версия, версия из `style.css` устарела (другая палитра цветов, другие размеры, другая раскладка). Заметные различия:
  - `:root` — в `style.css` старая палитра `--sit-primary: #0d4a6b`, `--sit-accent: #e67e22`; в `main.css` — переменные `--home-img-radius`, `--home-img-shadow` (актуальные).
  - `.hero` — в `style.css` градиентный фон + `padding: var(--spacing-3xl)`; в `main.css` — `min-height: 80vh` с фоновым изображением (актуальный hero главной).
  - `a` — в `style.css` базовая ссылка с `text-decoration: none`; в `main.css` — `color: var(--accent-color)` (актуальная палитра).
