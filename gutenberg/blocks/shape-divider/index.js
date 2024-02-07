import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-shape-divider', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/shape-divider/',
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-shape-divider__color': attributes.color || undefined,
				svg: {
					width: undefined,
					height: undefined,
				},
				media_sm: {
					svg: {
						width: undefined,
						height: undefined,
					},
				},
				media_md: {
					svg: {
						width: undefined,
						height: undefined,
					},
				},
				media_lg: {
					svg: {
						width: undefined,
						height: undefined,
					},
				},
				media_xl: {
					svg: {
						width: undefined,
						height: undefined,
					},
				},
			};

			Object.keys(attributes).forEach((key) => {
				if (
					typeof attributes[key] !== 'undefined' &&
					attributes[key] !== ''
				) {
					let prefix = key.split('_')[0];
					let type = key.split('_')[1];

					if (!type) {
						type = prefix;
						prefix = '';
					}

					if (type && (type === 'height' || type === 'width')) {
						if (type === 'height' && prefix) {
							styles[`media_${prefix}`].svg.height =
								`${attributes[key]}px`;
						} else if (type === 'height') {
							styles.svg.height = `${attributes[key]}px`;
						} else if (type === 'width' && prefix) {
							styles[`media_${prefix}`].svg.width =
								`${attributes[key]}%`;
						} else if (type === 'width') {
							styles.svg.width = `${attributes[key]}%`;
						}
					}
				}
			});

			return styles;
		},
	},
	example: {
		attributes: {
			svg: '<svg width="200" height="31" viewBox="0 0 200 31" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path opacity="0.25" d="M176 1.09913C185.695 1.78769 200 5.86594 200 5.86594V31H0V23.6744C0 23.6744 10.8105 26.1825 18 26.4651C33.0506 27.0568 40.0687 20.2366 55 18.7907C76.5387 16.705 88.9682 24.0506 110.5 21.9302C138.336 19.1891 148.033 -0.887161 176 1.09913Z" fill="currentColor"/><path opacity="0.5" d="M177 6.5C186.046 6.8116 200 9.37302 200 9.37302V31H0V26.1526C0 26.1526 12.4813 27.3959 20.5 27.1628C35.8319 26.717 43.2085 21.0806 58.5 20.186C77.5429 19.072 88.3344 25.0361 107.5 24C135.448 22.4892 149.028 5.53653 177 6.5Z" fill="currentColor"/><path d="M176 9.44356C185.589 9.89091 200 12.8801 200 12.8801V31H0V26.9386C0 26.9386 12.7411 28.5221 21 28.5007C37.1016 28.4589 44.9254 22.8358 61 22.2525C79.5556 21.5791 89.4422 27.5882 108 26.9386C136.674 25.935 147.361 8.10748 176 9.44356Z" fill="currentColor"/></svg>',
			ghostkit: {
				id: 'example-shape-divider',
			},
			className: 'ghostkit-custom-example-shape-divider',
		},
	},
	edit,
	save,
};
