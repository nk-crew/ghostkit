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
  icon: getIcon('block-image-compare', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/image-compare/',
    customStylesCallback(attributes) {
      return {
        '--gkt-image-compare__position':
          typeof attributes.position !== 'undefined' ? `${attributes.position}%` : undefined,
        '--gkt-image-compare--overlay__color': attributes.colorOverlay,
        '--gkt-image-compare--overlay__opacity': attributes.overlayOpacity / 100,
        '--gkt-image-compare--divider__background-color': attributes.colorDivider,
        '--gkt-image-compare--divider-icons__color': attributes.colorDividerIcon,
      };
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
  edit,
  save,
  deprecated,
};
