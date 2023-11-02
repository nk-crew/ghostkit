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
  icon: getIcon('block-countdown', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/countdown/',
    customStylesCallback(attributes) {
      const styles = {
        '--gkt-countdown--unit-number__font-size':
          typeof attributes.numberFontSize !== 'undefined'
            ? `${attributes.numberFontSize}px`
            : undefined,
        '--gkt-countdown--unit-number__color': attributes.numberColor,
        '--gkt-countdown--unit-label__font-size':
          typeof attributes.labelFontSize !== 'undefined'
            ? `${attributes.labelFontSize}px`
            : undefined,
        '--gkt-countdown--unit-label__color': attributes.labelColor,
      };

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
  example: {
    attributes: {
      units: ['hours', 'minutes', 'seconds'],
      unitsAlign: 'center',
      ghostkit: {
        id: 'example-countdown',
      },
      className: 'ghostkit-custom-example-countdown',
    },
  },
  edit,
  save,
};
