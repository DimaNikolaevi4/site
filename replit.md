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

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `public/`
