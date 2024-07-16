const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  config.allowedHosts = [
    'localhost:8080'
  ];
  return config;
};

module.exports = {
  webpack: override(
    // Outras customizações do Webpack
  ),
  devServer: overrideDevServer(
    devServerConfig()
  )
};
