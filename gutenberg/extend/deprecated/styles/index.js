import { cloneDeep, merge } from 'lodash';

import camelCaseToDash from '../../../utils/camel-case-to-dash';

function fixStylesPropNames(styles) {
	if (typeof styles === 'object') {
		const clonedStyles = cloneDeep(styles);

		const result = {};

		Object.keys(clonedStyles).forEach((k) => {
			result[camelCaseToDash(k)] = fixStylesPropNames(clonedStyles[k]);
		});

		return result;
	}

	return styles;
}

/**
 * Migrate Custom Styles.
 *
 * @param props
 */
export default function migrate(props) {
	const { attributes } = props;
	const {
		ghostkitId,
		ghostkitClassname,
		ghostkitStyles,
		ghostkitCustomCSS,
		ghostkitPosition,
		ghostkitSpacings,
		ghostkitFrame,
	} = attributes;

	const result = {};

	// Migration to new attribute.
	if (
		ghostkitId ||
		ghostkitClassname ||
		ghostkitStyles ||
		ghostkitCustomCSS ||
		ghostkitPosition ||
		ghostkitSpacings ||
		ghostkitFrame
	) {
		// Clean old attributes.
		result.ghostkitId = undefined;
		result.ghostkitClassname = undefined;
		result.ghostkitStyles = undefined;
		result.ghostkitCustomCSS = undefined;
		result.ghostkitPosition = undefined;
		result.ghostkitSpacings = undefined;
		result.ghostkitFrame = undefined;

		const ghostkitData = cloneDeep(attributes?.ghostkit || {});

		// ID.
		if (ghostkitId && !ghostkitData?.id) {
			ghostkitData.id = ghostkitId;
		}

		// Custom CSS.
		if (ghostkitCustomCSS && !ghostkitData?.styles?.custom) {
			if (typeof ghostkitData?.styles === 'undefined') {
				ghostkitData.styles = {};
			}

			ghostkitData.styles.custom = ghostkitCustomCSS;
		}

		// Styles.
		if (ghostkitStyles && Object.keys(ghostkitStyles).length) {
			if (typeof ghostkitData?.styles === 'undefined') {
				ghostkitData.styles = {};
			}

			Object.keys(ghostkitStyles).forEach((k) => {
				ghostkitData.styles = merge(
					ghostkitData.styles,
					ghostkitStyles[k]
				);
			});
		}

		// Convert styles props to dash-case.
		if (ghostkitData.styles) {
			ghostkitData.styles = fixStylesPropNames(ghostkitData.styles);
		}

		result.ghostkit = ghostkitData;
	}

	return result;
}
