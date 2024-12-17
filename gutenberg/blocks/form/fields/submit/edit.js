import classnames from 'classnames/dedupe';
import { throttle } from 'throttle-debounce';

import {
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Parse all button blocks.
 *
 * @param {Object} submitData submit block data.
 *
 * @return {Array} - fields list.
 */
function getAllButtonBlocks(submitData) {
	let result = [];

	if (submitData.innerBlocks && submitData.innerBlocks.length) {
		submitData.innerBlocks.forEach((block) => {
			// field data.
			if (block.name && block.name === 'ghostkit/button-single') {
				result.push(block);
			}

			// inner blocks.
			if (block.innerBlocks && block.innerBlocks.length) {
				result = [...result, ...getAllButtonBlocks(block)];
			}
		});
	}

	return result;
}

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;

	let { className = '' } = props;

	const { align } = attributes;

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const { blockData } = useSelect(
		(select) => {
			const { getBlock } = select('core/block-editor');

			return {
				blockData: getBlock(clientId),
			};
		},
		[clientId]
	);

	function changeButtonTagName() {
		const allButtonBlocks = getAllButtonBlocks(blockData) || [];

		// Generate slugs for new fields.
		allButtonBlocks.forEach((data) => {
			if (
				!data.attributes.tagName ||
				data.attributes.tagName !== 'button'
			) {
				updateBlockAttributes(data.clientId, {
					tagName: 'button',
				});
			}
		});
	}

	const maybeChangeButtonTagName = throttle(
		200,
		changeButtonTagName.bind(this)
	);

	// Mount and update.
	useEffect(() => {
		maybeChangeButtonTagName();
	});

	className = classnames(
		'ghostkit-form-submit-button',
		align && align !== 'none'
			? `ghostkit-form-submit-button-align-${align}`
			: false,
		className
	);
	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		template: [
			[
				'ghostkit/button-single',
				{
					text: __('Submit', 'ghostkit'),
					tagName: 'button',
					focusOutlineWeight: 2,
				},
			],
		],
		allowedBlocks: ['ghostkit/button-single'],
		templateLock: 'all',
	});

	return (
		<>
			<BlockControls>
				<BlockAlignmentToolbar
					value={align}
					onChange={(value) => setAttributes({ align: value })}
					controls={['left', 'center', 'right']}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody>
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
			<div {...innerBlockProps} />
		</>
	);
}
