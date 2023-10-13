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
  icon: getIcon('block-lottie', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/lottie/',
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
      fileUrl: 'https://assets4.lottiefiles.com/packages/lf20_obhph3sh.json',
    },
  },
  edit,
  save,
};
