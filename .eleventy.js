const yaml = require("js-yaml");
const lunr = require("lunr");
const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');

// Загрузка структуры рубрик
function loadRubrics() {
  const rubricsPath = path.join(__dirname, 'src/_data/rubrics.yaml');
  const rubricsContent = fs.readFileSync(rubricsPath, 'utf8');
  return yaml.load(rubricsContent);
}

// Рекурсивное получение всех slug'ов рубрик.
// fullPath по умолчанию строится из иерархии (parent/slug),
// но узел может задать собственный путь через поле url:
//   url: "/svedenija/rukovodstvo/pedagogicheskiy-sostav/"  → перекрывает fullPath
function getAllRubricSlugs(rubrics, parentSlug = '') {
  let slugs = [];

  if (rubrics.main_rubrics) {
    rubrics.main_rubrics.forEach(rubric => {
      const currentSlug = rubric.slug;
      const inheritedPath = parentSlug ? `${parentSlug}/${currentSlug}` : currentSlug;
      // Если у узла задан url — нормализуем его в fullPath без ведущего/конечного "/"
      let fullPath = inheritedPath;
      if (rubric.url && typeof rubric.url === 'string') {
        fullPath = rubric.url.replace(/^\/+|\/+$/g, '');
      }

      slugs.push({
        slug: currentSlug,
        fullPath: fullPath,
        title: rubric.title,
        code: rubric.code,
        level: rubric.level || 0
      });

      if (rubric.children && rubric.children.length > 0) {
        // Дети по-прежнему наследуют ИЕРАРХИЧЕСКИЙ путь (через slug-ы),
        // если у самих не задан url. Это сохраняет вложенность в дереве.
        const childSlugs = getAllRubricSlugs(
          { main_rubrics: rubric.children },
          inheritedPath
        );
        slugs = slugs.concat(childSlugs);
      }
    });
  }

  return slugs;
}

module.exports = function(eleventyConfig) {
  // === Подключение иерархии рубрик ===
  // rubrics.yaml — НАВИГАЦИОННАЯ иерархия (header dropdown, breadcrumbs labels,
  // карточки подразделов). Авто-регистрация per-rubric коллекций удалена:
  // ранее создавалось 78 коллекций по пути src/content/<slug>/**/*.md, но
  // фактический контент лежит в src/content/pages/... и src/content/abiturientam/...,
  // поэтому все коллекции были пустыми и нигде не использовались
  // (collections.<slug> — 0 ссылок в шаблонах, см. сверку 8.2).
  const rubrics = loadRubrics();
  const allSlugs = getAllRubricSlugs(rubrics);
  console.log(`📁 Загружено ${allSlugs.length} рубрик из rubrics.yaml`);
  
  // === Вспомогательные фильтры ===
  eleventyConfig.addFilter('startsWith', function(str, prefix) {
    if (typeof str !== 'string') return false;
    return str.startsWith(prefix);
  });

  // === Фильтры для работы с рубриками ===
  eleventyConfig.addFilter('getParentRubric', function(currentSlug) {
    const currentRubric = allSlugs.find(r => r.slug === currentSlug || r.fullPath === currentSlug);
    if (!currentRubric) return null;
    
    const parts = currentRubric.fullPath.split('/');
    if (parts.length <= 1) return null;
    
    const parentSlug = parts.slice(0, -1).join('/');
    return allSlugs.find(r => r.fullPath === parentSlug);
  });

  eleventyConfig.addFilter('getBreadcrumbs', function(currentSlug) {
    const currentRubric = allSlugs.find(r => r.slug === currentSlug || r.fullPath === currentSlug);
    if (!currentRubric) return [];
    
    const parts = currentRubric.fullPath.split('/');
    const breadcrumbs = [];
    
    let accumulatedPath = '';
    parts.forEach((part, index) => {
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
      const rubric = allSlugs.find(r => r.fullPath === accumulatedPath);
      if (rubric) {
        breadcrumbs.push({
          title: rubric.title,
          slug: rubric.slug,
          fullPath: rubric.fullPath,
          isLast: index === parts.length - 1
        });
      }
    });
    
    return breadcrumbs;
  });

  eleventyConfig.addFilter('getChildRubrics', function(parentSlug) {
    return allSlugs.filter(r => {
      return r.fullPath.startsWith(parentSlug + '/') && 
             r.fullPath.split('/').length === parentSlug.split('/').length + 1;
    });
  });

  // Проверяет, существует ли страница с данным URL в коллекции
  eleventyConfig.addFilter('urlExists', function(url, collection) {
    if (!url || !collection || !Array.isArray(collection)) return false;
    return collection.some(item => item.url === url);
  });

  // Поиск рубрики по коду (например "4.5") — возвращает объект из allSlugs
  eleventyConfig.addFilter('getRubricByCode', function(code) {
    if (!code) return null;
    return allSlugs.find(r => r.code === code) || null;
  });

  // Навигация по соседним рубрикам (пред/след) по коду текущей рубрики
  // Возвращает { prev: {title, url} | null, next: {title, url} | null }
  eleventyConfig.addFilter('getRubricNavigation', function(code) {
    if (!code) return { prev: null, next: null };
    const current = allSlugs.find(r => r.code === code);
    if (!current) return { prev: null, next: null };

    // Определяем родительский путь
    const parts = current.fullPath.split('/');
    const parentPath = parts.length > 1 ? parts.slice(0, -1).join('/') : null;

    // Получаем всех прямых «братьев» (один уровень вложенности от родителя)
    const siblings = allSlugs.filter(r => {
      const rParts = r.fullPath.split('/');
      if (parentPath) {
        return r.fullPath.startsWith(parentPath + '/') &&
               rParts.length === parts.length;
      } else {
        return rParts.length === 1;
      }
    });

    const idx = siblings.findIndex(r => r.code === code);
    const prev = idx > 0 ? siblings[idx - 1] : null;
    const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

    return {
      prev: prev ? { title: prev.title, url: '/' + prev.fullPath + '/' } : null,
      next: next ? { title: next.title, url: '/' + next.fullPath + '/' } : null
    };
  });

  // Возвращает прямых детей рубрики, упакованных как карточки для news.njk (subrubrics mode)
  // На вход — код рубрики ("3", "4.5", "2.7" и т.п.) и collections (для чтения frontmatter)
  eleventyConfig.addFilter('getSubrubricCards', function(code, collections) {
    if (!code) return [];
    const parent = allSlugs.find(r => r.code === code);
    if (!parent) return [];
    const children = allSlugs.filter(r => {
      return r.fullPath.startsWith(parent.fullPath + '/') &&
             r.fullPath.split('/').length === parent.fullPath.split('/').length + 1;
    });
    return children.map(c => {
      const url = '/' + c.fullPath + '/';
      let pageData = { title: c.title, description: '', image: '' };
      if (collections && collections.all) {
        const page = collections.all.find(p => p.url === url);
        if (page && page.data) {
          pageData = {
            title: page.data.title || c.title,
            description: page.data.description || '',
            image: page.data.image || '',
            emoji: page.data.emoji || ''
          };
        }
      }
      return { url, data: pageData };
    });
  });
  
  // === Резолвер меток URL → человеческое название (для хлебных крошек) ===
  // Источники: rubrics.yaml (allSlugs) + menu.yaml + статические страницы
  function loadMenu() {
    try {
      const menuPath = path.join(__dirname, 'src/_data/menu.yaml');
      return yaml.load(fs.readFileSync(menuPath, 'utf8'));
    } catch (e) {
      return { main: [] };
    }
  }
  const menuData = loadMenu();

  function normalizeUrl(u) {
    if (!u) return '';
    if (!u.startsWith('/')) u = '/' + u;
    if (!u.endsWith('/')) u = u + '/';
    return u;
  }

  // Карта URL → человеческая метка
  const urlLabelMap = new Map();
  // Из меню (вкл. children)
  function walkMenu(items) {
    if (!Array.isArray(items)) return;
    items.forEach(it => {
      if (it.url && it.url.indexOf('#') === -1) {
        urlLabelMap.set(normalizeUrl(it.url), it.title);
      }
      if (it.children) walkMenu(it.children);
    });
  }
  walkMenu(menuData.main || []);
  // Из rubrics.yaml (по fullPath)
  allSlugs.forEach(r => {
    const url = '/' + r.fullPath + '/';
    if (!urlLabelMap.has(url)) urlLabelMap.set(url, r.title);
  });
  // Статические известные страницы
  const staticLabels = {
    '/': 'Главная',
    '/news/': 'Новости',
    '/contacts/': 'Контакты',
    '/about/': 'О техникуме',
    '/documents/': 'Документы',
    '/search/': 'Поиск',
    '/thank-you/': 'Спасибо за обращение',
    '/admin/': 'Администрирование',
    '/professionaly-2026/': 'Профессионалы-2026',
  };
  Object.entries(staticLabels).forEach(([u, t]) => {
    if (!urlLabelMap.has(u)) urlLabelMap.set(u, t);
  });

  // Преобразование slug в человекочитаемый fallback (если метка не нашлась)
  function humanizeSlug(slug) {
    if (!slug) return '';
    const s = slug.replace(/[-_]+/g, ' ').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  eleventyConfig.addFilter('breadcrumbsFromUrl', function(url, leafTitle) {
    if (!url || url === '/') {
      return [{ text: 'Главная', url: '/', isLast: true }];
    }
    const parts = url.split('/').filter(p => p && p.length > 0);
    const crumbs = [{ text: 'Главная', url: '/', isLast: false }];
    let acc = '';
    parts.forEach((part, i) => {
      acc += '/' + part;
      const accUrl = acc + '/';
      const isLast = i === parts.length - 1;
      let text;
      if (isLast && leafTitle) {
        text = leafTitle;
      } else {
        text = urlLabelMap.get(accUrl) || humanizeSlug(part);
      }
      crumbs.push({ text: text, url: accUrl, isLast: isLast });
    });
    return crumbs;
  });

  console.log('✅ Фильтры рубрик зарегистрированы');
  
  // === Плагины ===
  eleventyConfig.addPlugin(require("@11ty/eleventy-navigation"));
  
  // === Копирование статики ===
  // Канонический CSS — только src/styles/main.css (см. STRUCTURE_AND_PRINCIPLES.md § 2.4).
  // Из src/assets копируем точечно подпапки, реально используемые шаблонами:
  // favicons, images, js, uploads, template, vendor. Папка scss/ не публикуется (исходники).
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  // src/assets/uploads/ удалена: файлы хранятся на продакшене (https://сит-сальск.рф/assets/uploads/)
  eleventyConfig.addPassthroughCopy({ "src/assets/template": "assets/template" });
  eleventyConfig.addPassthroughCopy({ "src/assets/vendor/php-email-form": "assets/mentor/vendor/php-email-form" });
  eleventyConfig.addPassthroughCopy("src/images");
  // Vendor-библиотеки — из node_modules. URL-префикс /assets/mentor/vendor/ оставлен
  // ради совместимости со ссылками в layouts/base.njk (исторически путь шёл от
  // справочного шаблона BootstrapMade «Mentor», который из репозитория удалён).
  eleventyConfig.addPassthroughCopy({ "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/mentor/vendor/bootstrap/css/bootstrap.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "assets/mentor/vendor/bootstrap/js/bootstrap.bundle.min.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/bootstrap-icons/font/bootstrap-icons.css": "assets/mentor/vendor/bootstrap-icons/bootstrap-icons.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/bootstrap-icons/font/fonts": "assets/mentor/vendor/bootstrap-icons/fonts" });
  eleventyConfig.addPassthroughCopy({ "node_modules/aos/dist/aos.css": "assets/mentor/vendor/aos/aos.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/aos/dist/aos.js": "assets/mentor/vendor/aos/aos.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/glightbox/dist/css/glightbox.min.css": "assets/mentor/vendor/glightbox/css/glightbox.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/glightbox/dist/js/glightbox.min.js": "assets/mentor/vendor/glightbox/js/glightbox.min.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/swiper/swiper-bundle.min.css": "assets/mentor/vendor/swiper/swiper-bundle.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/swiper/swiper-bundle.min.js": "assets/mentor/vendor/swiper/swiper-bundle.min.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@srexi/purecounterjs/dist/purecounter_vanilla.js": "assets/mentor/vendor/purecounter/purecounter_vanilla.js" });
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });
  
  // === Расширения данных ===
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  
  // === Фильтры ===
  eleventyConfig.addFilter("dateRu", require("./src/_filters/dateRu"));
  eleventyConfig.addFilter("truncate", require("./src/_filters/truncate"));
  eleventyConfig.addFilter("slugify", require("./src/_filters/slugify"));
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || n === 0) return [];
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });
  eleventyConfig.addFilter("dateToISO", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toISOString();
  });
  
  // Фильтр даты (legacy)
  eleventyConfig.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric' });
  });
  
  // Фильтр upcase (для совместимости с Liquid)
  eleventyConfig.addFilter("upcase", (str) => {
    if (!str) return "";
    return String(str).toUpperCase();
  });

  // Фильтр для поиска элемента коллекции по fileSlug
  eleventyConfig.addFilter("findBySlug", (collection, slug) => {
    if (!collection || !Array.isArray(collection)) return null;
    return collection.find(item => item.fileSlug === slug) || null;
  });
  
  // === Коллекции (базовые) ===
  // Примечание: коллекции для рубрик уже созданы в collections-config.js
  
  // Новости
  eleventyConfig.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
        "src/content/news/*.md",
        "src/content/studentam-roditeljam/resursy/novosti/**/*.md"
      ])
      .sort((a, b) => b.date - a.date);
  });

  // Список уникальных тегов из коллекции news для страниц /tags/{slug}/
  eleventyConfig.addCollection("tagsList", function(collectionApi) {
    const slugify = require("./src/_filters/slugify");
    const news = collectionApi.getFilteredByGlob([
      "src/content/news/*.md",
      "src/content/studentam-roditeljam/resursy/novosti/**/*.md"
    ]);
    // Системные теги Eleventy и слишком общие, которые не нужны как страницы
    const skip = new Set(["nav", "all", "post", "posts", "новость"]);
    const map = new Map();
    for (const item of news) {
      const tags = Array.isArray(item.data.tags) ? item.data.tags : [];
      for (const raw of tags) {
        const name = String(raw).trim();
        if (!name || skip.has(name.toLowerCase())) continue;
        const slug = slugify(name);
        if (!slug) continue;
        if (!map.has(slug)) {
          map.set(slug, { name, slug, posts: [] });
        }
        map.get(slug).posts.push(item);
      }
    }
    // Сортируем посты внутри тега по дате (свежие сверху)
    for (const t of map.values()) {
      t.posts.sort((a, b) => b.date - a.date);
    }
    // Сортируем теги по алфавиту (русская локаль)
    return Array.from(map.values())
      .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  });

  // Все материалы для поиска
  eleventyConfig.addCollection("searchable", (collection) => {
    return collection.getAll().filter((item) => {
      return item.data.searchable !== false;
    });
  });
  
  // Документы
  eleventyConfig.addCollection("documents", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/documents/**/*.md");
  });
  
  // Примечание: коллекция "svedenija" уже создана автоматически через rubrics.yaml
  
  // === Поиск Lunr ===
  eleventyConfig.addFilter("lunrIndex", function(collection) {
    const documents = collection.map(item => ({
      id: item.url,
      title: item.data.title || '',
      content: item.templateContent || '',
      date: item.date || '',
      tags: item.data.tags || [],
      category: item.data.category || ''
    }));

    const idx = lunr(function() {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('content');
      this.field('tags', { boost: 5 });
      this.field('category');

      documents.forEach(doc => {
        this.add(doc);
      });
    });

    return JSON.stringify(idx);
  });

  // === Фильтр для поиска: исключает служебные страницы ===
  eleventyConfig.addFilter('filterBySearch', function(collection) {
    const excludePatterns = [
      '/404.html',
      '/search/',
      '/thank-you/',
      '/admin/',
      '/sitemap.xml',
      '/robots.txt',
      '/search-index.json'
    ];
    return collection.filter(item => {
      if (!item.url) return false;
      if (excludePatterns.some(p => item.url.startsWith(p))) return false;
      if (item.data && item.data.eleventyExcludeFromCollections) return false;
      return true;
    });
  });

  // === JSON-фильтр для Nunjucks ===
  eleventyConfig.addFilter('jsonify', function(value) {
    return JSON.stringify(value);
  });

  // === <picture> с WebP-источником для всех локальных растровых <img> ===
  // Для каждого <img src="/path.jpg|.jpeg|.png"> оборачиваем в <picture>:
  //   <picture><source srcset="/path.webp" type="image/webp"><img ...></picture>
  // Только если файл public/path.webp существует (генерируется pre-build скриптом scripts/generate-webp.mjs).
  // Защищаемся от двойного оборачивания: уже существующие <picture>...</picture> блоки временно прячем.
  // Внешние URL (http/https), .gif (часто анимация), .svg, .webp — пропускаем.
  const webpExistsCache = new Map();
  function localWebpExists(srcUrl) {
    // Только локальные пути, начинающиеся с "/" (и не "//" — это protocol-relative)
    if (!srcUrl || !srcUrl.startsWith('/') || srcUrl.startsWith('//')) return false;
    // Соответствие webp-файлу в выходной директории (passthrough копирует туда из src/)
    const webpUrl = srcUrl.replace(/\.(jpe?g|png)$/i, '.webp');
    if (webpExistsCache.has(webpUrl)) return webpExistsCache.get(webpUrl);
    const fsPath = path.join(__dirname, 'public', webpUrl.replace(/^\//, ''));
    const exists = fs.existsSync(fsPath);
    webpExistsCache.set(webpUrl, exists);
    return exists;
  }

  eleventyConfig.addTransform('pictureWebp', function (content) {
    const outputPath = this.page && this.page.outputPath;
    if (!outputPath || !outputPath.endsWith('.html')) return content;

    // 1) Спрятать существующие <picture>...</picture> блоки (чтобы не оборачивать вложенные <img>).
    const placeholders = [];
    const PLACEHOLDER = (i) => `\u0000PICTURE_PLACEHOLDER_${i}\u0000`;
    let work = content.replace(/<picture\b[\s\S]*?<\/picture>/gi, (block) => {
      placeholders.push(block);
      return PLACEHOLDER(placeholders.length - 1);
    });

    // 2) Для оставшихся <img> с локальным .jpg/.jpeg/.png src и существующим webp — обернуть.
    work = work.replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
      const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return full;
      const src = srcMatch[1];
      if (!/\.(jpe?g|png)$/i.test(src)) return full;       // не растровый — пропуск
      if (!localWebpExists(src)) return full;               // нет webp-эквивалента — пропуск
      const webpUrl = src.replace(/\.(jpe?g|png)$/i, '.webp');
      return `<picture><source srcset="${webpUrl}" type="image/webp"><img${attrs}></picture>`;
    });

    // 3) Восстановить спрятанные блоки.
    work = work.replace(/\u0000PICTURE_PLACEHOLDER_(\d+)\u0000/g, (_, i) => placeholders[Number(i)]);
    return work;
  });

  // === Lazy loading для всех <img> без атрибута loading= ===
  // Покрывает картинки из импортированного Markdown-контента и любые ручные <img>,
  // у которых атрибут не выставлен. Если loading= уже задан явно (eager/lazy) — не трогаем.
  // decoding="async" добавляем тоже только при отсутствии — для лучшей отзывчивости рендера.
  // ВАЖНО: транформ работает ВСЕГДА (и в dev, и в build), т.к. это исправление разметки, а не оптимизация.
  eleventyConfig.addTransform('imgLazy', function (content) {
    const outputPath = this.page && this.page.outputPath;
    if (!outputPath || !outputPath.endsWith('.html')) return content;
    return content.replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
      let out = attrs;
      if (!/\bloading\s*=/i.test(out)) out += ' loading="lazy"';
      if (!/\bdecoding\s*=/i.test(out)) out += ' decoding="async"';
      return `<img${out}>`;
    });
  });

  // === Минификация HTML (только в режиме build, не в dev/serve) ===
  // Eleventy 3.x выставляет process.env.ELEVENTY_RUN_MODE в "build"|"serve"|"watch".
  // Минифицируем только при build (npm run build), чтобы не замедлять разработку.
  if (process.env.ELEVENTY_RUN_MODE === 'build') {
    eleventyConfig.addTransform('htmlmin', async function (content) {
      const outputPath = this.page && this.page.outputPath;
      if (!outputPath || !outputPath.endsWith('.html')) return content;
      try {
        return await minifyHtml(content, {
          collapseWhitespace: true,
          removeComments: true,
          conservativeCollapse: true,    // не схлопывать пробелы там, где это поменяет рендер (между inline-элементами)
          minifyCSS: true,
          minifyJS: true,
          decodeEntities: false,         // не трогать &nbsp; и пр. — оставляем как написано
          removeAttributeQuotes: false,  // оставить кавычки у атрибутов (надёжнее, лишь немного больше байт)
          removeRedundantAttributes: true,
          useShortDoctype: true,
          // ВАЖНО: НЕ удалять атрибуты-ссылки на внешние ресурсы и внутренние якоря.
          // НЕ трогать содержимое <pre>, <code>, <textarea> — html-minifier-terser сам их щадит.
        });
      } catch (e) {
        console.warn(`[htmlmin] не удалось минифицировать ${outputPath}: ${e.message}`);
        return content;
      }
    });
  }

  // === Поддержка pathPrefix для деплоя в подпапку ===
  const pathPrefix = process.env.PATH_PREFIX || "/";
  
  eleventyConfig.setServerOptions({
    host: "0.0.0.0",
    port: 5000,
    showAllHosts: true
  });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: pathPrefix
  };
};
