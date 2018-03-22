module.exports = {
	output: {
		filename: "lazer-game-core.js",
		libraryTarget: "umd",
		library: "lazerGameCore",
	},
	externals: {
		lodash: {
			commonjs: "lodash",
			commonjs2: "lodash",
			amd: "lodash",
			root: "_",
		},
		"regexp-events": {
			commonjs: "regexp-events",
			commonjs2: "regexp-events",
			amd: "regexp-events",
			root: "RegExpEvents",
		},
		p2: {
			commonjs: "p2",
			commonjs2: "p2",
			amd: "p2",
			root: "p2",
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "source-map-loader",
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: [["env", { modules: false }]],
					cacheDirectory: true,
				},
			},
		],
	},
	devtool: "source-maps",
};
