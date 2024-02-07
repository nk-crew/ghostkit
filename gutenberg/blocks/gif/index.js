import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-gif', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/gif/',
	},
	edit,
	save,
};
