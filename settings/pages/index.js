/**
 * Internal dependencies
 */
import Blocks from './blocks';
import Typography from './typography';
import Icons from './icons';
import CssJs from './css-js';
import Fonts from './fonts';
import Breakpoints from './breakpoints';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { applyFilters } from '@wordpress/hooks';

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
