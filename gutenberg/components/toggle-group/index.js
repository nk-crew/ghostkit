import classnames from 'classnames/dedupe';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	BaseControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';

/**
 * Component Class
 *
 * @param props
 */
export default function ToggleGroup(props) {
	const {
		label,
		value,
		options,
		onChange,
		isBlock,
		isAdaptiveWidth,
		isDeselectable,
	} = props;

	if (ToggleGroupControl && ToggleGroupControlOption) {
		return (
			<BaseControl
				id={label}
				label={label}
				className={classnames(
					'ghostkit-control-toggle-group',
					props.className
				)}
				__nextHasNoMarginBottom
			>
				<ToggleGroupControl
					value={value}
					onChange={onChange}
					isBlock={isBlock}
					isAdaptiveWidth={isAdaptiveWidth}
					isDeselectable={isDeselectable}
					hideLabelFromVision
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				>
					{options.map((option) =>
						option.icon ? (
							<ToggleGroupControlOptionIcon
								key={option.value}
								value={option.value}
								icon={option.icon}
								label={option.label}
								disabled={option.disabled}
							/>
						) : (
							<ToggleGroupControlOption
								key={option.value}
								value={option.value}
								label={option.label}
								disabled={option.disabled}
							/>
						)
					)}
				</ToggleGroupControl>
			</BaseControl>
		);
	}

	// Fallback.
	return (
		<BaseControl id={label} label={label} __nextHasNoMarginBottom>
			<ButtonGroup className="ghostkit-control-toggle-group">
				{options.map((option) => (
					<Button
						key={option.value}
						variant={value === option.value ? 'primary' : ''}
						isPressed={value === option.value}
						disabled={option.disabled}
						onClick={() => {
							onChange(option.value);
						}}
					>
						{option.label}
					</Button>
				))}
			</ButtonGroup>
		</BaseControl>
	);
}
