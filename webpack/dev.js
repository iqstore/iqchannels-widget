const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = webpackMerge.merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    client: {
      overlay: false
    },
    hot: false,
    compress: false,
    host: '0.0.0.0',
    port: process.env.PORT,
    proxy: {
      '/public/api/*': {
        target: 'http://127.0.0.1:3001',
        secure: false
      }
    }
  },
  plugins: [
    new CompressionPlugin()
  ]
});
