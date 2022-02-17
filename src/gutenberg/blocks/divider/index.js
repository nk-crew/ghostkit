/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import transforms from './transforms';
import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * External dependencies
 */
const { merge } = window.lodash;

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  icon: getIcon('block-divider', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/divider/',
    customStylesCallback(attributes) {
      const styles = {
        '--gkt-divider__border-width':
          'undefined' !== typeof attributes.size ? `${attributes.size}px` : undefined,
        '--gkt-divider__border-color': attributes.color,
        '--gkt-divider--icon__font-size':
          'undefined' !== typeof attributes.iconSize ? `${attributes.iconSize}px` : undefined,
        '--gkt-divider--icon__color': attributes.iconColor,
      };

      if (attributes.hoverColor) {
        styles['&:hover'] = {
          '--gkt-divider__border-color': attributes.hoverColor,
        };
      }
      if (attributes.hoverIconColor) {
        styles['&:hover'] = merge(styles['&:hover'] || {}, {
          '--gkt-divider--icon__color': attributes.hoverIconColor,
        });
      }

      return styles;
    },
    supports: {
      styles: true,
      spacings: true,
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  example: {
    attributes: {
      size: 4,
      icon: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7813 9.75C16.7813 7.10939 14.6406 4.96875 12 4.96875C9.35939 4.96875 7.21875 7.10939 7.21875 9.75C7.21875 12.3906 9.35939 14.5312 12 14.5312C14.6406 14.5312 16.7813 12.3906 16.7813 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15625 18C10.6023 19.25 13.3977 19.25 15.8437 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      iconSize: 40,
      color: '#a7a9ab',
      iconColor: '#a7a9ab',
      ghostkitId: 'example-divider',
      ghostkitClassname: 'ghostkit-custom-example-divider',
      className: 'ghostkit-custom-example-divider',
    },
  },
  edit,
  save,
  transforms,
};
