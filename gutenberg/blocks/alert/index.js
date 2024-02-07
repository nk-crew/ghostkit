import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-alert', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/alert/',
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-alert__border-color': attributes.color || undefined,
				'--gkt-alert--icon__font-size': undefined,
				'--gkt-alert--icon__color': attributes.color || undefined,
				'&:hover': {
					'--gkt-alert__border-color':
						attributes.hoverColor || undefined,
					'--gkt-alert--icon__color':
						attributes.hoverColor || undefined,
				},
			};

			if (
				typeof attributes.iconSize !== 'undefined' &&
				attributes.iconSize !== ''
			) {
				styles['--gkt-alert--icon__font-size'] =
					`${attributes.iconSize}px`;
			}

			return styles;
		},
	},
	example: {
		attributes: {
			color: '#E47F3B',
			ghostkit: {
				id: 'example-alert',
			},
			className: 'ghostkit-custom-example-alert',
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
};
