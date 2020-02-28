/**
 * Store
 */
import './store';

/**
 * Blocks
 */
import './blocks';

/**
 * SVG Icons.
 */
import './svg-icons';

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
 * Internal dependencies
 */
const {
    updateCategory,
} = wp.blocks;

/**
 * Add category icon.
 */
if ( updateCategory ) {
    updateCategory( 'ghostkit', { icon: (
        <GhostKitCategoryIcon
            style={ {
                width: '20px',
                height: '20px',
                marginLeft: '7px',
                marginTop: '-1px',
            } }
            className="components-panel__icon"
        />
    ) } );
}

/**
 * Disable Blocks
 */
import './disable-blocks';
