/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import deprecated from './deprecated';
import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  title: __('Item', '@@text_domain'),
  description: __('A single item within a accordion block.', '@@text_domain'),
  icon: getIcon('block-accordion', true),
  ghostkit: {
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
