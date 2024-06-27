const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = webpackMerge.merge(commonConfig, {
	devtool: 'cheap-source-map',
	mode: 'production',
	output: {
		path: path.join(__dirname, '../build'),
		publicPath: '/widget/',
		filename: '[name].min.js',
		sourceMapFilename: '[name].js.map'
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm-browser.prod.js'
		}
	},
	optimization: {
		usedExports: true,
		minimize: true,
		splitChunks: {
			minSize: 20000,
			cacheGroups: {
				wavesurfer: {
					test: /[\\/]node_modules[\\/]wavesurfer\.js[\\/]/,
					name: 'wavesurfer',
					chunks: 'all',
					priority: 10
				},
				lamejs: {
					test: /[\\/]node_modules[\\/]lamejs[\\/]/,
					name: 'lamejs',
					chunks: 'all',
					priority: 10
				},
				markdownit: {
					test: /[\\/]node_modules[\\/](markdown-it|entities[\\/]lib[\\/]esm)[\\/]/,
					name: 'markdownit',
					chunks: 'all',
					priority: 10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			}
		},
		minimizer: [
			new TerserPlugin(),
		],
	},
	plugins: [
		new CompressionPlugin(),
	]
});
