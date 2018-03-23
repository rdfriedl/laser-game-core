const path = require("path");

module.exports = {
	entry: {
		"lazer-game-core": path.resolve(__dirname, "../src/index.js"),
	},
	output: {
		filename: "[name].js",
		library: "lazerGameCore",
		umdNamedDefine: true,
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
	devtool: "source-map",
};