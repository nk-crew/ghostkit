import { BaseControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import ToggleGroup from '../toggle-group';

const GAP_VALUES = {
	no: 0,
	sm: 15,
	md: 30,
	lg: 45,
};

/**
 * Component Class
 *
 * @param props
 */
export default function GapSettings(props) {
	const { gap, gapCustom, gapVerticalCustom, allowVerticalGap, onChange } =
		props;

	return (
		<BaseControl
			id={__('Gap', 'ghostkit')}
			label={__('Gap', 'ghostkit')}
			className="ghostkit-components-gap-settings"
			__nextHasNoMarginBottom
		>
			<ToggleGroup
				value={gap}
				options={[
					{
						label: __('None', 'ghostkit'),
						value: 'no',
					},
					{
						label: __('S', 'ghostkit'),
						value: 'sm',
					},
					{
						label: __('M', 'ghostkit'),
						value: 'md',
					},
					{
						label: __('L', 'ghostkit'),
						value: 'lg',
					},
					{
						label: (
							<svg
								width="24"
								height="24"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								role="img"
								aria-hidden="true"
								focusable="false"
							>
								<path
									d="M14.5 13.8c-1.1 0-2.1.7-2.4 1.8H4V17h8.1c.3 1 1.3 1.8 2.4 1.8s2.1-.7 2.4-1.8H20v-1.5h-3.1c-.3-1-1.3-1.7-2.4-1.7zM11.9 7c-.3-1-1.3-1.8-2.4-1.8S7.4 6 7.1 7H4v1.5h3.1c.3 1 1.3 1.8 2.4 1.8s2.1-.7 2.4-1.8H20V7h-8.1z"
									fill="currentColor"
								/>
							</svg>
						),
						value: 'custom',
					},
				]}
				onChange={(value) => {
					const result = {
						gap: value,
					};

					// Add current predefined gap to custom value.
					if (
						value === 'custom' &&
						gap !== 'custom' &&
						typeof GAP_VALUES[gap] !== 'undefined'
					) {
						result.gapCustom = GAP_VALUES[gap];
					}

					// Reset vertical gap when use predefined value.
					if (value !== 'custom') {
						result.gapVerticalCustom = undefined;
					}

					onChange(result);
				}}
				isBlock
			/>
			{gap === 'custom' ? (
				<div className="ghostkit-components-gap-settings-custom">
					<TextControl
						type="number"
						help={
							allowVerticalGap ? __('Horizontal', 'ghostkit') : ''
						}
						value={gapCustom}
						onChange={(value) =>
							onChange({
								gapCustom:
									value === ''
										? undefined
										: parseFloat(value),
							})
						}
						min={0}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{allowVerticalGap ? (
						<TextControl
							type="number"
							help={__('Vertical', 'ghostkit')}
							placeholder={gapCustom}
							value={gapVerticalCustom}
							onChange={(value) =>
								onChange({
									gapVerticalCustom:
										value === ''
											? undefined
											: parseFloat(value),
								})
							}
							min={0}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) : null}
				</div>
			) : null}
		</BaseControl>
	);
}
