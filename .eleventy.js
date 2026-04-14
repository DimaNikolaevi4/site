const yaml = require("js-yaml");
const fs = require("fs");

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
    return d.getFullYear().toString();
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
