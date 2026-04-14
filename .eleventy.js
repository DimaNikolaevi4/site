const yaml = require("js-yaml");

module.exports = function(config) {
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/admin");
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
  
  return {
    dir: {
      input: "src",
      output: "public"
    },
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
