import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-progress', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/progress/',
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-progress__height': undefined,
				'--gkt-progress__border-radius': undefined,
				'--gkt-progress__background-color':
					attributes.backgroundColor || undefined,
				'--gkt-progress--bar__width': undefined,
				'--gkt-progress--bar__background-color':
					attributes.color || undefined,
				'&:hover': {
					'--gkt-progress--bar__background-color':
						attributes.hoverColor || undefined,
					'--gkt-progress__background-color':
						attributes.hoverBackgroundColor || undefined,
				},
			};

			if (
				typeof attributes.height !== 'undefined' &&
				attributes.height !== ''
			) {
				styles['--gkt-progress__height'] = `${attributes.height}px`;
			}
			if (
				typeof attributes.borderRadius !== 'undefined' &&
				attributes.borderRadius !== ''
			) {
				styles['--gkt-progress__border-radius'] =
					`${attributes.borderRadius}px`;
			}
			if (
				typeof attributes.percent !== 'undefined' &&
				attributes.percent !== ''
			) {
				styles['--gkt-progress--bar__width'] = `${attributes.percent}%`;
			}

			return styles;
		},
	},
	example: {
		attributes: {
			ghostkit: {
				id: 'example-progress',
			},
			className: 'ghostkit-custom-example-progress',
		},
	},
	edit,
	save,
};
