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
  icon: getIcon('block-widgetized-area', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/widgetized-area/',
  },
  edit,
  save,
};
