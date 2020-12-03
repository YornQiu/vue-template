const proxy = process.env.DEV_SERVER_PROXY_URL || 'http://localhost:3001';
const port = process.env.DEV_SERVER_PORT || 3001;

const webpack = require('webpack');

module.exports = {
  publicPath: '/src',
  outputDir: './dist',
  runtimeCompiler: true,
  devServer: {
    port,
    proxy
  },
  chainWebpack: config => {
    config.output.library('ycApp').libraryTarget('umd');
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
        Dayjs: 'dayjs'
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '@/styles/variables.scss';`
      }
    }
  }
};
