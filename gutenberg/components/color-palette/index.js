import {
	__experimentalUseMultipleOriginColorsAndGradients as experimentalUseMultipleOriginColorsAndGradients,
	useMultipleOriginColorsAndGradients as stableUseMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { ColorPalette as WPColorPalette } from '@wordpress/components';

import ApplyFilters from '../apply-filters';

// WP 6.6 exports only the experimental name.
const useMultipleOriginColorsAndGradients =
	stableUseMultipleOriginColorsAndGradients ||
	experimentalUseMultipleOriginColorsAndGradients;

function useColors() {
	return useMultipleOriginColorsAndGradients().colors;
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
				__experimentalIsRenderedInSidebar
			/>
		</ApplyFilters>
	);
}
