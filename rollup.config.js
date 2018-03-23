import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
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
		plugins: [resolve(), commonjs(), json()],
		external: Object.keys(pkg.dependencies),
		output: {
			file: pkg.module,
			format: "es",
			sourcemap: true,
		},
	},
];
