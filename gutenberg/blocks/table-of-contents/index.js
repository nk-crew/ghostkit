import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-table-of-contents', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/table-of-contents/',
	},
	edit,
	save,
};
