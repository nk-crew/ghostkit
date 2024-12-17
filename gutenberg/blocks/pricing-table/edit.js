import classnames from 'classnames/dedupe';

import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	BaseControl,
	Button,
	PanelBody,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import GapSettings from '../../components/gap-settings';
import getIcon from '../../utils/get-icon';

const pricingItemBlockName = 'ghostkit/pricing-table-item';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;

	let { className = '' } = props;

	const { count, gap, gapCustom, verticalAlign, horizontalAlign } =
		attributes;

	const { itemsCount, isSelectedBlockInRoot } = useSelect((select) => {
		const { isBlockSelected, getBlockCount, hasSelectedInnerBlock } =
			select('core/block-editor');

		return {
			itemsCount: getBlockCount(clientId),
			isSelectedBlockInRoot:
				isBlockSelected(clientId) ||
				hasSelectedInnerBlock(clientId, true),
		};
	});

	const { insertBlock } = useDispatch('core/block-editor');

	function insertPricingItem() {
		insertBlock(
			createBlock('ghostkit/pricing-table-item'),
			undefined,
			clientId
		);
	}

	// Update current columns number.
	useEffect(() => {
		if (count !== itemsCount) {
			setAttributes({
				count: itemsCount,
			});
		}
	}, [count, itemsCount, setAttributes]);

	className = classnames(
		className,
		'ghostkit-pricing-table',
		`ghostkit-pricing-table-gap-${gap}`,
		count ? `ghostkit-pricing-table-items-${count}` : false,
		verticalAlign
			? `ghostkit-pricing-table-align-vertical-${verticalAlign}`
			: false,
		horizontalAlign
			? `ghostkit-pricing-table-align-horizontal-${horizontalAlign}`
			: false
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{ className: 'ghostkit-pricing-table-inner' },
		{
			template: [[pricingItemBlockName], [pricingItemBlockName]],
			allowedBlocks: [pricingItemBlockName],
			orientation: 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<div {...blockProps}>
			<BlockControls>
				<AlignmentToolbar
					value={horizontalAlign}
					onChange={(val) => setAttributes({ horizontalAlign: val })}
				/>
			</BlockControls>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={getIcon('icon-vertical-top')}
						title={__('ItemsVertical Start', 'ghostkit')}
						onClick={() => setAttributes({ verticalAlign: '' })}
						isActive={verticalAlign === ''}
					/>
					<ToolbarButton
						icon={getIcon('icon-vertical-center')}
						title={__('ItemsVertical Center', 'ghostkit')}
						onClick={() =>
							setAttributes({ verticalAlign: 'center' })
						}
						isActive={verticalAlign === 'center'}
					/>
					<ToolbarButton
						icon={getIcon('icon-vertical-bottom')}
						title={__('ItemsVertical End', 'ghostkit')}
						onClick={() => setAttributes({ verticalAlign: 'end' })}
						isActive={verticalAlign === 'end'}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody>
					<BaseControl
						id={__('Vertical align', 'ghostkit')}
						label={__('Vertical align', 'ghostkit')}
						__nextHasNoMarginBottom
					>
						<div>
							<Toolbar label={__('Vertical align', 'ghostkit')}>
								<ToolbarButton
									icon={getIcon('icon-vertical-top')}
									title={__(
										'ItemsVertical Start',
										'ghostkit'
									)}
									onClick={() =>
										setAttributes({ verticalAlign: '' })
									}
									isActive={verticalAlign === ''}
								/>
								<ToolbarButton
									icon={getIcon('icon-vertical-center')}
									title={__(
										'ItemsVertical Center',
										'ghostkit'
									)}
									onClick={() =>
										setAttributes({
											verticalAlign: 'center',
										})
									}
									isActive={verticalAlign === 'center'}
								/>
								<ToolbarButton
									icon={getIcon('icon-vertical-bottom')}
									title={__('ItemsVertical End', 'ghostkit')}
									onClick={() =>
										setAttributes({ verticalAlign: 'end' })
									}
									isActive={verticalAlign === 'end'}
								/>
							</Toolbar>
						</div>
					</BaseControl>
					<BaseControl
						id={__('Horizontal align', 'ghostkit')}
						label={__('Horizontal align', 'ghostkit')}
						__nextHasNoMarginBottom
					>
						<div>
							<AlignmentToolbar
								value={horizontalAlign}
								onChange={(val) =>
									setAttributes({ horizontalAlign: val })
								}
								isCollapsed={false}
							/>
						</div>
					</BaseControl>
				</PanelBody>
				<PanelBody>
					<GapSettings
						gap={gap}
						gapCustom={gapCustom}
						onChange={(data) => {
							setAttributes(data);
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps}>
				{children}
				{isSelectedBlockInRoot && count < 6 ? (
					<div className="ghostkit-pricing-table-add-item">
						<Button
							variant="secondary"
							icon={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									role="img"
									focusable="false"
								>
									<path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" />
								</svg>
							}
							onClick={() => {
								insertPricingItem();
							}}
						>
							{__('Add Pricing Table', 'ghostkit')}
						</Button>
					</div>
				) : null}
			</div>
		</div>
	);
}
