import classnames from 'classnames/dedupe';

import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import GapSettings from '../../components/gap-settings';
import RangeControl from '../../components/range-control';
import ToggleGroup from '../../components/toggle-group';
import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { clientId, attributes, setAttributes } = props;

	const {
		gap,
		gapCustom,
		gapVerticalCustom,
		verticalAlign,
		horizontalAlign,
	} = attributes;

	const { removeBlock, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	const { getBlocks, columnsCount } = useSelect((select) => {
		const { getBlockCount } = select('core/block-editor');

		return {
			getBlocks: select('core/block-editor').getBlocks,
			columnsCount: getBlockCount(clientId),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Get columns sizes array from layout string
	 *
	 * @param {string} layout - layout data. Example: `3-6-3`
	 *
	 * @return {Array}.
	 */
	function getColumnsFromLayout(layout) {
		const result = [];
		const columnsData = layout.split('-');

		columnsData.forEach((col) => {
			const colAttrs = {
				size: col,
			};

			if (col === 'a') {
				colAttrs.size = 'auto';
			} else if (col === 'g') {
				colAttrs.size = 'grow';
			}

			// responsive.
			if (columnsData.length === 2) {
				colAttrs.md_size = '12';
			}
			if (columnsData.length === 3) {
				colAttrs.lg_size = '12';
			}
			if (columnsData.length === 4) {
				colAttrs.md_size = '12';
				colAttrs.lg_size = '6';
			}
			if (columnsData.length === 5) {
				colAttrs.sm_size = '12';
				colAttrs.md_size = '5';
				colAttrs.lg_size = '4';
			}
			if (columnsData.length === 6) {
				colAttrs.sm_size = '6';
				colAttrs.md_size = '4';
				colAttrs.lg_size = '3';
			}

			result.push(colAttrs);
		});

		return result;
	}

	/**
	 * Select predefined layout.
	 *
	 * @param {string} layout layout string.
	 */
	function onLayoutSelect(layout) {
		const columnsData = getColumnsFromLayout(layout);
		const newInnerBlocks = [];

		columnsData.forEach((colAttrs) => {
			newInnerBlocks.push(createBlock('ghostkit/grid-column', colAttrs));
		});

		replaceInnerBlocks(clientId, newInnerBlocks, false);
	}

	/**
	 * Layouts selector when no columns selected.
	 *
	 * @return {jsx}.
	 */
	function LayoutsSelector() {
		let layouts = [
			'12',
			'6-6',
			'4-4-4',
			'3-3-3-3',

			'5-7',
			'7-5',
			'3-3-6',
			'3-6-3',

			'6-3-3',
			'2-8-2',
			'g-g-g-g-g',
			'2-2-2-2-2-2',
		];
		layouts = applyFilters('ghostkit.editor.grid.layouts', layouts, props);

		const templatesModal = applyFilters(
			'ghostkit.editor.grid.templatesModal',
			'',
			props
		);

		return (
			<Placeholder
				icon={getIcon('block-grid')}
				label={__('Advanced Columns', 'ghostkit')}
				instructions={__(
					'Select one layout to get started.',
					'ghostkit'
				)}
				className="ghostkit-select-layout"
			>
				<div className="ghostkit-grid-layout-preview">
					{layouts.map((layout) => {
						const columnsData = getColumnsFromLayout(layout);

						return (
							<Button
								key={`layout-${layout}`}
								className="ghostkit-grid-layout-preview-btn ghostkit-grid"
								onClick={() => onLayoutSelect(layout)}
							>
								{columnsData.map((colAttrs, i) => {
									const colName = `layout-${layout}-col-${i}`;

									return (
										<div
											key={colName}
											className={classnames(
												'ghostkit-col',
												`ghostkit-col-${colAttrs.size}`
											)}
										/>
									);
								})}
							</Button>
						);
					})}
				</div>
				{templatesModal}
			</Placeholder>
		);
	}

	/**
	 * Updates the column count
	 *
	 * @param {number} newColumns New column count.
	 */
	function updateColumns(newColumns) {
		// Remove Grid block.
		if (newColumns < 1) {
			removeBlock(clientId);

			// Add new columns.
		} else if (newColumns > columnsCount) {
			const newCount = newColumns - columnsCount;
			const newInnerBlocks = [...getBlocks(clientId)];

			for (let i = 1; i <= newCount; i += 1) {
				newInnerBlocks.push(
					createBlock('ghostkit/grid-column', { size: 3 })
				);
			}

			replaceInnerBlocks(clientId, newInnerBlocks, false);

			// Remove columns.
		} else if (newColumns < columnsCount) {
			const newInnerBlocks = [...getBlocks(clientId)];
			newInnerBlocks.splice(newColumns, columnsCount - newColumns);

			replaceInnerBlocks(clientId, newInnerBlocks, false);
		}
	}

	let className = classnames(
		'ghostkit-grid',
		`ghostkit-grid-gap-${gap}`,
		verticalAlign ? `ghostkit-grid-align-items-${verticalAlign}` : false,
		horizontalAlign
			? `ghostkit-grid-justify-content-${horizontalAlign}`
			: false
	);

	// background
	const background = applyFilters(
		'ghostkit.editor.grid.background',
		'',
		props
	);

	if (background) {
		className = classnames(className, 'ghostkit-grid-with-bg');
	}

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({
		className,
	});

	const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['ghostkit/grid-column'],
		orientation: 'horizontal',
		renderAppender: false,
	});

	return (
		<div {...innerBlocksProps}>
			{columnsCount > 0 ? (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={getIcon('icon-vertical-top')}
							title={__('Content Vertical Start', 'ghostkit')}
							onClick={() => setAttributes({ verticalAlign: '' })}
							isActive={verticalAlign === ''}
						/>
						<ToolbarButton
							icon={getIcon('icon-vertical-center')}
							title={__('Content Vertical Center', 'ghostkit')}
							onClick={() =>
								setAttributes({ verticalAlign: 'center' })
							}
							isActive={verticalAlign === 'center'}
						/>
						<ToolbarButton
							icon={getIcon('icon-vertical-bottom')}
							title={__('Content Vertical End', 'ghostkit')}
							onClick={() =>
								setAttributes({ verticalAlign: 'end' })
							}
							isActive={verticalAlign === 'end'}
						/>
					</ToolbarGroup>
				</BlockControls>
			) : null}
			<InspectorControls>
				<ApplyFilters
					name="ghostkit.editor.controls"
					attribute="columns"
					props={props}
				>
					<PanelBody>
						<RangeControl
							label={__('Columns', 'ghostkit')}
							value={columnsCount}
							onChange={(value) => updateColumns(value)}
							min={1}
							max={12}
							allowCustomMax
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				</ApplyFilters>
			</InspectorControls>
			{columnsCount > 0 ? (
				<InspectorControls>
					<PanelBody>
						<ToggleGroup
							label={__('Vertical alignment', 'ghostkit')}
							value={verticalAlign}
							options={[
								{
									icon: getIcon('icon-vertical-top'),
									label: __('Top', 'ghostkit'),
									value: '',
								},
								{
									icon: getIcon('icon-vertical-center'),
									label: __('Center', 'ghostkit'),
									value: 'center',
								},
								{
									icon: getIcon('icon-vertical-bottom'),
									label: __('Bottom', 'ghostkit'),
									value: 'end',
								},
							]}
							onChange={(value) => {
								setAttributes({ verticalAlign: value });
							}}
							isDeselectable
							isAdaptiveWidth
						/>
						<ToggleGroup
							label={__('Horizontal alignment', 'ghostkit')}
							value={horizontalAlign}
							options={[
								{
									icon: getIcon('icon-horizontal-start'),
									label: __('Start', 'ghostkit'),
									value: '',
								},
								{
									icon: getIcon('icon-horizontal-center'),
									label: __('Center', 'ghostkit'),
									value: 'center',
								},
								{
									icon: getIcon('icon-horizontal-end'),
									label: __('End', 'ghostkit'),
									value: 'end',
								},
								{
									icon: getIcon('icon-horizontal-around'),
									label: __('Around', 'ghostkit'),
									value: 'around',
								},
								{
									icon: getIcon('icon-horizontal-between'),
									label: __('Space Between', 'ghostkit'),
									value: 'between',
								},
							]}
							onChange={(value) => {
								setAttributes({ horizontalAlign: value });
							}}
							isDeselectable
						/>
					</PanelBody>
					<PanelBody>
						<GapSettings
							gap={gap}
							gapCustom={gapCustom}
							gapVerticalCustom={gapVerticalCustom}
							onChange={(data) => {
								setAttributes(data);
							}}
							allowVerticalGap
						/>
					</PanelBody>
				</InspectorControls>
			) : null}
			<InspectorControls>
				<div className="ghostkit-background-controls">
					<ApplyFilters
						name="ghostkit.editor.controls"
						attribute="background"
						props={props}
					/>
				</div>
			</InspectorControls>
			{columnsCount > 0 ? (
				<>
					{background}
					<div className="ghostkit-grid-inner">{children}</div>
				</>
			) : (
				<LayoutsSelector />
			)}
		</div>
	);
}
