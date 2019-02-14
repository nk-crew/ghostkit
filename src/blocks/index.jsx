/**
 * Store
 */
import './_store';

/**
 * Blocks
 */
import * as grid from './grid';
import * as gridColumn from './grid/column';
import * as divider from './divider';
import * as buttonWrapper from './button';
import * as button from './button/button';
import * as progress from './progress';
import * as iconBox from './icon-box';
import * as tabs from './tabs';
import * as tabsTab from './tabs/tab';
import * as tabsLegacy from './tabs/legacy';
import * as tabsLegacyTab from './tabs/legacy/tab';
import * as accordion from './accordion';
import * as accordionItem from './accordion/item';
import * as counterBox from './counter-box';
import * as alert from './alert';
import * as carousel from './carousel';
import * as carouselSlide from './carousel/slide';
import * as video from './video';
import * as testimonial from './testimonial';
import * as gist from './gist';
import * as changelog from './changelog';
import * as pricingTable from './pricing-table';
import * as pricingTableItem from './pricing-table/item';
import * as googleMaps from './google-maps';
import * as widgetizedArea from './widgetized-area';
import * as instagram from './instagram';
import * as twitter from './twitter';

/**
 * Extensions
 */
import './_extend';

/**
 * Plugins
 */
import './_plugins';

/**
 * Icon
 */
import GhostKitCategoryIcon from './_icons/ghostkit-category.svg';

/**
 * Internal dependencies
 */
const {
    registerBlockType,
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
 * Register blocks
 */
jQuery( () => {
    [
        grid,
        gridColumn,
        progress,
        buttonWrapper,
        button,
        divider,
        alert,
        iconBox,
        counterBox,
        accordion,
        accordionItem,
        tabs,
        tabsTab,
        tabsLegacy,
        tabsLegacyTab,
        video,
        carousel,
        carouselSlide,
        pricingTable,
        pricingTableItem,
        testimonial,
        twitter,
        instagram,
        googleMaps,
        gist,
        changelog,
        widgetizedArea,
    ].forEach( ( { name, settings } ) => {
        registerBlockType( name, settings );
    } );
} );

/**
 * Disable Blocks
 */
import './_disable-blocks';
