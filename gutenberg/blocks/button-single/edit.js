import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TabPanel,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import ColorIndicator from '../../components/color-indicator';
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import RangeControl from '../../components/range-control';
import ToggleGroup from '../../components/toggle-group';
import URLPicker from '../../components/url-picker';

const SIZES = [
	{
		label: 'XS',
		value: 'xs',
	},
	{
		label: 'S',
		value: 'sm',
	},
	{
		label: 'M',
		value: 'md',
	},
	{
		label: 'L',
		value: 'lg',
	},
	{
		label: 'XL',
		value: 'xl',
	},
];

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected } = props;

	const {
		tagName,
		text,
		icon,
		iconPosition,
		hideText,
		url,
		ariaLabel,
		target,
		rel,
		size,
		color,
		textColor,
		borderRadius,
		borderWeight,
		borderColor,
		focusOutlineWeight,
		focusOutlineColor,
		hoverColor,
		hoverTextColor,
		hoverBorderColor,
	} = attributes;

	let { className = '' } = attributes;

	const [selectedColorState, setSelectedColorState] = useState('normal');

	// Reset selected color state when block is not selected.
	useEffect(() => {
		if (!isSelected) {
			setSelectedColorState('normal');
		}
	}, [isSelected]);

	let isNormalState = false;
	let isHoveredState = false;
	let isFocusedState = false;

	if (isSelected) {
		isNormalState = true;

		if (selectedColorState === 'hover') {
			isNormalState = false;
			isHoveredState = true;
		} else if (selectedColorState === 'focus') {
			isNormalState = false;
			isFocusedState = true;
		}
	}

	className = classnames(
		'ghostkit-button',
		size && `ghostkit-button-${size}`,
		hideText && 'ghostkit-button-icon-only',
		isNormalState && 'ghostkit-button-is-normal-state',
		isHoveredState && 'ghostkit-button-is-hover-state',
		isFocusedState && 'ghostkit-button-is-focus-state',
		className
	);

	// focus outline
	if (focusOutlineWeight && focusOutlineColor) {
		className = classnames(className, 'ghostkit-button-with-outline');
	}

	className = applyFilters('ghostkit.editor.className', className, props);

	const colorsTabs = [
		{
			name: 'normal',
			title: __('Normal', 'ghostkit'),
			className: 'ghostkit-control-tabs-tab',
		},
		{
			name: 'hover',
			title: __('Hover', 'ghostkit'),
			className: 'ghostkit-control-tabs-tab',
		},
	];

	if (focusOutlineWeight && focusOutlineColor) {
		colorsTabs.push({
			name: 'focus',
			title: __('Focus', 'ghostkit'),
			className: 'ghostkit-control-tabs-tab',
		});
	}

	const blockProps = useBlockProps({
		className,
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody>
					<div className="blocks-size__main">
						<ToggleGroup
							value={size}
							options={SIZES}
							onChange={(value) => {
								setAttributes({ size: value });
							}}
						/>
					</div>
				</PanelBody>
				<PanelBody>
					<RangeControl
						label={__('Corner Radius', 'ghostkit')}
						value={borderRadius}
						min={0}
						max={50}
						onChange={(value) =>
							setAttributes({ borderRadius: value })
						}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Border Size', 'ghostkit')}
						value={borderWeight}
						min={0}
						max={6}
						onChange={(value) =>
							setAttributes({ borderWeight: value })
						}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Focus Outline Size', 'ghostkit')}
						value={focusOutlineWeight}
						min={0}
						max={6}
						onChange={(value) =>
							setAttributes({ focusOutlineWeight: value })
						}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody>
					<IconPicker
						label={__('Icon', 'ghostkit')}
						value={icon}
						onChange={(value) => setAttributes({ icon: value })}
						insideInspector
					/>
					{icon ? (
						<ToggleControl
							label={__('Show Icon Only', 'ghostkit')}
							checked={!!hideText}
							onChange={(val) => setAttributes({ hideText: val })}
							__nextHasNoMarginBottom
						/>
					) : null}
					{icon && !hideText ? (
						<SelectControl
							label={__('Icon Position', 'ghostkit')}
							value={iconPosition}
							options={[
								{
									value: 'left',
									label: __('Left', 'ghostkit'),
								},
								{
									value: 'right',
									label: __('Right', 'ghostkit'),
								},
							]}
							onChange={(value) =>
								setAttributes({ iconPosition: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) : null}
				</PanelBody>
				<PanelBody
					title={
						<>
							{__('Colors', 'ghostkit')}
							<ColorIndicator colorValue={color} />
							<ColorIndicator colorValue={textColor} />
							{borderWeight ? (
								<ColorIndicator colorValue={borderColor} />
							) : null}
							{focusOutlineWeight && focusOutlineColor ? (
								<ColorIndicator
									colorValue={focusOutlineColor}
								/>
							) : null}
						</>
					}
					initialOpen={false}
				>
					<TabPanel
						className="ghostkit-control-tabs ghostkit-control-tabs-wide"
						tabs={colorsTabs}
						onSelect={(state) => {
							setSelectedColorState(state);
						}}
					>
						{(tabData) => {
							const isHover = tabData.name === 'hover';

							// focus tab
							if (tabData.name === 'focus') {
								return (
									<ApplyFilters
										name="ghostkit.editor.controls"
										attribute="focusOutlineColor"
										props={props}
									>
										<ColorPicker
											label={__('Outline', 'ghostkit')}
											value={focusOutlineColor}
											onChange={(val) =>
												setAttributes({
													focusOutlineColor: val,
												})
											}
											alpha
										/>
									</ApplyFilters>
								);
							}

							return (
								<>
									<ApplyFilters
										name="ghostkit.editor.controls"
										attribute={
											isHover ? 'hoverColor' : 'color'
										}
										props={props}
									>
										<ColorPicker
											label={__('Background', 'ghostkit')}
											value={isHover ? hoverColor : color}
											onChange={(val) =>
												setAttributes(
													isHover
														? { hoverColor: val }
														: { color: val }
												)
											}
											alpha
											gradient
										/>
									</ApplyFilters>
									<ApplyFilters
										name="ghostkit.editor.controls"
										attribute={
											isHover
												? 'hoverTextColor'
												: 'textColor'
										}
										props={props}
									>
										<ColorPicker
											label={__('Text', 'ghostkit')}
											value={
												isHover
													? hoverTextColor
													: textColor
											}
											onChange={(val) =>
												setAttributes(
													isHover
														? {
																hoverTextColor:
																	val,
															}
														: { textColor: val }
												)
											}
											alpha
										/>
									</ApplyFilters>
									{borderWeight ? (
										<ApplyFilters
											name="ghostkit.editor.controls"
											attribute={
												isHover
													? 'hoverBorderColor'
													: 'borderColor'
											}
											props={props}
										>
											<ColorPicker
												label={__('Border', 'ghostkit')}
												value={
													isHover
														? hoverBorderColor
														: borderColor
												}
												onChange={(val) =>
													setAttributes(
														isHover
															? {
																	hoverBorderColor:
																		val,
																}
															: {
																	borderColor:
																		val,
																}
													)
												}
												alpha
											/>
										</ApplyFilters>
									) : null}
								</>
							);
						}}
					</TabPanel>
				</PanelBody>
			</InspectorControls>
			{!tagName || tagName === 'a' ? (
				<URLPicker
					url={url}
					rel={rel}
					ariaLabel={ariaLabel}
					target={target}
					onChange={(data) => {
						setAttributes(data);
					}}
					isSelected={isSelected}
					toolbarSettings
					inspectorSettings
				/>
			) : null}
			{icon ? (
				<div
					className={`ghostkit-button-icon ghostkit-button-icon-${
						iconPosition === 'right' ? 'right' : 'left'
					}`}
				>
					<IconPicker.Dropdown
						onChange={(value) => setAttributes({ icon: value })}
						value={icon}
						renderToggle={({ onToggle }) => (
							<IconPicker.Preview
								onClick={onToggle}
								name={icon}
							/>
						)}
					/>
				</div>
			) : null}
			{!hideText ? (
				<RichText
					placeholder={__('Write text…', 'ghostkit')}
					value={text}
					onChange={(value) => setAttributes({ text: value })}
					isSelected={isSelected}
					withoutInteractiveFormatting
				/>
			) : null}
		</div>
	);
}
