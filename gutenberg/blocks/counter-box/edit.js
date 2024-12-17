import classnames from 'classnames/dedupe';

import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	TabPanel,
	TextControl,
	ToggleControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import ColorIndicator from '../../components/color-indicator';
import ColorPicker from '../../components/color-picker';
import RangeControl from '../../components/range-control';
import ToggleGroup from '../../components/toggle-group';
import URLPicker from '../../components/url-picker';
import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected, clientId } = props;

	let { className = '' } = props;

	const hasChildBlocks = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');

			return blockEditor
				? blockEditor.getBlockOrder(clientId).length > 0
				: false;
		},
		[clientId]
	);

	const {
		number,
		animateInViewport,
		animateInViewportFrom,
		numberPosition,
		numberAlign,
		numberSize,
		showContent,
		numberColor,
		hoverNumberColor,
		url,
		ariaLabel,
		target,
		rel,
	} = attributes;

	className = classnames('ghostkit-counter-box', className);
	className = applyFilters('ghostkit.editor.className', className, props);

	const classNameNumber = classnames(
		'ghostkit-counter-box-number',
		`ghostkit-counter-box-number-align-${numberPosition || 'left'}`,
		numberPosition === 'top'
			? `ghostkit-counter-box-number-top-align-${numberAlign || 'center'}`
			: ''
	);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(
		{ className: 'ghostkit-counter-box-content' },
		{
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
			templateLock: false,
		}
	);
	const numberPositionLabel = __('Number Position', 'ghostkit');

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						label={__('Number Size', 'ghostkit')}
						value={numberSize}
						onChange={(value) =>
							setAttributes({ numberSize: value })
						}
						beforeIcon="editor-textcolor"
						afterIcon="editor-textcolor"
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<BaseControl
						id={numberPositionLabel}
						label={numberPositionLabel}
						__nextHasNoMarginBottom
					>
						<div>
							<Toolbar label={numberPositionLabel}>
								<ToolbarButton
									icon="align-center"
									title={__('Top', 'ghostkit')}
									onClick={() =>
										setAttributes({ numberPosition: 'top' })
									}
									isActive={numberPosition === 'top'}
								/>
								<ToolbarButton
									icon="align-left"
									title={__('Left', 'ghostkit')}
									onClick={() =>
										setAttributes({
											numberPosition: 'left',
										})
									}
									isActive={numberPosition === 'left'}
								/>
								<ToolbarButton
									icon="align-right"
									title={__('Right', 'ghostkit')}
									onClick={() =>
										setAttributes({
											numberPosition: 'right',
										})
									}
									isActive={numberPosition === 'right'}
								/>
							</Toolbar>
						</div>
					</BaseControl>
					{numberPosition === 'top' ? (
						<ToggleGroup
							label={__('Number Alignment', 'ghostkit')}
							value={numberAlign || 'center'}
							options={[
								{
									icon: getIcon('icon-horizontal-start'),
									label: __('Start', 'ghostkit'),
									value: 'left',
								},
								{
									icon: getIcon('icon-horizontal-center'),
									label: __('Center', 'ghostkit'),
									value: 'center',
								},
								{
									icon: getIcon('icon-horizontal-end'),
									label: __('End', 'ghostkit'),
									value: 'right',
								},
							]}
							onChange={(value) => {
								setAttributes({ numberAlign: value });
							}}
						/>
					) : null}
				</PanelBody>
				<PanelBody>
					<ToggleControl
						label={__('Show Content', 'ghostkit')}
						checked={!!showContent}
						onChange={(val) => setAttributes({ showContent: val })}
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
					{animateInViewport ? (
						<TextControl
							label={__('Animate from', 'ghostkit')}
							type="number"
							value={animateInViewportFrom}
							onChange={(value) =>
								setAttributes({
									animateInViewportFrom: parseInt(value, 10),
								})
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
							<ColorIndicator colorValue={numberColor} />
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
								<ApplyFilters
									name="ghostkit.editor.controls"
									attribute={
										isHover
											? 'hoverNumberColor'
											: 'numberColor'
									}
									props={props}
								>
									<ColorPicker
										label={__('Color', 'ghostkit')}
										value={
											isHover
												? hoverNumberColor
												: numberColor
										}
										onChange={(val) =>
											setAttributes(
												isHover
													? { hoverNumberColor: val }
													: { numberColor: val }
											)
										}
										alpha
										gradient
									/>
								</ApplyFilters>
							);
						}}
					</TabPanel>
				</PanelBody>
			</InspectorControls>
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
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="align-center"
						title={__('Top', 'ghostkit')}
						onClick={() => setAttributes({ numberPosition: 'top' })}
						isActive={numberPosition === 'top'}
					/>
					<ToolbarButton
						icon="align-left"
						title={__('Left', 'ghostkit')}
						onClick={() =>
							setAttributes({ numberPosition: 'left' })
						}
						isActive={numberPosition === 'left'}
					/>
					<ToolbarButton
						icon="align-right"
						title={__('Right', 'ghostkit')}
						onClick={() =>
							setAttributes({ numberPosition: 'right' })
						}
						isActive={numberPosition === 'right'}
					/>
				</ToolbarGroup>
			</BlockControls>
			<div {...blockProps}>
				<div className={classNameNumber}>
					<RichText
						inlineToolbar
						tagName="div"
						className="ghostkit-counter-box-number-wrap"
						placeholder={__('Write number…', 'ghostkit')}
						value={number}
						onChange={(value) => setAttributes({ number: value })}
						withoutInteractiveFormatting
					/>
				</div>
				{showContent ? <div {...innerBlockProps} /> : null}
			</div>
		</>
	);
}
