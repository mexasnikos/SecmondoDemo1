const path = require('path');

// Set Node.js options before any webpack processing
if (!process.env.NODE_OPTIONS) {
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
}
process.env.GENERATE_SOURCEMAP = 'false';

module.exports = function override(config, env) {
  
  // Exclude problematic modules from webpack processing
  config.resolve.alias = {
    ...config.resolve.alias,
    'fast-png': path.resolve(__dirname, 'src/utils/empty-module.js'),
    'iobuffer': path.resolve(__dirname, 'src/utils/empty-module.js')
  };

  // Disable ESLint plugin to avoid configuration issues
  config.plugins = config.plugins.filter(plugin => {
    return plugin.constructor.name !== 'ESLintWebpackPlugin';
  });

  // Completely disable PostCSS processing to avoid plugin issues
  const oneOfRule = config.module.rules.find(rule => rule.oneOf);
  if (oneOfRule) {
    oneOfRule.oneOf.forEach(rule => {
      if (rule.test && rule.test.toString().includes('css') && rule.use) {
        rule.use = rule.use.filter(loader => {
          if (typeof loader === 'object' && loader.loader) {
            return !loader.loader.includes('postcss-loader');
          }
          return true;
        });
      }
    });
  }

  // Disable source maps for faster builds
  if (env === 'production') {
    config.devtool = false;
  }

  return config;
};