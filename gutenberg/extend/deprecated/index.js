/**
 * Deprecated Extensions.
 *
 * @since v3.1.0
 */

import migrateSR from './scroll-reveal';
import migrateStyles from './styles';

const { merge } = window.lodash;

import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';

function DeprecatedExtensions(props) {
	const { setAttributes } = props;

	useEffect(() => {
		// We have tp use timeout to prevent conflicts with block `customStylesCallback`.
		setTimeout(() => {
			// Migration to new attributes.
			let result = {};

			const newSR = migrateSR(props);
			const newStyles = migrateStyles(props);

			if (newSR) {
				result = merge(result, newSR);
			}
			if (newStyles) {
				result = merge(result, newStyles);
			}

			if (Object.keys(result).length) {
				setAttributes(result);
			}
		}, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {Function | Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent(
	(BlockEdit) =>
		function (props) {
			return (
				<>
					<BlockEdit {...props} />
					<DeprecatedExtensions {...props} />
				</>
			);
		},
	'withInspectorControl'
);

addFilter(
	'editor.BlockEdit',
	'ghostkit/deprecated/extensions',
	withInspectorControl
);
