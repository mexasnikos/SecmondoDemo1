const { override, overrideDevServer } = require('customize-cra');

// Webpack configuration override
const webpackOverride = override();

// DevServer configuration override
const devServerOverride = overrideDevServer((config) => {
  // Remove deprecated middleware options
  delete config.onAfterSetupMiddleware;
  delete config.onBeforeSetupMiddleware;
  delete config.https;
  
  // Add the new setupMiddlewares function
  config.setupMiddlewares = (middlewares, devServer) => {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }
    return middlewares;
  };
  
  return config;
});

module.exports = {
  webpack: webpackOverride,
  devServer: devServerOverride,
};
