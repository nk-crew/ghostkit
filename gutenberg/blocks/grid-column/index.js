import '../grid/awb-fallback';

import getIcon from '../../utils/get-icon';
import getBackgroundStyles from '../grid/get-background-styles';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-grid-column', true),
	ghostkit: {
		customStylesCallback(attributes) {
			const { stickyContent, stickyContentOffset } = attributes;

			const styles = {
				'--gkt-grid--column-sticky__offset': undefined,
				...getBackgroundStyles(attributes),
			};

			// Sticky styles.
			if (
				stickyContent &&
				typeof stickyContentOffset !== 'undefined' &&
				stickyContentOffset !== ''
			) {
				styles['--gkt-grid--column-sticky__offset'] =
					`${stickyContentOffset}px`;
			}

			return styles;
		},
		customStylesFilter(styles, data, isEditor, attributes) {
			// change custom styles in Editor.
			if (isEditor && attributes?.ghostkit?.id) {
				// background.
				styles = styles.replace(
					new RegExp('> .nk-awb .jarallax-img', 'g'),
					'> .awb-gutenberg-preview-block .jarallax-img'
				);
			}
			return styles;
		},
	},
	edit,
	save,
};
