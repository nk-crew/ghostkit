import classnames from 'classnames/dedupe';

import { applyFilters } from '@wordpress/hooks';

/**
 * Returns the ready to use className for grid column.
 *
 * @param {Object} props - block properties.
 *
 * @return {string} Classname for Grid container.
 */
export default function getColClass(props) {
	const { attributes } = props;
	let result = 'ghostkit-col';

	// Responsive classes.
	Object.keys(attributes).forEach((key) => {
		if (attributes[key]) {
			let prefix = key.split('_')[0];
			let type = key.split('_')[1];

			if (!type) {
				type = prefix;
				prefix = '';
			}

			if (
				type &&
				(type === 'size' ||
					type === 'order' ||
					type === 'verticalAlign')
			) {
				prefix = prefix && `-${prefix}`;

				switch (type) {
					case 'size':
						type = '';
						break;
					case 'order':
						type = `-${type}`;
						break;
					case 'verticalAlign':
						type = '-align-self';
						break;
					// no default
				}

				result = classnames(
					result,
					`ghostkit-col${type}${prefix || ''}${
						attributes[key] !== 'auto' ? `-${attributes[key]}` : ''
					}`
				);
			}
		}
	});

	// Sticky content.
	if (
		attributes.stickyContent &&
		typeof attributes.stickyContentOffset !== 'undefined'
	) {
		result = classnames(
			result,
			`ghostkit-col-sticky-${attributes.stickyContent}`
		);
	}

	result = applyFilters('ghostkit.editor.className', result, props);

	return result;
}
