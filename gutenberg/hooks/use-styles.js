import { cloneDeep } from 'lodash';

import * as styleUtils from '../utils/styles';

export default function useStyles(props) {
	const { attributes, setAttributes } = props;

	const ghostkitData = attributes?.ghostkit || {};
	const styles = ghostkitData?.styles || {};

	function getStyles() {
		return styleUtils.prepareStyles(styles);
	}

	/**
	 * Get style value by property name, selected device and optional selector.
	 *
	 * @param {string} name     - style property name.
	 * @param {string} device   - responsive device.
	 * @param {string} selector - optional custom selector.
	 *
	 * @return {any}
	 */
	function getStyle(name, device = false, selector = false) {
		return styleUtils.getStyle(styles, name, device, selector);
	}

	/**
	 * Check if style exists.
	 *
	 * @param {string} name     - style property name.
	 * @param {string} device   - responsive device.
	 * @param {string} selector - optional custom selector.
	 *
	 * @return {boolean}
	 */
	function hasStyle(name, device = false, selector = false) {
		return styleUtils.hasStyle(styles, name, device, selector);
	}

	/**
	 * Set new styles.
	 *
	 * @param {string} name      - style property name.
	 * @param          newStyles
	 * @param {string} device    - responsive device.
	 * @param {string} selector  - optional custom selector.
	 */
	function setStyles(newStyles, device = false, selector = false) {
		const clonedGhostkitData = cloneDeep(ghostkitData);

		if (typeof clonedGhostkitData?.styles === 'undefined') {
			clonedGhostkitData.styles = {};
		}

		const updatedStyles = styleUtils.getUpdatedStyles(
			clonedGhostkitData.styles,
			newStyles,
			device,
			selector
		);

		clonedGhostkitData.styles = updatedStyles;

		setAttributes({ ghostkit: clonedGhostkitData });
	}

	function resetStyles(resetProps, withResponsive = false, selectors = ['']) {
		const result = styleUtils.getStylesToReset(
			resetProps,
			withResponsive,
			selectors
		);

		setStyles(result);
	}

	return {
		styles,
		getStyles,
		getStyle,
		hasStyle,
		setStyles,
		resetStyles,
	};
}
