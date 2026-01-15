module.exports = () => {
  return {
    postcssPlugin: 'postcss-force-important',
    Declaration(decl) {
      // Skip if already !important
      if (!decl.important) {
        decl.important = true;
      }
    },
  };
};

module.exports.postcss = true;
