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
  icon: getIcon('block-button', true),
  ghostkit: {
    customStylesCallback(attributes) {
      const result = {
        '--gkt-button__background-color': attributes.color,
        '--gkt-button__color': attributes.textColor,
        '--gkt-button__border-radius':
          'undefined' !== typeof attributes.borderRadius
            ? `${attributes.borderRadius}px`
            : undefined,
        '--gkt-button-hover__background-color': attributes.hoverColor,
        '--gkt-button-hover__color': attributes.hoverTextColor,
        '--gkt-button-focus__background-color': attributes.hoverColor,
        '--gkt-button-focus__color': attributes.hoverTextColor,
      };

      // Border.
      if ('undefined' !== typeof attributes.borderWeight) {
        result['--gkt-button__border-width'] = `${attributes.borderWeight}px`;
      }
      if (attributes.borderColor) {
        result['--gkt-button__border-color'] = attributes.borderColor;
      }
      if (attributes.hoverBorderColor) {
        result['--gkt-button-hover__border-color'] = attributes.hoverBorderColor;
      }

      // Box Shadow.
      if ('undefined' !== typeof attributes.focusOutlineWeight && attributes.focusOutlineColor) {
        result[
          '--gkt-button-focus__box-shadow'
        ] = `0 0 0 ${attributes.focusOutlineWeight}px ${attributes.focusOutlineColor}`;
      }

      return result;
    },
    supports: {
      styles: true,
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
