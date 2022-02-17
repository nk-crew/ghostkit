/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

/**
 * External dependencies
 */
const { merge } = window.lodash;

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  icon: getIcon('block-progress', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/progress/',
    customStylesCallback(attributes) {
      const styles = {
        '--gkt-progress__height':
          'undefined' !== typeof attributes.height ? `${attributes.height}px` : undefined,
        '--gkt-progress__border-radius':
          'undefined' !== typeof attributes.borderRadius
            ? `${attributes.borderRadius}px`
            : undefined,
        '--gkt-progress__background-color': attributes.backgroundColor,
        '--gkt-progress--bar__width':
          'undefined' !== typeof attributes.percent ? `${attributes.percent}%` : undefined,
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
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  example: {
    attributes: {
      ghostkitId: 'example-progress',
      ghostkitClassname: 'ghostkit-custom-example-progress',
      className: 'ghostkit-custom-example-progress',
    },
  },
  edit,
  save,
  deprecated,
};
