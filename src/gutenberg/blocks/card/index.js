/**
 * Internal dependencies
 */
import setBorder from '../../utils/set-border';
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;
export { metadata, name };

/**
 * WordPress dependencies
 */
const { __experimentalGetBorderClassesAndStyles: getBorderClassesAndStyles } = wp.blockEditor;

export const settings = {
  ...metadata,
  icon: getIcon('block-card', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/circle-button/',
    customStylesCallback(attributes) {
      const { width } = attributes;
      let styles = {};

      const borderStyle = getBorderClassesAndStyles(attributes)?.style;

      if (width) {
        styles.width = width;
      }

      // Border.
      if (Object.keys(borderStyle).length) {
        styles = {
          ...styles,
          ...setBorder(borderStyle),
        };
      }

      return styles;
    },
    supports: {
      styles: true,
      frame: true,
      spacings: true,
      position: true,
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  edit,
  save,
};
