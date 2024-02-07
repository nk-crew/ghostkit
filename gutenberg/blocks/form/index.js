import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-form', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/form/',
	},
	example: {
		innerBlocks: [
			{
				name: 'ghostkit/form-field-email',
				attributes: {
					required: true,
				},
			},
			{
				name: 'ghostkit/form-field-text',
				attributes: {
					required: true,
					nameFields: 'first-last',
					description: __('First', 'ghostkit'),
					descriptionLast: __('Last', 'ghostkit'),
				},
			},
			{
				name: 'ghostkit/form-field-textarea',
				attributes: {
					label: __('Message', 'ghostkit'),
					placeholder: __('Write your message here…', 'ghostkit'),
				},
			},
			{
				name: 'ghostkit/form-submit-button',
			},
		],
	},
	edit,
	save,
};
