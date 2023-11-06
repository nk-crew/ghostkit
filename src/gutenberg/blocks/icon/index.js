/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;
export { metadata, name };

export const settings = {
  icon: getIcon('block-icon', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/circle-button/',
    customStylesCallback(attributes) {
      const { justify, width, flipH, flipV, color, backgroundColor, backgroundGradient } =
        attributes;
      const styles = {};
      const innerStyles = {};

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

      if (color) {
        styles['--gkt-icon__color'] = color;
      }

      if (backgroundColor || backgroundGradient) {
        styles['--gkt-icon__background'] = backgroundColor || backgroundGradient;
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
