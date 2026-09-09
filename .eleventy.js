const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: false }).disable(["code", "fence", "heading", "hr", "list", "blockquote", "table"]);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Renders inline `**bold**` markdown (used in JSON content strings) to <strong>,
  // without pulling in block-level markdown so a stray blank line can't break layout.
  eleventyConfig.addFilter("mdInline", (value) => md.renderInline(String(value ?? "")));

  eleventyConfig.addFilter("dump", (value) => JSON.stringify(value));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
