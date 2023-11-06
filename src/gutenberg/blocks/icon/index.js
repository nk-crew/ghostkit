/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;
export { metadata, name };

export const settings = {
  icon: getIcon('block-icon', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/icon/',
    customStylesCallback(attributes) {
      const { justify, width, color, backgroundColor, backgroundGradient } = attributes;
      const styles = {
        '--gkt-icon__color': color || undefined,
        '--gkt-icon__background': backgroundColor || backgroundGradient || undefined,
        'justify-content': justify || undefined,
      };
      const innerStyles = {
        width: undefined,
      };

      if (typeof width !== 'undefined' && width !== '') {
        innerStyles.width = width;
      }

      return styles;
    },
  },
  edit,
  save,
};
