/**
 * Gutenberg Blocks
 */
import * as grid from './grid/index.jsx';
import * as gridColumn from './grid/column.jsx';
import * as divider from './divider/index.jsx';
import * as button from './button/index.jsx';
import * as progress from './progress/index.jsx';
import * as iconBox from './icon-box/index.jsx';
import * as tabs from './tabs/index.jsx';
import * as tabsTab from './tabs/tab.jsx';
import * as accordion from './accordion/index.jsx';
import * as accordionItem from './accordion/item.jsx';
import * as counterBox from './counter-box/index.jsx';
import * as alert from './alert/index.jsx';
import * as carousel from './carousel/index.jsx';
import * as carouselSlide from './carousel/slide.jsx';
import * as video from './video/index.jsx';
import * as testimonial from './testimonial/index.jsx';
import * as gist from './gist/index.jsx';
import * as changelog from './changelog/index.jsx';
import * as pricingTable from './pricing-table/index.jsx';
import * as pricingTableItem from './pricing-table/item.jsx';
import * as googleMaps from './google-maps/index.jsx';
import * as widgetizedArea from './widgetized-area/index.jsx';
import * as instagram from './instagram/index.jsx';
import * as twitter from './twitter/index.jsx';
import * as customizer from './customizer/index.jsx';
import * as customCSS from './custom-css/index.jsx';

/**
 * Extensions
 */
import './_extend/styles.jsx';
import './_extend/spacings.jsx';
import './_extend/display.jsx';
import './_extend/scroll-reveal.jsx';

/**
 * Plugins
 */
import './_plugins/customizer.jsx';
import './_plugins/custom-css.jsx';

/**
 * Internal dependencies
 */
const { registerBlockType } = wp.blocks;

/**
 * Register blocks
 */
[
    grid,
    gridColumn,
    divider,
    button,
    progress,
    iconBox,
    tabs,
    tabsTab,
    accordion,
    accordionItem,
    counterBox,
    alert,
    carousel,
    carouselSlide,
    testimonial,
    video,
    gist,
    changelog,
    pricingTable,
    pricingTableItem,
    googleMaps,
    widgetizedArea,
    instagram,
    twitter,
    customizer,
    customCSS,
].forEach( ( { name, settings } ) => {
    registerBlockType( name, settings );
} );
