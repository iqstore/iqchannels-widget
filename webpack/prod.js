const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./common.js');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = webpackMerge.merge(commonConfig, {
  devtool: 'source-map',
  mode: 'production',
  // debug: false,
  output: {
    path: path.join(__dirname, 'build/'),
    publicPath: '/widget/',
    filename: '[name].min.js',
    sourceMapFilename: '[name].js.map'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.cjs.js'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    // new ExtractTextPlugin('[name].min.css'),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false,
    //     screw_ie8: true /* eslint camelcase: 0 */
    //   }
    // }),
    new CompressionPlugin()
  ]
});
