const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
          }
        }
      }, {
        test: /\.pug$/,
        oneOf: [
          // this applies to `<template lang="pug">` in Vue components
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          // this applies to pug imports inside JavaScript
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ]
      },
      {
        exclude: file => (
          /node_modules/.test(file) && !/\.vue\.js/.test(file)
        ),
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }, {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
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
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(process.env.NODE_ENV || process.env.ENV || 'development')
      }
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
    })
  ]
};
