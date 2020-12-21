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
import GhostKitCategoryIcon from './icons/ghostkit-category.svg';

/**
 * Disable Blocks
 */
import './disable-blocks';

/**
 * Internal dependencies
 */
const {
    registerBlockCollection,
    updateCategory,
} = wp.blocks;

/**
 * Add category icon.
 */
const categoryIcon = (
    <GhostKitCategoryIcon className="components-panel__icon" />
);

// Collections.
if ( 'undefined' !== typeof registerBlockCollection ) {
    registerBlockCollection( 'ghostkit', {
        title: 'Ghost Kit',
        icon: categoryIcon,
    } );
} else if ( updateCategory ) {
    updateCategory( 'ghostkit', {
        icon: categoryIcon,
    } );
}
