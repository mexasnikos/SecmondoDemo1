module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix webpack-dev-server configuration
      if (webpackConfig.devServer) {
        // Remove the problematic 'apply' property if it exists
        delete webpackConfig.devServer.apply;
        
        // Remove deprecated middleware properties
        delete webpackConfig.devServer.onAfterSetupMiddleware;
        delete webpackConfig.devServer.onBeforeSetupMiddleware;
        
        // Use the new setupMiddlewares function
        webpackConfig.devServer.setupMiddlewares = (middlewares, devServer) => {
          return middlewares;
        };
      }
      
      return webpackConfig;
    },
  },
  devServer: {
    // Override dev server configuration
    setupMiddlewares: (middlewares) => {
      return middlewares;
    },
  },
};
