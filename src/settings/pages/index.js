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
const { __ } = wp.i18n;

const { applyFilters } = wp.hooks;

export default function () {
  return applyFilters('ghostkit.settings.pages', {
    blocks: {
      label: __('Blocks', '@@text_domain'),
      block: Blocks,
    },
    icons: {
      label: __('Icons', '@@text_domain'),
      block: Icons,
    },
    typography: {
      label: __('Typography', '@@text_domain'),
      block: Typography,
    },
    fonts: {
      label: __('Fonts', '@@text_domain'),
      block: Fonts,
    },
    breakpoints: {
      label: __('Breakpoints', '@@text_domain'),
      block: Breakpoints,
    },
    css_js: {
      label: __('CSS & JavaScript', '@@text_domain'),
      block: CssJs,
    },
  });
}
