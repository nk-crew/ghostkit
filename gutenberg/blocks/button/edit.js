import classnames from 'classnames/dedupe';

import {
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { BaseControl, Button, PanelBody, Tooltip } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import GapSettings from '../../components/gap-settings';

const buttonBlockName = 'ghostkit/button-single';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;

	let { className = '' } = props;

	const { align, gap, gapCustom, gapVerticalCustom, count } = attributes;

	const { block, isSelectedBlockInRoot } = useSelect((select) => {
		const { getBlock, isBlockSelected, hasSelectedInnerBlock } =
			select('core/block-editor');

		return {
			block: getBlock(clientId),
			isSelectedBlockInRoot:
				isBlockSelected(clientId) ||
				hasSelectedInnerBlock(clientId, true),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { insertBlock } = useDispatch('core/block-editor');

	useEffect(() => {
		if (block && block.innerBlocks && count !== block.innerBlocks.length) {
			setAttributes({
				count: block.innerBlocks.length,
			});
		}
	}, [block, block?.innerBlocks?.length, count, setAttributes]);

	/**
	 * Insert a single button.
	 */
	function insertButtonSingle() {
		insertBlock(createBlock(buttonBlockName), undefined, clientId);
	}

	className = classnames(
		'ghostkit-button-wrapper',
		gap ? `ghostkit-button-wrapper-gap-${gap}` : false,
		align && align !== 'none'
			? `ghostkit-button-wrapper-align-${align}`
			: false,
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({
		className,
	});

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: 'ghostkit-button-wrapper-inner',
		},
		{
			allowedBlocks: [buttonBlockName],
			template: [[buttonBlockName]],
			orientation: 'horizontal',
			directInsert: true,
			templateInsertUpdatesSelection: true,
			renderAppender: isSelectedBlockInRoot
				? () => (
						<Tooltip text={__('Add Button', 'ghostkit')}>
							<Button
								className="block-list-appender__toggle block-editor-button-block-appender"
								icon={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="24"
										height="24"
										aria-hidden="true"
										focusable="false"
									>
										<path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" />
									</svg>
								}
								onClick={() => {
									insertButtonSingle();
								}}
							/>
						</Tooltip>
					)
				: undefined,
		}
	);

	return (
		<div {...blockProps}>
			<BlockControls>
				<BlockAlignmentToolbar
					value={align}
					onChange={(value) => setAttributes({ align: value })}
					controls={['left', 'center', 'right']}
				/>
			</BlockControls>
			<InspectorControls>
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
					<BaseControl
						id={__('Align', 'ghostkit')}
						label={__('Align', 'ghostkit')}
						__nextHasNoMarginBottom
					>
						<div>
							<BlockAlignmentToolbar
								value={align}
								onChange={(value) =>
									setAttributes({ align: value })
								}
								controls={['left', 'center', 'right']}
								isCollapsed={false}
							/>
						</div>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps}>{children}</div>
		</div>
	);
}
