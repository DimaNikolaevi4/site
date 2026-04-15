const yaml = require("js-yaml");
const lunr = require("lunr");

module.exports = function(config) {
  // === Плагины ===
  config.addPlugin(require("@11ty/eleventy-navigation"));
  
  // === Копирование статики ===
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/admin");
  config.addPassthroughCopy("favicons");
  config.addPassthroughCopy({ "robots.njk": "robots.txt" });
  
  // === Расширения данных ===
  config.addDataExtension("yaml", contents => yaml.load(contents));
  
  // === Фильтры ===
  config.addFilter("dateRu", require("./src/_filters/dateRu"));
  config.addFilter("truncate", require("./src/_filters/truncate"));
  config.addFilter("slugify", require("./src/_filters/slugify"));
  
  // Фильтр даты (legacy)
  config.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric' });
  });
  
  // === Коллекции ===
  
  // Новости
  config.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/news/*.md")
      .sort((a, b) => b.date - a.date);
  });
  
  // Все материалы для поиска
  config.addCollection("searchable", (collection) => {
    return collection.getAll().filter((item) => {
      return item.data.searchable !== false;
    });
  });
  
  // Документы
  config.addCollection("documents", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/documents/**/*.md");
  });
  
  // Страницы сведений
  config.addCollection("svedenija", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/pages/svedenija/**/*.md");
  });
  
  // === Поиск Lunr ===
  config.addFilter("lunrIndex", function(collection) {
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
  
  return {
    dir: {
      input: "src",
      output: "public"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: pathPrefix
  };
};
