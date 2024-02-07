import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-testimonial', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/testimonial/',
	},
	example: {
		attributes: {
			photo: 1,
			photoUrl:
				'https://s.w.org/images/core/5.3/Biologia_Centrali-Americana_-_Cantorchilus_semibadius_1902.jpg',
		},
		innerBlocks: [
			{
				name: 'core/paragraph',
				attributes: {
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
				},
			},
		],
	},
	edit,
	save,
	transforms,
	deprecated,
};
