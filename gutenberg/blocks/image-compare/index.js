import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-image-compare', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/image-compare/',
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-image-compare__position': undefined,
				'--gkt-image-compare--divider__background-color':
					attributes.colorDivider || undefined,
				'--gkt-image-compare--divider-icons__color':
					attributes.colorDividerIcon || undefined,
			};

			if (
				typeof attributes.position !== 'undefined' &&
				attributes.position !== ''
			) {
				styles['--gkt-image-compare__position'] =
					`${attributes.position}%`;
			}

			return styles;
		},
	},
	edit,
	save,
};
