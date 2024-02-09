import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-changelog', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/changelog/',
	},
	example: {
		attributes: {
			version: '1.0.0',
			date: new Date().toLocaleDateString(),
		},
		innerBlocks: [
			{
				name: 'core/list',
				attributes: {
					className: 'is-style-none',
				},
				innerBlocks: [
					{
						name: 'core/list-item',
						attributes: {
							content: `<span class="ghostkit-badge" style="background: #4ab866">${__('Added', 'ghostkit')}</span>${__('Something', 'ghostkit')}`,
						},
					},
					{
						name: 'core/list-item',
						attributes: {
							content: `<span class="ghostkit-badge" style="background: #0366d6">${__('Fixed', 'ghostkit')}</span>${__('Something', 'ghostkit')}`,
						},
					},
					{
						name: 'core/list-item',
						attributes: {
							content: `<span class="ghostkit-badge" style="background: #4ab866">${__('Improved', 'ghostkit')}</span>${__('Something', 'ghostkit')}`,
						},
					},
				],
			},
		],
	},
	edit,
	save,
};
