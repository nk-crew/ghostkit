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
        '--gkt-icon__width': undefined,
        '--gkt-icon__justify-content': undefined,
      };

      if (justify === 'start') {
        styles['--gkt-icon__justify-content'] = 'flex-start';
      } else if (justify === 'center') {
        styles['--gkt-icon__justify-content'] = 'center';
      } else {
        styles['--gkt-icon__justify-content'] = 'flex-end';
      }

      if (typeof width !== 'undefined' && width !== '') {
        styles['--gkt-icon__width'] = width;
      }

      return styles;
    },
  },
  edit,
  save,
};
