/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

const { __ } = wp.i18n;

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  title: __('Markdown', '@@text_domain'),
  description: __(
    'Lightweight markup language with plain-text-formatting syntax.',
    '@@text_domain'
  ),
  icon: getIcon('block-markdown', true),
  keywords: [
    __('formatting', '@@text_domain'),
    __('markup', '@@text_domain'),
    __('md', '@@text_domain'),
  ],
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/markdown/',
    supports: {
      styles: true,
      frame: true,
      spacings: true,
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  example: {
    attributes: {
      content: 'test **bold**',
    },
  },
  edit,
  save,
};
