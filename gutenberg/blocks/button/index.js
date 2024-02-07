import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-buttons', true),
	ghostkit: {
		previewUrl: 'https://www.ghostkit.io/docs/blocks/button/',
		customStylesCallback(attributes) {
			const { gap, gapCustom, gapVerticalCustom } = attributes;

			const styles = {
				'--gkt-button__gap': undefined,
				'--gkt-button__gap-vertical': undefined,
			};

			// Custom Gap.
			if (gap === 'custom') {
				if (typeof gapCustom !== 'undefined') {
					// we need to use `%` unit because of conflict with complex calc() and 0 value.
					const unit = gapCustom ? 'px' : '%';

					styles['--gkt-button__gap'] = `${gapCustom}${unit}`;
				}

				if (typeof gapVerticalCustom !== 'undefined') {
					// we need to use `%` unit because of conflict with complex calc() and 0 value.
					const unit = gapVerticalCustom ? 'px' : '%';

					styles['--gkt-button__gap-vertical'] =
						`${gapVerticalCustom}${unit}`;
				}
			}

			return styles;
		},
	},
	example: {
		attributes: {
			count: 2,
			align: 'center',
			gap: 'lg',
		},
		innerBlocks: [
			{
				name: 'ghostkit/button-single',
				attributes: {
					text: 'Button 1',
					size: 'xl',
					color: '#0366d6',
					ghostkit: {
						id: 'example-button-1',
					},
					className: 'ghostkit-custom-example-button-1',
				},
			},
			{
				name: 'ghostkit/button-single',
				attributes: {
					text: 'Button 2',
					size: 'xl',
					color: '#2F1747',
					icon: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7813 9.75C16.7813 7.10939 14.6406 4.96875 12 4.96875C9.35939 4.96875 7.21875 7.10939 7.21875 9.75C7.21875 12.3906 9.35939 14.5312 12 14.5312C14.6406 14.5312 16.7813 12.3906 16.7813 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15625 18C10.6023 19.25 13.3977 19.25 15.8437 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
					borderRadius: 50,
					ghostkit: {
						id: 'example-button-2',
					},
					className: 'ghostkit-custom-example-button-2',
				},
			},
		],
	},
	edit,
	save,
	transforms,
};
