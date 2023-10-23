/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

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
  icon: getIcon('block-progress', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/progress/',
    customStylesCallback(attributes) {
      const styles = {
        '--gkt-progress__height':
          typeof attributes.height !== 'undefined' ? `${attributes.height}px` : undefined,
        '--gkt-progress__border-radius':
          typeof attributes.borderRadius !== 'undefined'
            ? `${attributes.borderRadius}px`
            : undefined,
        '--gkt-progress__background-color': attributes.backgroundColor,
        '--gkt-progress--bar__width':
          typeof attributes.percent !== 'undefined' ? `${attributes.percent}%` : undefined,
        '--gkt-progress--bar__background-color': attributes.color,
      };

      if (attributes.hoverColor) {
        styles['&:hover'] = {
          '--gkt-progress--bar__background-color': attributes.hoverColor,
        };
      }
      if (attributes.hoverBackgroundColor) {
        styles['&:hover'] = merge(styles['&:hover'] || {}, {
          '--gkt-progress__background-color': attributes.hoverBackgroundColor,
        });
      }

      return styles;
    },
    supports: {
      styles: true,
      spacings: true,
      position: true,
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  example: {
    attributes: {
      ghostkit: {
        id: 'example-progress',
      },
      className: 'ghostkit-custom-example-progress',
    },
  },
  edit,
  save,
};
