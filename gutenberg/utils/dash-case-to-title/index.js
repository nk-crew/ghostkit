/**
 * Dash case to Title case.
 *
 * dashCaseToTitle('user-id') => "User Id"
 * dashCaseToTitle('wait-a-moment') => "Wait A Moment"
 *
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 *
 * @param {string} str - dash-cased string.
 * @return {string} - new title-cased string.
 */
export default function dashCaseToTitle(str) {
	if (typeof str !== 'string') {
		return str;
	}

	return str
		.split(/[.,/ \-_]/)
		.map((word) =>
			word && word.length
				? word.replace(word[0], word[0].toUpperCase())
				: word
		)
		.join(' ');
}
