import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import pkg from "./package.json";

const configs = [
	{
		input: "src/index.js",
		output: {
			name: "lazerGameCore",
			file: pkg.browser,
			format: "umd",
			sourcemap: true,
		},
		plugins: [
			resolve(),
			commonjs(),
			json(),
			babel({
				exclude: "node_modules/**",
			}),
		],
	},
	{
		input: "src/index.js",
		plugins: [
			resolve(),
			commonjs(),
			json(),
			babel({
				exclude: "node_modules/**",
				presets: [
					[
						"env",
						{
							modules: false,
							targets: {
								node: "current",
							},
						},
					],
				],
			}),
		],
		external: Object.keys(pkg.dependencies),
		output: {
			file: pkg.main,
			format: "cjs",
			sourcemap: true,
		},
	},
	{
		input: "src/index.js",
		plugins: [
			resolve(),
			commonjs(),
			json(),
			babel({
				exclude: "node_modules/**",
				presets: [["env", { modules: false }]],
			}),
		],
		external: Object.keys(pkg.dependencies),
		output: {
			file: pkg.module,
			format: "es",
			sourcemap: true,
		},
	},
];

const minifiedConfigs = configs.map(config => ({
	...config,
	plugins: [...config.plugins, uglify()],
	output: {
		...config.output,
		file: config.output.file.replace(".js", ".min.js"),
	},
}));

export default [...configs, ...minifiedConfigs];
