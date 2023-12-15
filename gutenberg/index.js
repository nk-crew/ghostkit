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
 * Disable Blocks
 */
import './disable-blocks';

/**
 * Internal dependencies
 */
import { updateCategory } from '@wordpress/blocks';

/**
 * Icon
 */
import { ReactComponent as GhostKitLogoIcon } from './icons/ghostkit-logo.svg';

/**
 * Add category icon.
 */
updateCategory( 'ghostkit', {
	icon: <GhostKitLogoIcon />,
} );
