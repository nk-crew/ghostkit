const path = require('path');

const glob = require('glob');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const RtlCssPlugin = require('rtlcss-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { getWordPressSrcDirectory } = require('@wordpress/scripts/utils');

const vendorFiles = [
	{
		source: 'node_modules/gist-simple/dist/gist-simple.css',
		destination: 'assets/vendor/gist-simple/dist/gist-simple.css',
	},
	{
		source: 'node_modules/gist-simple/dist/gist-simple.min.js',
		destination: 'assets/vendor/gist-simple/dist/gist-simple.min.js',
	},
	{
		source: 'node_modules/gist-simple/dist/gist-simple.min.js.map',
		destination: 'assets/vendor/gist-simple/dist/gist-simple.min.js.map',
	},
	{
		source: 'node_modules/ivent/dist/ivent.min.js',
		destination: 'assets/vendor/ivent/dist/ivent.min.js',
	},
	{
		source: 'node_modules/ivent/dist/ivent.min.js.map',
		destination: 'assets/vendor/ivent/dist/ivent.min.js.map',
	},
	{
		source: 'node_modules/jarallax/dist/jarallax-video.min.js',
		destination: 'assets/vendor/jarallax/dist/jarallax-video.min.js',
	},
	{
		source: 'node_modules/jarallax/dist/jarallax-video.min.js.map',
		destination: 'assets/vendor/jarallax/dist/jarallax-video.min.js.map',
	},
	{
		source: 'node_modules/jarallax/dist/jarallax.min.js',
		destination: 'assets/vendor/jarallax/dist/jarallax.min.js',
	},
	{
		source: 'node_modules/jarallax/dist/jarallax.min.js.map',
		destination: 'assets/vendor/jarallax/dist/jarallax.min.js.map',
	},
	{
		source: 'node_modules/jarallax/dist/jarallax.css',
		destination: 'assets/vendor/jarallax/dist/jarallax.css',
	},
	{
		source: 'node_modules/swiper/swiper-bundle.min.js',
		destination: 'assets/vendor/swiper/swiper-bundle.min.js',
	},
	{
		source: 'node_modules/swiper/swiper-bundle.min.js.map',
		destination: 'assets/vendor/swiper/swiper-bundle.min.js.map',
	},
	{
		source: 'node_modules/swiper/swiper-bundle.min.css',
		destination: 'assets/vendor/swiper/swiper-bundle.min.css',
	},
	{
		source: 'node_modules/luxon/build/global/luxon.min.js',
		destination: 'assets/vendor/luxon/build/global/luxon.min.js',
	},
	{
		source: 'node_modules/luxon/build/global/luxon.min.js.map',
		destination: 'assets/vendor/luxon/build/global/luxon.min.js.map',
	},
	{
		source: 'node_modules/@lottiefiles/lottie-player/dist/lottie-player.js',
		destination: 'assets/vendor/lottie-player/dist/lottie-player.js',
	},
	{
		source: 'node_modules/@lottiefiles/lottie-player/dist/lottie-player.js.map',
		destination: 'assets/vendor/lottie-player/dist/lottie-player.js.map',
	},
	{
		source: 'node_modules/motion/dist/motion.min.js',
		destination: 'assets/vendor/motion/dist/motion.min.js',
	},
];

defaultConfig.module.rules[2].use[1].options.url = false;

// Prepare JS for assets.
const entryAssetsJs = glob
	.sync([
		'./assets/js/**.js',
		'./assets/admin/js/**.js',
		'./assets/js/utils/**.js',
		'./gutenberg/index.js',
		'./gutenberg/blocks/**/frontend.js',
		'./gutenberg/extend/**/frontend.js',
		'./gutenberg/style-variants/**/frontend.js',
		'./settings/index.js',
	])
	.reduce(function (entries, entry) {
		const name = entry.replace('.js', '');
		entries[name] = path.resolve(process.cwd(), entry);
		return entries;
	}, {});

// Prepare CSS for assets.
const entryAssetsCss = glob
	.sync([
		'./assets/**/**.scss',
		'./gutenberg/style.scss',
		'./gutenberg/editor.scss',
		'./gutenberg/blocks/**/styles/style.scss',
		'./settings/style.scss',
	])
	.filter((entry) => {
		const filename = path.basename(entry);

		// Exclude file names started with _
		return !/^_/.test(filename);
	})
	.reduce(function (entries, entry) {
		const name = entry.replace('.scss', '');

		entries[name] = path.resolve(process.cwd(), entry);

		return entries;
	}, {});

const newConfig = {
	...defaultConfig,
	entry: {
		// Assets JS.
		...entryAssetsJs,
		// Assets CSS.
		...entryAssetsCss,
	},

	// Display minimum info in terminal.
	stats: 'minimal',

	performance: {
		// Disable performance hints in console about too large chunks for Gutenberg assets.
		assetFilter(assetFilename) {
			return !assetFilename.startsWith('gutenberg/');
		},
	},

	module: {
		...defaultConfig.module,
		rules: [...defaultConfig.module.rules],
	},
	plugins: [
		...defaultConfig.plugins,
		new RtlCssPlugin({
			filename: `[name]-rtl.css`,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: '**/block.json',
					context: getWordPressSrcDirectory(),
					noErrorOnMissing: true,
					transform(content, absoluteFrom) {
						const convertExtension = (p) => {
							return p.replace(/\.(j|t)sx?$/, '.js');
						};

						if (path.basename(absoluteFrom) === 'block.json') {
							const blockJson = JSON.parse(content.toString());
							['viewScript', 'script', 'editorScript'].forEach(
								(key) => {
									if (Array.isArray(blockJson[key])) {
										blockJson[key] =
											blockJson[key].map(
												convertExtension
											);
									} else if (
										typeof blockJson[key] === 'string'
									) {
										blockJson[key] = convertExtension(
											blockJson[key]
										);
									}
								}
							);

							return JSON.stringify(blockJson, null, 2);
						}

						return content;
					},
				},
			],
		}),
		new FileManagerPlugin({
			events: {
				onEnd: {
					copy: [...vendorFiles],
				},
			},
			runOnceInWatchMode: false,
			runTasksInSeries: true,
		}),
	].filter(Boolean),
	watchOptions: {
		ignored: ['**/vendor/**'],
	},
	optimization: {
		...defaultConfig.optimization,
		splitChunks: {
			cacheGroups: {
				...defaultConfig.optimization.splitChunks.cacheGroups,
				style: {
					type: 'css/mini-extract',
					test: /[\\/]style(\.module)?\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
					name(_, chunks, cacheGroupKey) {
						const chunkName =
							chunks[chunks.length > 1 ? 1 : 0].name;
						let cssOutput = `${path.dirname(chunkName)}/${cacheGroupKey}-${path.basename(
							chunkName
						)}`;
						const foundingChunk = chunkName
							.split(path.win32.sep)
							.join(path.posix.sep);

						if (
							(foundingChunk.indexOf('admin/css/') > -1 ||
								foundingChunk.indexOf('gutenberg/') > -1 ||
								foundingChunk.indexOf('settings/') > -1) &&
							cacheGroupKey === 'style'
						) {
							cssOutput = `${path.dirname(chunkName)}/${path.basename(chunkName)}`;
						}

						if (
							chunkName.indexOf('settings/index') > -1 &&
							cacheGroupKey === 'style'
						) {
							cssOutput = `${path.dirname(chunkName)}/${cacheGroupKey}-${path.basename(chunkName)}`;
						}
						return cssOutput;
					},
				},
			},
		},
	},
};

// Production only.
if (isProduction) {
	// Remove JS files created for styles
	// to prevent enqueue it on production.
	newConfig.plugins = [new RemoveEmptyScriptsPlugin(), ...newConfig.plugins];
}

// Development only.
if (!isProduction) {
	newConfig.devServer = {
		...newConfig.devServer,
		// Support for dev server on all domains.
		allowedHosts: 'all',
	};

	// Fix HMR is not working with multiple entries.
	// @thanks https://github.com/webpack/webpack-dev-server/issues/2792#issuecomment-806983882
	newConfig.optimization.runtimeChunk = 'single';
}

newConfig.module.rules = newConfig.module.rules.map((rule) => {
	if (/svg/.test(rule.test)) {
		return { ...rule, exclude: /\.svg$/i };
	}

	return rule;
});

newConfig.module.rules.push({
	test: /\.svg$/,
	use: [
		{
			loader: '@svgr/webpack',
			options: {
				svgoConfig: {
					plugins: [
						{
							name: 'preset-default',
							params: {
								overrides: {
									removeViewBox: false,
								},
							},
						},
					],
				},
			},
		},
		{
			loader: 'url-loader',
		},
	],
});

module.exports = newConfig;
