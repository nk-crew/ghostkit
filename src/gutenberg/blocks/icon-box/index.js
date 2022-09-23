/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  icon: getIcon('block-icon-box', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/icon-box/',
    customStylesCallback(attributes) {
      const styles = {
        '--gkt-icon-box--icon__font-size':
          'undefined' !== typeof attributes.iconSize ? `${attributes.iconSize}px` : undefined,
        '--gkt-icon-box--icon__color': attributes.iconColor,
      };

      if (attributes.hoverIconColor) {
        styles['&:hover'] = {
          '--gkt-icon-box--icon__color': attributes.hoverIconColor,
        };
      }

      return styles;
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
  example: {
    attributes: {
      icon: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7813 9.75C16.7813 7.10939 14.6406 4.96875 12 4.96875C9.35939 4.96875 7.21875 7.10939 7.21875 9.75C7.21875 12.3906 9.35939 14.5312 12 14.5312C14.6406 14.5312 16.7813 12.3906 16.7813 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15625 18C10.6023 19.25 13.3977 19.25 15.8437 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      iconColor: '#0366d6',
      ghostkitId: 'example-icon-box',
      ghostkitClassname: 'ghostkit-custom-example-icon-box',
      className: 'ghostkit-custom-example-icon-box',
    },
    innerBlocks: [
      {
        name: 'core/paragraph',
        attributes: {
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
        },
      },
    ],
  },
  edit,
  save,
  transforms,
  deprecated,
};
