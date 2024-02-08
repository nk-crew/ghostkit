/**
 * Deprecated Extensions.
 *
 * @since v3.1.0
 */
import { merge } from 'lodash';

import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';

import migrateSR from './scroll-reveal';
import migrateStyles from './styles';

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
	if (!blockSettings.attributes.ghostkitId) {
		blockSettings.attributes.ghostkitId = {
			type: 'string',
		};
	}
	if (!blockSettings.attributes.ghostkitClassname) {
		blockSettings.attributes.ghostkitClassname = {
			type: 'string',
		};
	}
	if (!blockSettings.attributes.ghostkitStyles) {
		blockSettings.attributes.ghostkitStyles = {
			type: 'object',
		};
	}
	if (!blockSettings.attributes.ghostkitSR) {
		blockSettings.attributes.ghostkitSR = {
			type: 'string',
		};
	}
	if (!blockSettings.attributes.ghostkitCustomCSS) {
		blockSettings.attributes.ghostkitCustomCSS = {
			type: 'string',
		};
	}
	if (!blockSettings.attributes.ghostkitPosition) {
		blockSettings.attributes.ghostkitPosition = {
			type: 'object',
		};
	}
	if (!blockSettings.attributes.ghostkitSpacings) {
		blockSettings.attributes.ghostkitSpacings = {
			type: 'object',
		};
	}
	if (!blockSettings.attributes.ghostkitFrame) {
		blockSettings.attributes.ghostkitFrame = {
			type: 'object',
		};
	}

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
