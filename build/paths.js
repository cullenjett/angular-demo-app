module.exports = {
  app: "../../config/app.config.js",
  quickbase: "../../config/quickbase.config.js",
  javascript: "app/**/*.js",
  html: "app/index.html",
  css: "app/**/*.{sass,scss,css}",
  templates: "app/**/!(index).html",
  outputDev: "./tmp",
  outputProd: "./dist"
};