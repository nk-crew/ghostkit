import './deprecated';
import './attributes';
import './styles';
import './effects';
import './position';
import './spacings';
import './frame';
import './transform';
import './custom-css';
import './display';
import './toc-headings';
import './toolbar-templates';
import './block-actions-copy-paste';

import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import ApplyFilters from '../components/apply-filters';

/**
 * Override the default edit UI to include GhostKit extensions
 *
 * @param {Function | Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withGhostKitExtensions = createHigherOrderComponent(
	(OriginalComponent) => {
		function GhostKitExtensionsWrapper(props) {
			const hasExtensionsSupport = hasBlockSupport(props.name, [
				'ghostkit',
			]);

			if (!hasExtensionsSupport) {
				return <OriginalComponent {...props} />;
			}

			return (
				<>
					<OriginalComponent {...props} />
					{/*
					 * Used priorities:
					 * 11 - Effects
					 * 12 - Position
					 * 13 - Spacings
					 * 14 - Frame
					 * 15 - Transform
					 * 16 - Custom CSS
					 * 17 - Display Conditions
					 */}
					<ApplyFilters
						name="ghostkit.editor.extensions"
						props={props}
					/>
				</>
			);
		}

		return GhostKitExtensionsWrapper;
	},
	'withGhostKitExtensions'
);

/**
 * Add `ghostkit` attribute to deprecated blocks settings.
 *
 * @param {Object} blockSettings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(blockSettings) {
	// Add attribute to All blocks.
	// Previously we used hasBlockSupport function, but it's not working correctly for all blocks
	// and leads to issues with blocks that are not registered yet (probably in deprecated block variations).
	if (blockSettings.attributes && !blockSettings.attributes.ghostkit) {
		blockSettings.attributes.ghostkit = {
			type: 'object',
		};
	}

	return blockSettings;
}

addFilter('editor.BlockEdit', 'ghostkit/extensions', withGhostKitExtensions);

addFilter(
	'blocks.registerBlockType',
	'ghostkit/extensions/additional-attributes',
	addAttribute
);
