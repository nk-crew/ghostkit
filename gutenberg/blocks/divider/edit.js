import classnames from 'classnames/dedupe';

import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TabPanel,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import ColorIndicator from '../../components/color-indicator';
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import RangeControl from '../../components/range-control';
import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes } = props;
	let { className = '' } = props;

	const {
		type,
		size,
		icon,
		iconSize,
		color,
		iconColor,
		hoverColor,
		hoverIconColor,
	} = attributes;

	className = classnames(
		'ghostkit-divider',
		`ghostkit-divider-type-${type}`,
		className
	);

	if (icon) {
		className = classnames(className, 'ghostkit-divider-with-icon');
	}

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={getIcon('border-solid')}
						label={__('Type', 'ghostkit')}
						controls={[
							{
								label: __('Line', 'ghostkit'),
								icon: getIcon('border-solid'),
								isActive: type === 'solid',
								onClick: () => setAttributes({ type: 'solid' }),
							},
							{
								label: __('Dashed', 'ghostkit'),
								icon: getIcon('border-dashed'),
								isActive: type === 'dashed',
								onClick: () =>
									setAttributes({ type: 'dashed' }),
							},
							{
								label: __('Dotted', 'ghostkit'),
								icon: getIcon('border-dotted'),
								isActive: type === 'dotted',
								onClick: () =>
									setAttributes({ type: 'dotted' }),
							},
							{
								label: __('Double', 'ghostkit'),
								icon: getIcon('border-double'),
								isActive: type === 'double',
								onClick: () =>
									setAttributes({ type: 'double' }),
							},
						]}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody>
					<SelectControl
						label={__('Type', 'ghostkit')}
						value={type}
						options={[
							{
								value: 'solid',
								label: __('Line', 'ghostkit'),
							},
							{
								value: 'dashed',
								label: __('Dashed', 'ghostkit'),
							},
							{
								value: 'dotted',
								label: __('Dotted', 'ghostkit'),
							},
							{
								value: 'double',
								label: __('Double', 'ghostkit'),
							},
						]}
						onChange={(value) => setAttributes({ type: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Size', 'ghostkit')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={1}
						max={7}
						beforeIcon="editor-textcolor"
						afterIcon="editor-textcolor"
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
						<RangeControl
							label={__('Icon Size', 'ghostkit')}
							value={iconSize}
							onChange={(value) =>
								setAttributes({ iconSize: value })
							}
							min={10}
							beforeIcon="editor-textcolor"
							afterIcon="editor-textcolor"
							allowCustomMin
							allowCustomMax
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
							{icon ? (
								<ColorIndicator colorValue={iconColor} />
							) : null}
						</>
					}
					initialOpen={false}
				>
					<TabPanel
						className="ghostkit-control-tabs ghostkit-control-tabs-wide"
						tabs={[
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
						]}
					>
						{(tabData) => {
							const isHover = tabData.name === 'hover';
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
											label={__('Divider', 'ghostkit')}
											value={isHover ? hoverColor : color}
											onChange={(val) =>
												setAttributes(
													isHover
														? { hoverColor: val }
														: { color: val }
												)
											}
											alpha
										/>
									</ApplyFilters>
									{icon ? (
										<ApplyFilters
											name="ghostkit.editor.controls"
											attribute={
												isHover
													? 'hoverIconColor'
													: 'iconColor'
											}
											props={props}
										>
											<ColorPicker
												label={__('Icon', 'ghostkit')}
												value={
													isHover
														? hoverIconColor
														: iconColor
												}
												onChange={(val) =>
													setAttributes(
														isHover
															? {
																	hoverIconColor:
																		val,
																}
															: { iconColor: val }
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
			<div {...blockProps}>
				{icon ? (
					<div className="ghostkit-divider-icon">
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
			</div>
		</>
	);
}
