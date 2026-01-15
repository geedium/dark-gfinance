module.exports = {
  plugins: [
    require('autoprefixer'),
    require("./plugins/postcss-force-important")()
  ]
};
