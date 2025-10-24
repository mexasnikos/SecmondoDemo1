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

  // PostCSS is now enabled for Tailwind CSS support
  // The PostCSS disabling code has been removed to allow Tailwind to work

  // Disable source maps for faster builds
  if (env === 'production') {
    config.devtool = false;
  }

  return config;
};