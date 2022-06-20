/**
 * Internal dependencies
 */
import '../grid/awb-fallback';
import getIcon from '../../utils/get-icon';
import getBackgroundStyles from '../grid/get-background-styles';

import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * WordPress dependencies
 */
const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  icon: getIcon('block-grid-column', true),
  ghostkit: {
    customSelector(selector) {
      // extend selector to add possibility to override default column spacings without !important
      selector = `.ghostkit-grid ${selector}`;

      return selector;
    },
    customStylesCallback(attributes) {
      const { stickyContent, stickyContentOffset, awb_image: image } = attributes;

      let result = {};

      // Sticky styles.
      if (stickyContent && 'undefined' !== typeof stickyContentOffset) {
        result['--gkt-grid--column-sticky__offset'] = `${stickyContentOffset}px`;
      }

      // Image styles.
      if (image) {
        result = {
          ...result,
          ...getBackgroundStyles(attributes),
        };
      }

      return result;
    },
    customStylesFilter(styles, data, isEditor, attributes) {
      // change custom styles in Editor.
      if (isEditor && attributes.ghostkitClassname) {
        // background.
        styles = styles.replace(
          // eslint-disable-next-line prefer-regex-literals
          new RegExp('> .nk-awb .jarallax-img', 'g'),
          '> .awb-gutenberg-preview-block .jarallax-img'
        );
      }
      return styles;
    },
    supports: {
      styles: true,
      frame: true,
      spacings: true,
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  edit,
  save,
};
