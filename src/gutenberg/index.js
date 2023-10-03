/**
 * Store
 */
import './store';

/**
 * Blocks
 */
import './blocks';

/**
 * Formats
 */
import './formats';

/**
 * Extensions
 */
import './extend';

/**
 * Style Variants
 */
import './style-variants';

/**
 * Plugins
 */
import './plugins';

/**
 * Icon
 */
import GhostKitLogoIcon from './icons/ghostkit-logo.svg';

/**
 * Disable Blocks
 */
import './disable-blocks';

/**
 * Internal dependencies
 */
const { updateCategory } = wp.blocks;

/**
 * Add category icon.
 */
updateCategory('ghostkit', {
  icon: <GhostKitLogoIcon />,
});
