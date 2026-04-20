# Project Overview

This project is an Eleventy static website for ГБПОУ РО "Сальский индустриальный техникум".

## Structure

- `src/` contains Eleventy source templates, content, data, filters, styles, and admin files.
- `public/` is the generated static output directory.
- `.eleventy.js` configures collections, filters, passthrough assets, output paths, and the development server.
- `.replit` configures the Replit workflow to run the site on port 5000 and deploy as a static site from `public/`.

## Runtime

- Development command: `npm run dev`
- Build command: `npm run build`
- The Eleventy dev server binds to `0.0.0.0:5000` for Replit preview compatibility.