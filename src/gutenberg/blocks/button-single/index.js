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
  icon: getIcon('block-button', true),
  ghostkit: {
    customStylesCallback(attributes) {
      const result = {
        '--gkt-button__background-color': attributes.color,
        '--gkt-button__color': attributes.textColor,
        '--gkt-button__border-radius':
          typeof attributes.borderRadius !== 'undefined'
            ? `${attributes.borderRadius}px`
            : undefined,
        '--gkt-button-hover__background-color': attributes.hoverColor,
        '--gkt-button-hover__color': attributes.hoverTextColor,
        '--gkt-button-focus__background-color': attributes.hoverColor,
        '--gkt-button-focus__color': attributes.hoverTextColor,
      };

      // Border.
      if (typeof attributes.borderWeight !== 'undefined') {
        result['--gkt-button__border-width'] = `${attributes.borderWeight}px`;
      }
      if (attributes.borderColor) {
        result['--gkt-button__border-color'] = attributes.borderColor;
      }
      if (attributes.hoverBorderColor) {
        result['--gkt-button-hover__border-color'] = attributes.hoverBorderColor;
      }

      // Box Shadow.
      if (typeof attributes.focusOutlineWeight !== 'undefined' && attributes.focusOutlineColor) {
        result[
          '--gkt-button-focus__box-shadow'
        ] = `0 0 0 ${attributes.focusOutlineWeight}px ${attributes.focusOutlineColor}`;
      }

      return result;
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
  edit,
  save,
  deprecated,
};
