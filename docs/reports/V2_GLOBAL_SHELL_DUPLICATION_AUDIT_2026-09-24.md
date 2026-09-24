# V2 audit: duplicate global shell elements

Date: 2026-09-24  
Branch: `site-v2`

## Scope and findings

Checked the shared page shell, the “Наверх” control, and duplicate HTML IDs in the generated V2 pages.

The first generated-output audit found two duplicate IDs on `/search/`:

- `main-content` was assigned both to the `<main>` wrapper in `layouts/base.njk` and to a nested `<main>` in `pages/search.njk`.
- `rubricsData` was emitted by both `components/header.njk` and `pages/search.njk`.

Updated the search page to use a content `<div>` inside the base layout's main element and removed its duplicate JSON data block. The header remains the single source of `rubricsData` for site-wide search.

## Verification

- `npm ci` completed successfully from the committed lockfile.
- `npm run build:v2` completed successfully.
- Audited all 145 generated HTML files: 143 use the shared shell; `/admin/` and the pedagogical-staff redirect are intentionally standalone.
- All 143 shell pages contain exactly one `header`, `main-content`, `footer`, `scrollTop`, and `rubricsData`; each has one `<main>` and one `.scroll-top` control.
- No duplicate HTML IDs were found in the generated pages.