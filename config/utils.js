const merge = require("webpack-merge");

const prodConfig = {
	mode: "production",
	output: {
		filename: "[name].min.js",
	},
};
const devConfig = {
	mode: "development",
	output: {
		filename: "[name].js",
	},
};
function makeConfigVariants(config) {
	return [merge(config, prodConfig), merge(config, devConfig)];
}

module.exports.makeConfigVariants = makeConfigVariants;
