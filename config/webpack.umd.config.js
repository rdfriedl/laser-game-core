const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const { makeConfigVariants } = require("./utils");

const config = merge(baseConfig, {
	output: {
		libraryTarget: "umd",
	},
});

module.exports = makeConfigVariants(config);
