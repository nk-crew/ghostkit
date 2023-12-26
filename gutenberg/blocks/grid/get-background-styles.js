/**
 * Returns object with background image styles for Row and Column.
 *
 * @param {Object} attributes - block attributes.
 *
 * @return {Object} Styles object.
 */
export default function getBackgroundStyles(attributes) {
	const {
		awb_image: image,
		awb_imageBackgroundSize: imageBackgroundSize,
		awb_imageBackgroundPosition: imageBackgroundPosition,
	} = attributes;

	const styles = {};

	styles['> .nk-awb .jarallax-img'] = {
		'object-fit': undefined,
		'object-position': undefined,
		'background-repeat': undefined,
		'background-position': undefined,

		// Remove unused fallback styles.
		'font-family': undefined,
	};

	// <img> tag with object-fit style
	if (image) {
		if (imageBackgroundSize !== 'pattern') {
			if (imageBackgroundSize) {
				styles['> .nk-awb .jarallax-img']['object-fit'] =
					imageBackgroundSize;
			}
			if (imageBackgroundPosition) {
				styles['> .nk-awb .jarallax-img']['object-position'] =
					imageBackgroundPosition;
			}

			// background image with pattern size
		} else {
			if (imageBackgroundSize) {
				styles['> .nk-awb .jarallax-img']['background-repeat'] =
					'repeat';
			}
			if (imageBackgroundSize) {
				styles['> .nk-awb .jarallax-img']['background-position'] =
					imageBackgroundPosition;
			}
		}
	}

	return styles;
}
