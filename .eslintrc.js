module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'xo',
	],
	rules: {
		'no-unused-vars': 'error',
		quotes: ['error', 'single']
	},
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: [
		'vue',
	],
	rules: {
	},
};
