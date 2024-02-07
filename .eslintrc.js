const groups = {
	// The default grouping, but with no blank lines.
	groups: [
		// Side effect imports.
		['^\\u0000'],
		// Node.js builtins prefixed with `node:`.
		['^node:'],
		// Packages.
		// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
		['^@?\\w'],
		// WordPress imports
		['^@wordpress'],
		// Absolute imports and other imports such as Vue-style `@/foo`.
		// Anything not matched in another group.
		['^'],
		// Relative imports.
		// Anything that starts with a dot.
		['^\\.'],
	],
};

module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	rules: {
		'@wordpress/no-unsafe-wp-apis': 0,
		'@wordpress/i18n-translator-comments': 0,
		'jsdoc/no-undefined-types': 0,
		'jsdoc/require-param-type': 0,
		'jsdoc/require-returns-description': 0,
		'jsdoc/check-tag-names': 0,
		'react-hooks/rules-of-hooks': 0,
		'jsdoc/check-param-names': 0,
		'simple-import-sort/imports': ['error', groups],
		'simple-import-sort/exports': 'error',
	},
	settings: {
		'import/core-modules': ['jquery', 'lodash'],
	},
	plugins: ['simple-import-sort'],
};
