import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';
import transforms, { hasNativeTabs } from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	get description() {
		return hasNativeTabs()
			? __(
					'Deprecated. Use the WordPress Tabs block for new content.',
					'ghostkit'
				)
			: __('Separate content on the tabs with titles.', 'ghostkit');
	},
	icon: getIcon('block-tabs', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/tabs/',
	},
	edit,
	save,
	transforms,
	deprecated,
};
