# Tehnikum Site

A static website for the Salsk Industrial Technical School (ГБПОУ РО "Сальский индустриальный техникум").

## Architecture

- **Static Site Generator:** Eleventy (11ty) v2.0.1
- **Templating:** Nunjucks (.njk) + Markdown (.md)
- **Styling:** Bootstrap 5 + SCSS/CSS
- **Search:** Lunr.js (client-side full-text search)
- **CMS:** Decap CMS (Netlify CMS) for content editing
- **Data:** YAML files for global site data

## Project Structure

- `src/` — Source directory
  - `_data/` — YAML data files (site.yaml, menu.yaml, contacts.yaml)
  - `_includes/` — Reusable partials and layouts
  - `_filters/` — Custom Nunjucks filters
  - `content/` — Site content (news, pages, documents, categories)
  - `assets/` — Static assets (SCSS, JS, images)
  - `admin/` — Decap CMS configuration
- `public/` — Built output directory (auto-generated)
- `favicons/` — Favicon files
- `docs/` — Internal project documentation

## Development

- **Dev server:** `npm run dev` (Eleventy with live reload on port 5000)
- **Build:** `npm run build` (outputs to `public/`)
- **Package manager:** npm

## Layout System

- All pages use `layout: base.njk` directly (no chained layouts currently in use)
- `base.njk` wraps content in `.page-body` (max-width container + prose styles) unless frontmatter has `fullWidth: true`
- `src/index.md` has `fullWidth: true` so the home page hero slider remains edge-to-edge
- `.page-body` provides responsive typography for h1–h4, p, ul, ol, tables, blockquote, a, img
- Header: Bootstrap 5 sticky navbar with desktop info bar, simplified mobile bar, rubric selector
- Footer: 3-column grid (brand/social, nav links, contacts) from YAML data; collapses to 1 column on mobile

## Key Data Files

- `src/_data/contacts.yaml` — phones, email, address, working hours, EOS URL
- `src/_data/social.yaml` — VK, RuTube, Yandex Zen
- `src/_data/menu.yaml` — main navigation
- `src/_data/rubrics.yaml` — rubric selector options
- `src/_data/site.yaml` — site title, description, URL, language

## Content Pages Status

### Раздел «Сведения об образовательной организации» (Приказ Рособрнадзора №1493) — ЗАПОЛНЕН
All svedenija subpages require explicit `permalink:` in frontmatter to route to `/svedenija/<section>/`.
- `/svedenija/` — index
- `/svedenija/structure/` — Структура и органы управления
- `/svedenija/education/` — Образование (специальности, численность)
- `/svedenija/employees/` — Руководство и педагогический состав
- `/svedenija/objects/` — Материально-техническое обеспечение
- `/svedenija/stipend/` — Стипендии и меры поддержки
- `/svedenija/finance/` — Финансово-хозяйственная деятельность
- `/svedenija/vacancies/` — Вакантные места для приёма/перевода
- `/svedenija/access/` — Доступная среда
- `/svedenija/international/` — Международное сотрудничество

### Прочие разделы — ЗАПОЛНЕНЫ
- `/abiturientam/slovo-direktora/`, `/abiturientam/den-otkrytyh-dverej/`
- `/bezopasnost/antikorrupcija/`, `/bezopasnost/extremizm/`
- `/studentam-i-roditeljam/raspisanie/`, `/studentam-i-roditeljam/roditeljam/`
- `/vospitanie/volonterstvo/`, `/vospitanie/velikaja-pobeda/`, `/vospitanie/mediacentr/`,
  `/vospitanie/kulturno-massovaja/`, `/vospitanie/pozdravlenija/`
- `/sotrudnichestvo/predprijatija/`, `/sotrudnichestvo/shkoly/`
- `/uchebno-metodicheskaja-rabota/`
- `/professionaly-2026/`

### ВАЖНО: правило permalink
Все страницы в `src/content/pages/**` НЕ получают автоматический путь из имени файла.
Каждая страница ОБЯЗАТЕЛЬНО должна иметь `permalink:` в frontmatter!
Без явного permalink страница строится по пути `/content/pages/<...>/`.

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `public/`
