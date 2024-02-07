import { LoremIpsum } from 'lorem-ipsum';

import latinWords from './latin.json';

/**
 * Returns random integer between <code>from</code> and <code>to</code> values
 *
 * @param from
 * @param to
 */
function rand(from, to) {
	return Math.floor(Math.random() * (to - from) + from);
}

/**
 * Insert commas at randomly selected words. This function modifies values
 * inside `words` array
 *
 * @param words
 */
function insertCommas(words) {
	if (words.length < 2) {
		return words;
	}

	words = words.slice();
	const len = words.length;
	const hasComma = /,$/;
	let totalCommas = 0;

	if (len > 3 && len <= 6) {
		totalCommas = rand(0, 1);
	} else if (len > 6 && len <= 12) {
		totalCommas = rand(0, 2);
	} else {
		totalCommas = rand(1, 4);
	}

	for (let i = 0, pos; i < totalCommas; i += 1) {
		pos = rand(0, len - 2);
		if (!hasComma.test(words[pos])) {
			words[pos] += ',';
		}
	}

	return words;
}

export default function getLorem({
	count,
	startWithUppercase = false,
	endWithComma = false,
}) {
	const lorem = new LoremIpsum({
		words: latinWords,
	});

	let result = lorem.generateWords(count);
	const resultArray = insertCommas(result.split(' '));

	result = resultArray.join(' ');

	if (startWithUppercase) {
		result = result.charAt(0).toUpperCase() + result.slice(1);
	}

	if (endWithComma) {
		result += '.';
	}

	return result;
}
