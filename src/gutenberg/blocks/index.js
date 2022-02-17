/**
 * Internal dependencies
 */
import * as grid from './grid';
import * as gridColumn from './grid-column';
import * as divider from './divider';
import * as dividerShape from './shape-divider';
import * as button from './button';
import * as buttonSingle from './button-single';
import * as progress from './progress';
import * as iconBox from './icon-box';
import * as imageCompare from './image-compare';
import * as tabs from './tabs';
import * as tabsTab from './tabs-tab';
import * as tabsLegacy from './tabs-legacy';
import * as tabsLegacyTab from './tabs-legacy/tab';
import * as accordion from './accordion';
import * as accordionItem from './accordion-item';
import * as countdown from './countdown';
import * as counterBox from './counter-box';
import * as alert from './alert';
import * as carousel from './carousel';
import * as carouselSlide from './carousel-slide';
import * as video from './video';
import * as testimonial from './testimonial';
import * as toc from './table-of-contents';
import * as gist from './gist';
import * as changelog from './changelog';
import * as pricingTable from './pricing-table';
import * as pricingTableItem from './pricing-table-item';
import * as googleMaps from './google-maps';
import * as widgetizedArea from './widgetized-area';
import * as instagram from './instagram';
import * as twitter from './twitter';
import * as markdown from './markdown';
import * as gif from './gif';
import * as form from './form';
import * as formFieldText from './form/fields/text';
import * as formFieldEmail from './form/fields/email';
import * as formFieldName from './form/fields/name';
import * as formFieldUrl from './form/fields/url';
import * as formFieldPhone from './form/fields/phone';
import * as formFieldNumber from './form/fields/number';
import * as formFieldDate from './form/fields/date';
import * as formFieldTextarea from './form/fields/textarea';
import * as formFieldSelect from './form/fields/select';
import * as formFieldCheckbox from './form/fields/checkbox';
import * as formFieldRadio from './form/fields/radio';
import * as formFieldHidden from './form/fields/hidden';
import * as formSubmitButton from './form/fields/submit';

const { registerBlockType } = wp.blocks;

/**
 * Register blocks
 */

// Previously we used the jQuery's 'ready' event, but it was conflicting with PublishPress Blocks plugin.
document.addEventListener('DOMContentLoaded', () => {
  [
    grid,
    gridColumn,
    progress,
    button,
    buttonSingle,
    divider,
    dividerShape,
    alert,
    iconBox,
    imageCompare,
    countdown,
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
    toc,
    twitter,
    instagram,
    markdown,
    googleMaps,
    gist,
    changelog,
    widgetizedArea,
    gif,
    form,
    formFieldText,
    formFieldEmail,
    formFieldName,
    formFieldUrl,
    formFieldPhone,
    formFieldNumber,
    formFieldDate,
    formFieldTextarea,
    formFieldSelect,
    formFieldCheckbox,
    formFieldRadio,
    formFieldHidden,
    formSubmitButton,
  ].forEach(({ name, settings }) => {
    registerBlockType(name, settings);
  });
});
