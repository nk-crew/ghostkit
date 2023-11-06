/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import deprecated from './deprecated';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
  icon: getIcon('block-accordion-item', true),
  edit,
  save,
  deprecated,
};
