import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import pkg from "./package.json";

const plugins = [
	replace({
		"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
	}),
	resolve(),
	commonjs(),
	json(),
];

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
			...plugins,
			babel({
				babelrc: false,
				exclude: "node_modules/**",
				presets: [["env", { modules: false }]],
				plugins: ["external-helpers"],
			}),
		],
	},
	{
		input: "src/index.js",
		plugins: [
			...plugins,
			babel({
				babelrc: false,
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
				plugins: ["external-helpers"],
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
			...plugins,
			babel({
				babelrc: false,
				exclude: "node_modules/**",
				presets: [["env", { modules: false }]],
				plugins: ["external-helpers"],
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
