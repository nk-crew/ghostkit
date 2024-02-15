import { __ } from '@wordpress/i18n';
import { insert } from '@wordpress/rich-text';

import getLorem from './get-lorem';

// There is a limitation for command.
// - min 7 = `lorem1 `
// - max 9 = `lorem999 `
const MIN_LENGTH = 7;
const MAX_LENGTH = 9;

export const name = 'ghostkit/lorem-ipsum';

export const settings = {
	title: __('Lorem Ipsum', 'ghostkit'),
	tagName: 'span',
	className: 'ghostkit-lorem-ipsum',
	__unstableInputRule(value) {
		const { start, text } = value;
		const characterBefore = text[start - 1];

		if (start < MIN_LENGTH) {
			return value;
		}

		// Only run when `space` is typed.
		if (characterBefore !== ' ') {
			return value;
		}

		const startIndex = text.lastIndexOf('lorem', start);
		const endIndex = start;
		const length = endIndex - startIndex;

		if (startIndex === -1) {
			return value;
		}

		if (length < MIN_LENGTH || length > MAX_LENGTH) {
			return value;
		}

		const command = text.substring(startIndex, endIndex);
		const loremSize = command.match(/^lorem(\d+) $/);

		if (!loremSize || !loremSize[1]) {
			return value;
		}

		const loremSizeInt = parseInt(loremSize[1], 10);
		const startWithUppercase = startIndex === 0;
		const endWithComma = loremSizeInt > 5;

		const loremText = getLorem({
			count: loremSizeInt,
			startWithUppercase,
			endWithComma,
		});

		const newValue = insert(value, loremText, startIndex, endIndex);

		return newValue;
	},
	edit: null,
};
