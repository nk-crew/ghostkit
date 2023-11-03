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
  icon: getIcon('block-icon', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/circle-button/',
    customStylesCallback(attributes) {
      const { justify, width, flipH, flipV } = attributes;
      const styles = {};
      let innerStyles = {};

      const borderStyle = getBorderClassesAndStyles(attributes)?.style;
      const colorStyle = getColorClassesAndStyles(attributes)?.style;
      const spacingStyle = getSpacingClassesAndStyles(attributes)?.style;

      if (justify) {
        styles.justifyContent = justify;
      }

      if (width) {
        innerStyles.width = width;
      }

      const { transform } = innerStyles;
      if (flipH) {
        innerStyles.transform = transform ? `${transform} scaleX(-1)` : 'scaleX(-1)';
      } else {
        innerStyles.transform = transform || '';
      }

      if (flipV) {
        innerStyles.transform = transform ? `${transform} scaleY(-1)` : 'scaleY(-1)';
      } else {
        innerStyles.transform = transform || '';
      }

      // Border.
      if (Object.keys(borderStyle).length) {
        innerStyles = {
          ...innerStyles,
          ...setBorder(borderStyle),
        };
      } else {
        innerStyles.border = '';
        innerStyles.borderTop = '';
        innerStyles.borderRight = '';
        innerStyles.borderBottom = '';
        innerStyles.borderLeft = '';
      }

      // Color.
      if (Object.keys(colorStyle).length) {
        innerStyles = {
          ...innerStyles,
          ...colorStyle,
        };
      }

      // Spacing.
      if (Object.keys(spacingStyle).length) {
        innerStyles = {
          ...innerStyles,
          ...spacingStyle,
        };
      } else {
        innerStyles.paddingTop = '';
        innerStyles.paddingRight = '';
        innerStyles.paddingBottom = '';
        innerStyles.paddingLeft = '';
        innerStyles.marginTop = '';
        innerStyles.marginRight = '';
        innerStyles.marginBottom = '';
        innerStyles.marginLeft = '';
      }

      styles['> .ghostkit-icon-inner'] = innerStyles;

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
