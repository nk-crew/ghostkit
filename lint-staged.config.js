const {
	createLintStagedConfig,
} = require('@nk-crew/plugin-toolkit/lint-staged');

module.exports = createLintStagedConfig({
	ignore: [
		'!**/assets/vendor/**/*',
		'!**/composer-libraries/**/*',
		'!**/tests/plugins/**/*',
		'!**/tests/themes/**/*',
	],
});
