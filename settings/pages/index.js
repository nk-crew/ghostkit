import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Blocks from './blocks';
import Breakpoints from './breakpoints';
import CssJs from './css-js';
import Fonts from './fonts';
import Icons from './icons';
import Typography from './typography';

export default function () {
	return applyFilters('ghostkit.settings.pages', {
		blocks: {
			label: __('Blocks', 'ghostkit'),
			block: Blocks,
		},
		icons: {
			label: __('Icons', 'ghostkit'),
			block: Icons,
		},
		typography: {
			label: __('Typography', 'ghostkit'),
			block: Typography,
		},
		fonts: {
			label: __('Fonts', 'ghostkit'),
			block: Fonts,
		},
		breakpoints: {
			label: __('Breakpoints', 'ghostkit'),
			block: Breakpoints,
		},
		css_js: {
			label: __('CSS & JavaScript', 'ghostkit'),
			block: CssJs,
		},
	});
}
