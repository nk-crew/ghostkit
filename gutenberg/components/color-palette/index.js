import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { ColorPalette as WPColorPalette } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import ApplyFilters from '../apply-filters';

function useColors() {
	// New way to get colors and gradients.
	if (
		useMultipleOriginColorsAndGradients &&
		useMultipleOriginColorsAndGradients()
	) {
		return useMultipleOriginColorsAndGradients().colors;
	}

	// Old way.
	const { themeColors } = useSelect((select) => {
		const settings = select('core/block-editor').getSettings();

		return {
			themeColors: settings.colors,
		};
	});

	const colors = [];

	if (themeColors && themeColors.length) {
		colors.push({ name: 'Theme', colors: themeColors });
	}

	return colors;
}

export default function ColorPalette(props) {
	const { value, alpha = false, palette = true, onChange = () => {} } = props;

	const colors = palette ? useColors() : [];

	return (
		<ApplyFilters name="ghostkit.component.color-palette" props={props}>
			<WPColorPalette
				colors={colors}
				value={value}
				enableAlpha={alpha}
				onChange={(val) => {
					onChange(val);
				}}
				__experimentalHasMultipleOrigins
				__experimentalIsRenderedInSidebar
			/>
		</ApplyFilters>
	);
}
