import camelCaseToDash from '../../utils/camel-case-to-dash';
import { maybeDecode } from '../../utils/encode-decode';

const cssPropsWithPixels = [
	'border-top-width',
	'border-right-width',
	'border-bottom-width',
	'border-left-width',
	'border-width',
	'border-bottom-left-radius',
	'border-bottom-right-radius',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-radius',
	'bottom',
	'top',
	'left',
	'right',
	'font-size',
	'height',
	'width',
	'min-height',
	'min-width',
	'max-height',
	'max-width',
	'margin-left',
	'margin-right',
	'margin-top',
	'margin-bottom',
	'margin',
	'padding-left',
	'padding-right',
	'padding-top',
	'padding-bottom',
	'padding',
	'outline-width',
];

/**
 * Get styles from object.
 *
 * @param {Object}  data     - styles data.
 * @param {string}  selector - current styles selector (useful for nested styles).
 * @param {boolean} escape   - escape strings to save in database.
 * @return {string} - ready to use styles string.
 */
export default function getStyles(data = {}, selector = '', escape = true) {
	const result = {};
	let resultCSS = '';

	// add styles.
	Object.keys(data).forEach((key) => {
		// object values.
		if (data[key] !== null && typeof data[key] === 'object') {
			// media for different screens
			if (/^media_/.test(key)) {
				resultCSS += `${
					resultCSS ? ' ' : ''
				}@media #{ghostkitvar:${key}} { ${getStyles(
					data[key],
					selector,
					escape
				)} }`;

				// @supports css
			} else if (/^@supports/.test(key)) {
				resultCSS += `${resultCSS ? ' ' : ''}${key} { ${getStyles(
					data[key],
					selector,
					escape
				)} }`;

				// nested selectors.
			} else {
				let nestedSelector = selector;

				if (nestedSelector) {
					if (key.indexOf('&') !== -1) {
						nestedSelector = key.replace(/&/g, nestedSelector);
					} else {
						nestedSelector = `${nestedSelector} ${key}`;
					}
				} else {
					nestedSelector = key;
				}

				resultCSS +=
					(resultCSS ? ' ' : '') +
					getStyles(data[key], nestedSelector, escape);
			}

			// style properties and values.
		} else if (typeof data[key] !== 'undefined' && data[key] !== false) {
			// fix selector > and < usage.
			if (escape) {
				selector = selector.replace(/>/g, '&gt;');
				selector = selector.replace(/</g, '&lt;');
			}

			if (!result[selector]) {
				result[selector] = '';
			}

			const isCustom = key === 'custom';
			const propName = camelCaseToDash(key);
			let propValue = data[key];

			// Prepare custom styles as text.
			if (isCustom) {
				if (
					typeof propValue !== 'undefined' &&
					propValue !== '' &&
					selector
				) {
					if (!result.custom) {
						result.custom = '';
					} else {
						result.custom += ' ';
					}

					result.custom += `${maybeDecode(propValue).replace(
						/selector/g,
						selector
					)}`;
				}

				// Prepare styles from props.
			} else {
				const withImportant = / !important$/.test(propValue);
				if (withImportant) {
					propValue = propValue.replace(/ !important$/, '');
				}

				// add pixels.
				if (
					// Ensure that value is number, or string, which contains numbers.
					((typeof propValue === 'number' && propValue !== 0) ||
						(typeof propValue === 'string' &&
							propValue &&
							/^[0-9.-]*$/.test(propValue))) &&
					// Unsure that property support units.
					// For example, we should not add pixes to z-index.
					cssPropsWithPixels.includes(propName)
				) {
					propValue += 'px';
				}

				// add custom css.
				if (typeof propValue !== 'undefined' && propValue !== '') {
					if (withImportant) {
						propValue += ' !important';
					}

					result[selector] += ` ${propName}: ${propValue};`;
				}
			}
		}
	});

	// add styles to selectors.
	Object.keys(result).forEach((key) => {
		if (key === 'custom') {
			resultCSS = `${result[key]}${resultCSS ? ` ${resultCSS}` : ''}`;
		} else {
			resultCSS = `${key} {${result[key]} }${
				resultCSS ? ` ${resultCSS}` : ''
			}`;
		}
	});

	return resultCSS;
}
