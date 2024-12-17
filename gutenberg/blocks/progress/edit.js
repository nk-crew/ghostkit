import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ResizableBox,
	TabPanel,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import ColorIndicator from '../../components/color-indicator';
import ColorPicker from '../../components/color-picker';
import RangeControl from '../../components/range-control';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected, toggleSelection } = props;

	let { className = '' } = props;

	const {
		caption,
		height,
		percent,
		borderRadius,
		striped,
		animateInViewport,
		showCount,
		countPrefix,
		countSuffix,
		color,
		backgroundColor,
		hoverColor,
		hoverBackgroundColor,
	} = attributes;

	className = classnames('ghostkit-progress', className);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						label={__('Height', 'ghostkit')}
						value={height || ''}
						onChange={(value) => setAttributes({ height: value })}
						min={1}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Percent', 'ghostkit')}
						value={percent || ''}
						onChange={(value) => setAttributes({ percent: value })}
						min={0}
						max={100}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Corner Radius', 'ghostkit')}
						value={borderRadius}
						min={0}
						max={10}
						onChange={(value) =>
							setAttributes({ borderRadius: value })
						}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody>
					<ToggleControl
						label={__('Show Count', 'ghostkit')}
						checked={!!showCount}
						onChange={(val) => setAttributes({ showCount: val })}
						__nextHasNoMarginBottom
					/>
					{showCount ? (
						<>
							<TextControl
								label={__('Count Prefix', 'ghostkit')}
								value={countPrefix}
								onChange={(value) =>
									setAttributes({ countPrefix: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Count Suffix', 'ghostkit')}
								value={countSuffix}
								onChange={(value) =>
									setAttributes({ countSuffix: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					) : null}
					<ToggleControl
						label={__('Striped', 'ghostkit')}
						checked={!!striped}
						onChange={(val) => setAttributes({ striped: val })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Animate in viewport', 'ghostkit')}
						checked={!!animateInViewport}
						onChange={(val) =>
							setAttributes({ animateInViewport: val })
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody
					title={
						<>
							{__('Colors', 'ghostkit')}
							<ColorIndicator colorValue={color} />
							<ColorIndicator colorValue={backgroundColor} />
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
											label={__('Bar', 'ghostkit')}
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
												? 'hoverBackgroundColor'
												: 'backgroundColor'
										}
										props={props}
									>
										<ColorPicker
											label={__('Background', 'ghostkit')}
											value={
												isHover
													? hoverBackgroundColor
													: backgroundColor
											}
											onChange={(val) =>
												setAttributes(
													isHover
														? {
																hoverBackgroundColor:
																	val,
															}
														: {
																backgroundColor:
																	val,
															}
												)
											}
											alpha
											gradient
										/>
									</ApplyFilters>
								</>
							);
						}}
					</TabPanel>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!RichText.isEmpty(caption) || isSelected ? (
					<RichText
						inlineToolbar
						tagName="div"
						className="ghostkit-progress-caption"
						placeholder={__('Write caption…', 'ghostkit')}
						value={caption}
						onChange={(newCaption) =>
							setAttributes({ caption: newCaption })
						}
					/>
				) : null}
				{showCount ? (
					<div
						className="ghostkit-progress-bar-count"
						style={{ width: `${percent}%` }}
					>
						<div>
							{countPrefix}
							{percent}
							{countSuffix}
						</div>
					</div>
				) : null}
				<ResizableBox
					className={classnames({ 'is-selected': isSelected })}
					size={{
						width: '100%',
						height,
					}}
					minWidth="0%"
					maxWidth="100%"
					minHeight="1"
					enable={{ bottom: true }}
					onResizeStart={() => {
						toggleSelection(false);
					}}
					onResizeStop={(event, direction, elt, delta) => {
						setAttributes({
							height: parseInt(height + delta.height, 10),
						});
						toggleSelection(true);
					}}
				>
					<div
						className={classnames({
							'ghostkit-progress-wrap': true,
							'ghostkit-progress-bar-striped': striped,
						})}
					>
						<ResizableBox
							className={classnames('ghostkit-progress-bar', {
								'is-selected': isSelected,
							})}
							size={{ width: `${percent}%` }}
							minWidth="0%"
							maxWidth="100%"
							minHeight="100%"
							maxHeight="100%"
							enable={{ right: true }}
							onResizeStart={() => {
								toggleSelection(false);
							}}
							onResizeStop={(event, direction, elt, delta) => {
								setAttributes({
									percent: Math.min(
										100,
										Math.max(
											0,
											percent +
												parseInt(
													(100 * delta.width) /
														elt.parentNode.getBoundingClientRect()
															.width,
													10
												)
										)
									),
								});
								toggleSelection(true);
							}}
						/>
					</div>
				</ResizableBox>
			</div>
		</>
	);
}
