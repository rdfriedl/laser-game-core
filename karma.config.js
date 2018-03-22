const path = require("path");
const webpackConfig = require("./config/webpack.base");
webpackConfig.mode = "development";
webpackConfig.devtool = "inline-source-map";
delete webpackConfig.externals;
webpackConfig.module.rules.push({
	test: /\.js$/,
	include: path.resolve(__dirname, "./src/"),
	exclude: /node_modules|-spec\.js$/,
	loader: "istanbul-instrumenter-loader",
	options: { esModules: true },
	enforce: "post",
});

module.exports = function(config) {
	config.set({
		frameworks: ["source-map-support", "mocha", "sinon-chai"],

		plugins: [
			"karma-chrome-launcher",
			"karma-firefox-launcher",
			"karma-phantomjs-launcher",

			"karma-mocha",
			"karma-mocha-reporter",
			"karma-sinon-chai",
			"karma-source-map-support",
			"karma-webpack",
			"karma-coverage-istanbul-reporter",
		],

		browsers: ["ChromeHeadless", "FirefoxHeadless", "PhantomJS"],

		customLaunchers: {
			FirefoxHeadless: {
				base: "Firefox",
				flags: ["-headless"],
			},
		},

		files: ["node_modules/core-js/client/shim.min.js", { pattern: "test/index.js", watched: false }],

		preprocessors: {
			"test/index.js": ["webpack"],
		},

		webpack: webpackConfig,

		webpackMiddleware: {
			stats: "errors-only",
		},

		reporters: ["mocha", "coverage-istanbul"],

		client: {
			captureConsole: false,
			mocha: {
				reporter: "html",
			},
		},

		mochaReporter: {
			output: "autowatch",
			showDiff: true,
		},

		coverageIstanbulReporter: {
			reports: ["text-summary", "lcov"],
			dir: path.resolve(__dirname, "coverage"),
			fixWebpackSourcePaths: true,
			skipFilesWithNoCoverage: false,

			// thresholds: {
			// 	emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
			// 	global: { // thresholds for all files
			// 		statements: 90,
			// 		functions: 90
			// 	},
			// 	each: { // thresholds per file
			// 		statements: 80,
			// 		functions: 80
			// 	}
			// }
		},
	});
};
