import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const accordionItemBlockName = 'ghostkit/accordion-item';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;

	let { className = '' } = props;

	const { itemsCount, collapseOne, collapseTitleTag } = attributes;

	const { isSelectedBlockInRoot, count } = useSelect(
		(select) => {
			const { isBlockSelected, hasSelectedInnerBlock, getBlockCount } =
				select('core/block-editor');

			return {
				isSelectedBlockInRoot:
					isBlockSelected(clientId) ||
					hasSelectedInnerBlock(clientId, true),
				count: getBlockCount(clientId),
			};
		},
		[clientId]
	);

	useEffect(() => {
		if (count !== itemsCount) {
			setAttributes({
				itemsCount: count,
			});
		}
	}, [count, itemsCount, setAttributes]);

	const { insertBlock } = useDispatch('core/block-editor');

	function insertAccordionItem() {
		insertBlock(createBlock(accordionItemBlockName), undefined, clientId);
	}

	className = classnames(className, 'ghostkit-accordion');

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(
		{
			className,
		},
		{
			allowedBlocks: [accordionItemBlockName],
			template: [[accordionItemBlockName], [accordionItemBlockName]],
		}
	);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label={__('Collapse one item only', 'ghostkit')}
						checked={!!collapseOne}
						onChange={(val) => setAttributes({ collapseOne: val })}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Collapse Title HTML Element', 'ghostkit')}
						value={collapseTitleTag}
						options={[
							{
								value: 'div',
								label: __('Default (<div>)', 'ghostkit'),
							},
							{
								value: 'h1',
								label: __('<h1>', 'ghostkit'),
							},
							{
								value: 'h2',
								label: __('<h2>', 'ghostkit'),
							},
							{
								value: 'h3',
								label: __('<h3>', 'ghostkit'),
							},
							{
								value: 'h4',
								label: __('<h4>', 'ghostkit'),
							},
							{
								value: 'h5',
								label: __('<h5>', 'ghostkit'),
							},
							{
								value: 'h6',
								label: __('<h6>', 'ghostkit'),
							},
						]}
						onChange={(value) =>
							setAttributes({ collapseTitleTag: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
			{isSelectedBlockInRoot ? (
				<div className="ghostkit-accordion-add-item">
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
							insertAccordionItem();
						}}
					>
						{__('Add Accordion Item', 'ghostkit')}
					</Button>
				</div>
			) : null}
		</div>
	);
}
