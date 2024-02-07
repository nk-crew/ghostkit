/**
 * Deprecated Extensions.
 *
 * @since v3.1.0
 */
/**
 * Internal dependencies
 */
import migrateSR from './scroll-reveal';
import migrateStyles from './styles';

/**
 * WordPress dependencies
 */
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

/**
 * Add old attributes to all blocks to allow migrations from old attributes to new one.
 *
 * @param {Object} blockSettings Original block settings.
 * @param {string} name          Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(blockSettings) {
	// prepare settings of block + deprecated blocks.
	const eachSettings = [blockSettings];
	if (blockSettings.deprecated && blockSettings.deprecated.length) {
		blockSettings.deprecated.forEach((item) => {
			eachSettings.push(item);
		});
	}

	eachSettings.forEach((settings) => {
		if (settings.attributes) {
			if (!settings.attributes.ghostkitId) {
				settings.attributes.ghostkitId = {
					type: 'string',
				};
			}
			if (!settings.attributes.ghostkitClassname) {
				settings.attributes.ghostkitClassname = {
					type: 'string',
				};
			}
			if (!settings.attributes.ghostkitStyles) {
				settings.attributes.ghostkitStyles = {
					type: 'object',
				};
			}
			if (!settings.attributes.ghostkitSR) {
				settings.attributes.ghostkitSR = {
					type: 'string',
				};
			}
			if (!settings.attributes.ghostkitCustomCSS) {
				settings.attributes.ghostkitCustomCSS = {
					type: 'string',
				};
			}
			if (!settings.attributes.ghostkitPosition) {
				settings.attributes.ghostkitPosition = {
					type: 'object',
				};
			}
			if (!settings.attributes.ghostkitSpacings) {
				settings.attributes.ghostkitSpacings = {
					type: 'object',
				};
			}
			if (!settings.attributes.ghostkitFrame) {
				settings.attributes.ghostkitFrame = {
					type: 'object',
				};
			}
		}
	});

	return blockSettings;
}

addFilter(
	'editor.BlockEdit',
	'ghostkit/deprecated/extensions',
	withInspectorControl
);

addFilter(
	'blocks.registerBlockType',
	'ghostkit/deprecated/extensions/additional-attributes',
	addAttribute
);
