const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jsSourcePath = path.join(__dirname, './src');
const buildPath = path.join(__dirname, './dist');
const assetsDirName = 'assets';
const assetsPath = path.join(__dirname, './' + assetsDirName);
const sourcePath = path.join(__dirname, './src');

// Common plugins
const plugins = [
	// new webpack.optimize.CommonsChunkPlugin({
	// 	name: 'vendor',
	// 	filename: 'vendor.js',
	// 	minChunks(module) {
	// 		const context = module.context;
	// 		return context && context.indexOf('node_modules') >= 0;
	// 	},
	// }),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(nodeEnv),
		},
	}),
	new HtmlWebpackPlugin({
		template: path.join(sourcePath, 'index.html'),
		path: buildPath,
		filename: 'index.html',
		minify: false
	}),
	new webpack.LoaderOptionsPlugin({
		options: {
			postcss: [
				autoprefixer(),
			],
			context: sourcePath,
		},
	}),
];


// Common rules
const rules = [
	{
		test: /\.js$/,
		exclude: /node_modules/,
		use: [
			'babel-loader',
		],
	},
	{
		test: /\.(ttf|eot|svg|woff|woff2|otf)(\?v=\d+\.\d+\.\d+)?/,
		use: [
			{
				loader: 'url-loader?limit=20480',
			},
		],
	},
	{
		test: /\.(svg|png|jpg|jpeg|gif|fsh|vsh|js|json)(\?v=\d+\.\d+\.\d+)?$/,
		include: assetsPath,
		type: 'asset/resource',
		use: [
			{
				loader: 'file-loader?limit=20480',
			},
		],
	},
];

if (isProduction) {
	// Production plugins
	plugins.push(
		new MiniCssExtractPlugin({ filename: 'jsorrery.css' }),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: assetsPath,
					to: buildPath + '/' + assetsDirName,
				}
			],
		}),
	);

	// Production rules
	rules.push(
		{
			test: /\.(sa|sc|c)ss$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'postcss-loader',
				'sass-loader'
			],
		}
	);
} else {
	// Development plugins
	plugins.push(
		new CopyWebpackPlugin({
			patterns: [
				{
					from: assetsPath,
					to: buildPath + '/' + assetsDirName,
				}
			],
		}),
	);

	// Development rules
	rules.push(
		{
			test: /\.(sa|sc|c)ss$/,
			use: [
				'style-loader',
				'css-loader',
				'postcss-loader',
				'sass-loader',
			],
		}
	);
}

module.exports = {
	mode: isProduction ? 'production' : 'development',
	context: jsSourcePath,
	entry: {
		js: './index.js',
	},
	output: {
		path: buildPath,
		publicPath: isProduction ? '' : '/',
		filename: 'jsorrery.js',
	},
	optimization: {
		minimize: isProduction,
		minimizer: [new TerserPlugin({
			extractComments: false
		})],
	},
	performance: {
		hints: false,
	},
	module: {
		rules,
	},
	resolve: {
		extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
		modules: [
			path.resolve(__dirname, 'node_modules'),
			jsSourcePath,
		],
		alias: {
		},

	},
	plugins,
	devServer: {
		static: {
			directory: isProduction ? buildPath : sourcePath,
		},
		historyApiFallback: true,
		port: 2018,
		compress: isProduction,
		host: '0.0.0.0',
		headers: {
			"Access-Control-Allow-Origin": "*",
		}
	},
};
