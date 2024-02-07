import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-pricing-table', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/pricing-table/',
		customStylesCallback(attributes) {
			const { gap, gapCustom } = attributes;

			const styles = {
				'--gkt-pricing-table__gap': undefined,
			};

			// Custom Gap.
			if (
				gap === 'custom' &&
				typeof gapCustom !== 'undefined' &&
				gapCustom !== ''
			) {
				// we need to use `%` unit because of conflict with complex calc() and 0 value.
				const unit = gapCustom ? 'px' : '%';

				styles['--gkt-pricing-table__gap'] = `${gapCustom}${unit}`;
			}

			return styles;
		},
	},
	example: {
		attributes: {
			count: 2,
		},
		innerBlocks: [
			{
				name: 'ghostkit/pricing-table-item',
				attributes: {
					title: 'Standard',
					price: '$49',
					features: '<li>Feature 1</li><li>Feature 2</li>',
					showPopular: true,
				},
				innerBlocks: [
					{
						name: 'ghostkit/button',
						attributes: {
							align: 'center',
						},
						innerBlocks: [
							{
								name: 'ghostkit/button-single',
								attributes: {
									text: 'Purchase',
								},
							},
						],
					},
				],
			},
			{
				name: 'ghostkit/pricing-table-item',
				attributes: {
					title: 'Developers',
					price: '$99',
					features: '<li>Feature 1</li><li>Feature 2</li>',
				},
				innerBlocks: [
					{
						name: 'ghostkit/button',
						attributes: {
							align: 'center',
						},
						innerBlocks: [
							{
								name: 'ghostkit/button-single',
								attributes: {
									text: 'Purchase',
								},
							},
						],
					},
				],
			},
		],
	},
	edit,
	save,
};
