const yaml = require("js-yaml");
const lunr = require("lunr");

module.exports = function(config) {
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/admin");
  config.addPassthroughCopy({ "robots.njk": "robots.txt" });
  config.addPlugin(require("@11ty/eleventy-navigation"));

  // Load site.yaml and make it available globally
  config.addDataExtension("yaml", contents => yaml.load(contents));

  // Add date filter for Nunjucks
  config.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric' });
  });

  // Collection: news
  config.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/news/*.md");
  });

  // Collection: anti-corruption data
  config.addCollection("anti-corruption-data", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/pages/svedenija/documents/anti-corruption/_data/*.yaml");
  });

  // Search index using lunr
  config.addCollection("searchable", (collection) => {
    return collection.getAll();
  });

  config.addFilter("lunrIndex", function(collection) {
    const documents = collection.map(item => ({
      id: item.url,
      title: item.data.title || '',
      content: item.templateContent || '',
      date: item.date || ''
    }));

    const idx = lunr(function() {
      this.ref('id');
      this.field('title');
      this.field('content');
      this.field('date');

      documents.forEach(doc => {
        this.add(doc);
      });
    });

    return JSON.stringify(idx);
  });

  return {
    dir: {
      input: "src",
      output: "public"
    },
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
