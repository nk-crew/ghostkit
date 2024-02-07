import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-gist', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/github-gist/',
	},
	example: {
		attributes: {
			url: 'https://gist.github.com/nk-o/fc0422389f3baa4e66d243b6f0c0ef1a',
			file: 'example.php',
		},
	},
	transforms,
	edit,
	save,
};
