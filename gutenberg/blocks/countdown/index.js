import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-countdown', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/countdown/',
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-countdown--unit-number__font-size': undefined,
				'--gkt-countdown--unit-number__color':
					attributes.numberColor || undefined,
				'--gkt-countdown--unit-label__font-size': undefined,
				'--gkt-countdown--unit-label__color':
					attributes.labelColor || undefined,
			};

			if (
				typeof attributes.numberFontSize !== 'undefined' &&
				attributes.numberFontSize !== ''
			) {
				styles['--gkt-countdown--unit-number__font-size'] =
					`${attributes.numberFontSize}px`;
			}
			if (
				typeof attributes.labelFontSize !== 'undefined' &&
				attributes.labelFontSize !== ''
			) {
				styles['--gkt-countdown--unit-label__font-size'] =
					`${attributes.labelFontSize}px`;
			}

			return styles;
		},
	},
	example: {
		attributes: {
			units: ['hours', 'minutes', 'seconds'],
			unitsAlign: 'center',
			ghostkit: {
				id: 'example-countdown',
			},
			className: 'ghostkit-custom-example-countdown',
		},
	},
	edit,
	save,
};
