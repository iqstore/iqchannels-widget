const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = webpackMerge.merge(commonConfig, {
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  output: {
    path: path.join(__dirname, '../build'),
    publicPath: '/widget/',
    filename: '[name].min.js',
    sourceMapFilename: '[name].js.map'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.cjs.js'
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ]
  },
  plugins: [
    new CompressionPlugin(),
    new MiniCssExtractPlugin()
  ]
});
