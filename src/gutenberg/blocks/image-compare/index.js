/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  title: __('Image Compare', '@@text_domain'),
  description: __('Compare two images with a slider.', '@@text_domain'),
  icon: getIcon('block-image-compare', true),
  keywords: [__('image', '@@text_domain'), __('compare', '@@text_domain')],
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/image-compare/',
    customStylesCallback(attributes) {
      return {
        '--gkt-image-compare__position':
          typeof attributes.position !== 'undefined' ? `${attributes.position}%` : undefined,
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
