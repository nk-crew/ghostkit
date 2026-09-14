const {
	createLintStagedConfig,
} = require('@nk-crew/plugin-toolkit/lint-staged');

module.exports = createLintStagedConfig({
	ignore: [
		'!**/assets/vendor/**/*',
		'!**/tests/plugins/**/*',
		'!**/tests/themes/**/*',
	],
});
