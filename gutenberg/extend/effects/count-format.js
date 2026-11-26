function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSiteLocale() {
	try {
		return Intl.NumberFormat.supportedLocalesOf(
			document.documentElement.lang
		)[0];
	} catch (_e) {
		return undefined;
	}
}

/**
 * Read the number in a counter's text with the separators of its format.
 *
 * @param {string} text      counter text, such as "1,234.50+".
 * @param {string} type      "locale" or "custom".
 * @param {Object} separators custom separators.
 * @param {string} separators.thousands thousands separator.
 * @param {string} separators.decimal   decimal separator.
 *
 * @return {Object|null} the value, and a function that writes any value in the same format and text. Null when the text has no number.
 */
export default function getCountFormat(text, type, { thousands, decimal }) {
	const locale = type === 'locale' ? getSiteLocale() : 'en-US';
	let groupSeparator = thousands;
	let decimalSeparator = decimal || '.';

	if (type === 'locale') {
		const parts = new Intl.NumberFormat(locale).formatToParts(11111.1);

		groupSeparator = parts.find((p) => p.type === 'group')?.value || '';
		decimalSeparator =
			parts.find((p) => p.type === 'decimal')?.value || '.';
	}

	// A space-like separator also matches the plain or no-break space people type.
	let groupPattern = '';
	if (groupSeparator && !groupSeparator.trim()) {
		groupPattern = '\\s';
	} else if (groupSeparator) {
		groupPattern = escapeRegExp(groupSeparator);
	}

	const match = text.match(
		new RegExp(
			`(-?\\d+${groupPattern ? `(?:${groupPattern}\\d+)*` : ''})(?:${escapeRegExp(decimalSeparator)}(\\d+))?`
		)
	);

	if (!match) {
		return null;
	}

	const [token, integer, fraction = ''] = match;
	const digits = fraction.length;
	const value = Number(
		`${groupPattern ? integer.replace(new RegExp(groupPattern, 'g'), '') : integer}.${fraction || '0'}`
	);
	const formatter = new Intl.NumberFormat(locale, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
		useGrouping: !!groupSeparator,
	});
	const before = text.slice(0, match.index);
	const after = text.slice(match.index + token.length);

	return {
		value,
		render(current) {
			const formatted = formatter
				.formatToParts(current)
				.map((part) => {
					if (part.type === 'group') {
						return groupSeparator;
					}
					if (part.type === 'decimal') {
						return decimalSeparator;
					}
					return part.value;
				})
				.join('');

			return before + formatted + after;
		},
	};
}
