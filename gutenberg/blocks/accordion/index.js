import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms, { hasNativeAccordion } from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	get description() {
		return hasNativeAccordion()
			? __(
					'Deprecated. Use the WordPress Accordion block for new content.',
					'ghostkit'
				)
			: __(
					'Toggle the visibility of content across your project.',
					'ghostkit'
				);
	},
	icon: getIcon('block-accordion', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/accordion/',
	},
	example: {
		innerBlocks: [
			{
				name: 'ghostkit/accordion-item',
				attributes: {
					active: true,
					heading: 'Accordion Item 1',
					itemNumber: 1,
				},
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
				name: 'ghostkit/accordion-item',
				attributes: {
					active: false,
					heading: 'Accordion Item 2',
					itemNumber: 2,
				},
			},
		],
	},
	edit,
	save,
	transforms,
};
