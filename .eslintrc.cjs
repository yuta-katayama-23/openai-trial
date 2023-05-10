/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'import/no-extraneous-dependencies': ['warn', { packageDir: './' }]
	},
	ignorePatterns: ['/node_modules/', '/dist/', '/openapi/', '/static/']
};
