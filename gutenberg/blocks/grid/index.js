import './awb-fallback';

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import getBackgroundStyles from './get-background-styles';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-grid', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/advanced-columns/',
		customStylesCallback(attributes) {
			const { gap, gapCustom, gapVerticalCustom } = attributes;

			const styles = {
				'--gkt-grid__gap': undefined,
				'--gkt-grid__gap-vertical': undefined,
				...getBackgroundStyles(attributes),
			};

			// Custom Gap.
			if (gap === 'custom') {
				if (typeof gapCustom !== 'undefined' && gapCustom !== '') {
					// we need to use `%` unit because of conflict with complex calc() and 0 value.
					const unit = gapCustom ? 'px' : '%';

					styles['--gkt-grid__gap'] = `${gapCustom}${unit}`;
				}

				if (
					typeof gapVerticalCustom !== 'undefined' &&
					gapVerticalCustom !== ''
				) {
					// we need to use `%` unit because of conflict with complex calc() and 0 value.
					const unit = gapVerticalCustom ? 'px' : '%';

					styles['--gkt-grid__gap-vertical'] =
						`${gapVerticalCustom}${unit}`;
				}
			}

			return styles;
		},
		customStylesFilter(styles, data, isEditor, attributes) {
			// change custom styles in Editor.
			if (isEditor && attributes?.ghostkit?.id) {
				// background.
				styles = styles.replace(
					new RegExp('> .nk-awb .jarallax-img', 'g'),
					'> .awb-gutenberg-preview-block .jarallax-img'
				);
			}
			return styles;
		},
	},
	example: {
		attributes: {
			columns: 2,
		},
		innerBlocks: [
			{
				name: 'ghostkit/grid-column',
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content:
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
						},
					},
				],
			},
			{
				name: 'ghostkit/grid-column',
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content:
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
						},
					},
				],
			},
		],
	},
	edit,
	save,
	transforms,
};

/**
 * Add data attribute to hide block from editor when inserting templates.
 *
 * @param {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
export const withClasses = createHigherOrderComponent(
	(BlockListBlock) =>
		function (props) {
			const { name: blockName } = props;

			if (
				blockName === 'ghostkit/grid' &&
				props.attributes.isTemplatesModalOnly
			) {
				return (
					<BlockListBlock
						{...props}
						data-ghostkit-grid-templates-modal-only="true"
					/>
				);
			}

			return <BlockListBlock {...props} />;
		}
);

addFilter('editor.BlockListBlock', 'ghostkit/grid/with-classes', withClasses);
