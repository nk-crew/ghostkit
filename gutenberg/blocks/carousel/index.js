import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-carousel', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/carousel/',
		customStylesCallback(attributes) {
			const { fadeEdges, fadeEdgesSize } = attributes;
			const styles = {
				'--gkt-carousel--fade-edges__size': undefined,
			};

			if (
				fadeEdges &&
				typeof fadeEdgesSize !== 'undefined' &&
				fadeEdgesSize !== ''
			) {
				styles['--gkt-carousel--fade-edges__size'] =
					`${fadeEdgesSize}%`;
			}

			return styles;
		},
	},
	example: {
		attributes: {
			slides: 3,
		},
		innerBlocks: [
			{
				name: 'ghostkit/carousel-slide',
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							sizeSlug: 'large',
							url: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
						},
					},
				],
			},
			{
				name: 'ghostkit/carousel-slide',
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							sizeSlug: 'large',
							url: 'https://s.w.org/images/core/5.3/Windbuchencom.jpg',
						},
					},
				],
			},
			{
				name: 'ghostkit/carousel-slide',
			},
		],
	},
	edit,
	save,
};
