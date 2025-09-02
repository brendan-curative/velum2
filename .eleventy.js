const pluginGitCommitDate = require("eleventy-plugin-git-commit-date");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src");
    eleventyConfig.addPlugin(pluginGitCommitDate);

    return {
        dir: {
          output: "docs"
        },
        pathPrefix: "/velum/"
      }
};

