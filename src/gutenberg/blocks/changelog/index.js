/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

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
  icon: getIcon('block-changelog', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/changelog/',
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
      version: '1.0.0',
      date: '19 August 2077',
    },
    innerBlocks: [
      {
        name: 'core/list',
        attributes: {
          values: [
            <li key="list-item-1">
              <span className="ghostkit-badge" style={{ backgroundColor: '#4ab866' }}>
                {__('Added', '@@text_domain')}
              </span>
              {__('Something', '@@text_domain')}
            </li>,
            <li key="list-item-2">
              <span className="ghostkit-badge" style={{ backgroundColor: '#0366d6' }}>
                {__('Fixed', '@@text_domain')}
              </span>
              {__('Something', '@@text_domain')}
            </li>,
            <li key="list-item-3">
              <span className="ghostkit-badge" style={{ backgroundColor: '#63656b' }}>
                {__('Changed', '@@text_domain')}
              </span>
              {__('Something', '@@text_domain')}
            </li>,
          ],
        },
      },
    ],
  },
  edit,
  save,
};
