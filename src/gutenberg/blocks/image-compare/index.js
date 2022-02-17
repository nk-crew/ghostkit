/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  icon: getIcon('block-image-compare', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/image-compare/',
    customStylesCallback(attributes) {
      return {
        '--gkt-image-compare__position':
          'undefined' !== typeof attributes.position ? `${attributes.position}%` : undefined,
      };
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
  deprecated,
};
