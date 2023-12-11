const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = webpackMerge.merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  stats: 'detailed',
  // historyApiFallback: {
  //   index: '/'
  // },
  devServer: {
    // contentBase: path.resolve(__dirname, 'public'),
    // historyApiFallback: true,
    // inline: true,
    // progress: true,
    // stats: {
    //   colors: true,
    //   hash: true,
    //   timings: true,
    //   chunks: false,
    //   chunkModules: false,
    //   modules: false
    // },
    client: {
      overlay: false
    },
    hot: true,
    open: true,
    compress: true,
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
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
    new CompressionPlugin()
  ]
});
