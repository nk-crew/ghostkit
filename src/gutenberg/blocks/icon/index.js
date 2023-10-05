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
  icon: getIcon('block-icon', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/circle-button/',
    customStylesCallback(attributes) {
      const { justify, width, flipH, flipV } = attributes;
      let styles = {};

      const borderStyle = getBorderClassesAndStyles(attributes)?.style;

      if (justify) {
        styles.justifyContent = justify;
      }

      if (width) {
        styles.width = width;
      }

      if (flipH) {
        const flip = 'scaleX(-1)';
        styles.transform = styles.transform ? `${styles.transform} ${flip}` : flip;
      }

      if (flipV) {
        const flip = 'scaleY(-1)';
        styles.transform = styles.transform ? `${styles.transform} ${flip}` : flip;
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
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  edit,
  save,
};
