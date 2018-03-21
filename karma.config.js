const path = require("path");
const webpackConfig = require("./webpack.config");
webpackConfig.mode = "development";
webpackConfig.devtool = "inline-source-map";
delete webpackConfig.externals;

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
			"karma-coverage",
		],

		browsers: ["ChromeHeadless", "FirefoxHeadless", "PhantomJS"],

		customLaunchers: {
			FirefoxHeadless: {
				base: "Firefox",
				flags: ["-headless"],
			},
		},

		files: ["node_modules/core-js/client/shim.min.js", "test/index.js"],

		preprocessors: {
			"test/index.js": ["webpack"],
		},

		webpack: webpackConfig,

		singleRun: true,

		reporters: ["mocha", "coverage"],

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

		coverageReporter: {
			dir: path.resolve(__dirname, "coverage/"),
			reporters: [{ type: "lcov", subdir: "." }],
		},
	});
};
