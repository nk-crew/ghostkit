import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-tab', true),
	edit,
	save,
	deprecated,
};
