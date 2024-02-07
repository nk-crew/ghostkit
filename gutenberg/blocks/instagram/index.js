import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-instagram', true),
	ghostkit: {
		// previewUrl: 'https://www.ghostkit.io/docs/blocks/instagram/',
		customStylesCallback(attributes) {
			const { gap, gapCustom } = attributes;

			const styles = {
				'--gkt-instagram--photos__gap': undefined,
			};

			// Custom Gap.
			if (
				gap === 'custom' &&
				typeof gapCustom !== 'undefined' &&
				gapCustom !== ''
			) {
				// we need to use `%` unit because of conflict with complex calc() and 0 value.
				const unit = gapCustom ? 'px' : '%';

				styles['--gkt-instagram--photos__gap'] = `${gapCustom}${unit}`;
			}

			return styles;
		},
	},
	edit,
	save,
};
