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
const {
  __experimentalGetBorderClassesAndStyles: getBorderClassesAndStyles,
  __experimentalGetColorClassesAndStyles: getColorClassesAndStyles,
  __experimentalGetSpacingClassesAndStyles: getSpacingClassesAndStyles,
} = wp.blockEditor;

export const settings = {
  ...metadata,
  icon: getIcon('block-icon', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/circle-button/',
    customStylesCallback(attributes) {
      const { justify, width, height, flipH, flipV } = attributes;
      const styles = {};
      let stylesIcon = {};

      const borderStyle = getBorderClassesAndStyles(attributes)?.style;
      const colorStyle = getColorClassesAndStyles(attributes)?.style;
      const spacingStyle = getSpacingClassesAndStyles(attributes)?.style;

      if (justify) {
        styles.justifyContent = justify;
      }

      if (width) {
        stylesIcon.width = width;
      }

      if (height) {
        stylesIcon.height = height;
      }

      if (flipH) {
        const flip = 'scaleX(-1)';
        stylesIcon.transform = stylesIcon.transform ? `${stylesIcon.transform} ${flip}` : flip;
      }

      if (flipV) {
        const flip = 'scaleY(-1)';
        stylesIcon.transform = stylesIcon.transform ? `${stylesIcon.transform} ${flip}` : flip;
      }

      // Border.
      if (Object.keys(borderStyle).length) {
        stylesIcon = {
          ...stylesIcon,
          ...setBorder(borderStyle),
        };
      }

      // Colors.
      if (Object.keys(colorStyle).length) {
        stylesIcon = {
          ...stylesIcon,
          ...colorStyle,
        };
      }

      // Spacing.
      if (Object.keys(spacingStyle).length) {
        stylesIcon = {
          ...stylesIcon,
          ...spacingStyle,
        };
      }

      styles['> .ghostkit-icon-inline'] = stylesIcon;

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
