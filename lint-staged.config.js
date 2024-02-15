const micromatch = require('micromatch');

function excludeVendor(lint) {
	return (filenames) => {
		const files = micromatch(filenames, [
			'!**/.*',
			'!**/vendor/**/*',
			'!**/build/**/*',
			'!**/dist/**/*',
			'!**/dist-zip/**/*',
			'!**/composer-libraries/**/*',
			'!**/assets/vendor/**/*',
			'!**/tests/themes/**/*',
			'!**/tests/plugins/**/*',
		]);

		if (files && files.length) {
			return `${lint} ${files.join(' ')}`;
		}

		return [];
	};
}

module.exports = {
	'**/*.php': excludeVendor('composer run-script lint'),
	'**/*.{css,scss}': excludeVendor('wp-scripts lint-style'),
	'**/*.{js,jsx}': excludeVendor('wp-scripts lint-js'),
};
