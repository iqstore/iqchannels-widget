const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': './src/main.js',
    'widget': './src/widget.js',
    'example': './src/examples/example.js',
    'example0': './src/examples/0.js',
    'example1': './src/examples/1.js',
    'example2': './src/examples/2.js',
    'example3': './src/examples/3.js',
    'example4': './src/examples/4.js',
    'example5': './src/examples/5.js',
    'example6': './src/examples/6.js',
    'example7': './src/examples/7.js',
    'example8': './src/examples/8.js',
    'example9': './src/examples/9.js',
    'example10': './src/examples/10.js'
  },

  debug: true,

  resolve: {
    root: path.resolve('../'),
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.pug$/,
        loader: 'pug-html-loader'
      }, {
        test: /\.js?$/,
        exclude: /node_modules(?![\\/]vue-awesome[\\/])/,
        loader: 'babel'
      }, {
        test: /\.json?$/,
        loader: 'json'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }, {
        test: /\.(jpg|png)$/,
        loader: 'file-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/main.pug',
      inject: 'body',
      chunks: ['app'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/example.pug',
      chunks: ['widget', 'example'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/0.pug',
      chunks: ['widget', 'example0'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example0.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/1.pug',
      chunks: ['widget', 'example1'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example1.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/2.pug',
      chunks: ['widget', 'example2'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example2.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/3.pug',
      chunks: ['widget', 'example3'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example3.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/4.pug',
      chunks: ['widget', 'example4'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example4.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/5.pug',
      chunks: ['widget', 'example5'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example5.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/6.pug',
      chunks: ['widget', 'example6'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example6.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/7.pug',
      chunks: ['widget', 'example7'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example7.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/8.pug',
      chunks: ['widget', 'example8'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example8.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/9.pug',
      chunks: ['widget', 'example9'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example9.html'
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/10.pug',
      chunks: ['widget', 'example10'],
      chunksSortMode: 'none',
      inject: 'head',
      filename: 'example10.html'
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(process.env.NODE_ENV || process.env.ENV || 'development')
      }
    })
  ]
};
