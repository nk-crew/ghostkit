/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;
export { metadata, name };

export const settings = {
  icon: getIcon('block-tabs', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/tabs/',
  },
  edit,
  save,
  transforms,
};
