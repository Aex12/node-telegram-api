module.exports = {
	env: {
		commonjs: true,
		es6: true,
		node: true,
	},
	extends: ['airbnb-base'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	// plugins: ['prettier'],
	rules: {
		indent: ['error', 'tab'],
		'space-before-function-paren': ['error', 'always'],
		quotes: ['error', 'single', { avoidEscape: true }],
		'no-tabs': ['warn', { allowIndentationTabs: true }],
		camelcase: 'off',
		'object-curly-newline': ['error', { 'consistent': true }]
	},
};
