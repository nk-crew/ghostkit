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
  ...metadata,
  icon: getIcon('block-instagram', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/instagram/',
    customStylesCallback(attributes) {
      const { gap, gapCustom } = attributes;

      const result = {};

      // Custom Gap.
      if ('custom' === gap && 'undefined' !== typeof gapCustom) {
        // we need to use `%` unit because of conflict with complex calc() and 0 value.
        const unit = gapCustom ? 'px' : '%';

        result['--gkt-instagram--photos__gap'] = `${gapCustom}${unit}`;
      }

      return result;
    },
    supports: {
      styles: true,
      frame: true,
      spacings: true,
      display: true,
      customCSS: true,
    },
  },
  supports: {
    html: false,
    className: false,
    align: ['wide', 'full'],
  },
  edit,
  save,
};
