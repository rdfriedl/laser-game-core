const path = require("path");

// rollup plugins
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const json = require("rollup-plugin-json");
const replace = require("rollup-plugin-replace");

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
			"karma-rollup-preprocessor",
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
			"test/index.js": ["rollup"],
		},

		rollupPreprocessor: {
			output: {
				format: "iife",
				sourcemap: "inline",
			},
			plugins: [
				replace({
					"process.env.NODE_ENV": '"development"',
				}),
				resolve(),
				commonjs(),
				json(),
				babel({
					exclude: "node_modules/**",
					presets: [
						[
							"env",
							{
								useBuiltIns: true,
								modules: false,
							},
						],
					],
					plugins: [
						"external-helpers",
						[
							"istanbul",
							{
								exclude: ["dist/**/*.js", "test/**/*.js", "**/*.spec.js"],
							},
						],
					],
					sourceMaps: true,
					babelrc: false,
				}),
			],
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
