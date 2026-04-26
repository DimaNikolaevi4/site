const yaml = require("js-yaml");
const lunr = require("lunr");
const fs = require('fs');
const path = require('path');

// Загрузка структуры рубрик
function loadRubrics() {
  const rubricsPath = path.join(__dirname, 'src/_data/rubrics.yaml');
  const rubricsContent = fs.readFileSync(rubricsPath, 'utf8');
  return yaml.load(rubricsContent);
}

// Рекурсивное получение всех slug'ов рубрик
function getAllRubricSlugs(rubrics, parentSlug = '') {
  let slugs = [];
  
  if (rubrics.main_rubrics) {
    rubrics.main_rubrics.forEach(rubric => {
      const currentSlug = rubric.slug;
      const fullPath = parentSlug ? `${parentSlug}/${currentSlug}` : currentSlug;
      
      slugs.push({
        slug: currentSlug,
        fullPath: fullPath,
        title: rubric.title,
        code: rubric.code,
        level: rubric.level || 0
      });
      
      if (rubric.children && rubric.children.length > 0) {
        const childSlugs = getAllRubricSlugs(
          { main_rubrics: rubric.children }, 
          fullPath
        );
        slugs = slugs.concat(childSlugs);
      }
    });
  }
  
  return slugs;
}

module.exports = function(eleventyConfig) {
  // === Подключение конфигурации коллекций ===
  const rubrics = loadRubrics();
  const allSlugs = getAllRubricSlugs(rubrics);
  
  console.log(`📁 Регистрация коллекций для ${allSlugs.length} рубрик...`);
  
  // Создаем коллекцию для каждой рубрики
  allSlugs.forEach(rubric => {
    const collectionName = rubric.slug.replace(/-/g, '');
    
    eleventyConfig.addCollection(collectionName, function(collectionApi) {
      return collectionApi.getFilteredByGlob(`src/content/${rubric.fullPath}/**/*.md`)
        .sort((a, b) => {
          if (b.date && a.date) {
            return b.date - a.date;
          }
          return (a.data.title || '').localeCompare(b.data.title || '', 'ru');
        });
    });
    
    console.log(`  ✓ Коллекция "${collectionName}" (${rubric.fullPath})`);
  });
  
  console.log('✅ Конфигурация коллекций загружена');
  
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

  // Поиск рубрики по коду (например "4.5") — возвращает объект из allSlugs
  eleventyConfig.addFilter('getRubricByCode', function(code) {
    if (!code) return null;
    return allSlugs.find(r => r.code === code) || null;
  });

  // Возвращает прямых детей рубрики, упакованных как карточки для news.njk (subrubrics mode)
  // На вход — код рубрики ("3", "4.5", "2.7" и т.п.)
  eleventyConfig.addFilter('getSubrubricCards', function(code) {
    if (!code) return [];
    const parent = allSlugs.find(r => r.code === code);
    if (!parent) return [];
    const children = allSlugs.filter(r => {
      return r.fullPath.startsWith(parent.fullPath + '/') &&
             r.fullPath.split('/').length === parent.fullPath.split('/').length + 1;
    });
    return children.map(c => ({
      url: '/' + c.fullPath + '/',
      data: {
        title: c.title,
        description: '',
        image: ''
      }
    }));
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
  // Из src/assets копируем точечно только подпапки, реально используемые шаблонами:
  // favicons, images, js, uploads. Папки scss/, vendor/, img/ не публикуются —
  // SCSS это исходники, vendor подключается через _mentor/assets, img/ нигде не используется.
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/uploads");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "_mentor/assets": "assets/mentor" });
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  
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
