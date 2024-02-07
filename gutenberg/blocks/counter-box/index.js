import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-counter-box', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/number-box/',
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-counter-box--number__font-size': undefined,
				'--gkt-counter-box--number__color':
					attributes.numberColor || undefined,
				'&:hover': {
					'--gkt-counter-box--number__color':
						attributes.hoverNumberColor || undefined,
				},
			};

			if (
				typeof attributes.numberSize !== 'undefined' &&
				attributes.numberSize !== ''
			) {
				styles['--gkt-counter-box--number__font-size'] =
					`${attributes.numberSize}px`;
			}

			return styles;
		},
	},
	example: {
		attributes: {
			number: '77',
			numberColor: '#0366d6',
			ghostkit: {
				id: 'example-counter-box',
			},
			className: 'ghostkit-custom-example-counter-box',
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
