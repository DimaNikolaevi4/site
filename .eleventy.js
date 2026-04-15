const yaml = require("js-yaml");
const lunr = require("lunr");

module.exports = function(eleventyConfig) {
  // === Плагины ===
  eleventyConfig.addPlugin(require("@11ty/eleventy-navigation"));
  
  // === Копирование статики ===
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("favicons");
  eleventyConfig.addPassthroughCopy({ "robots.njk": "robots.txt" });
  
  // === Расширения данных ===
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  
  // === Фильтры ===
  eleventyConfig.addFilter("dateRu", require("./src/_filters/dateRu"));
  eleventyConfig.addFilter("truncate", require("./src/_filters/truncate"));
  eleventyConfig.addFilter("slugify", require("./src/_filters/slugify"));
  
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
  
  // === Коллекции ===
  
  // Новости
  eleventyConfig.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/news/*.md")
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
  
  // Страницы сведений
  eleventyConfig.addCollection("svedenija", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/pages/svedenija/**/*.md");
  });
  
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
