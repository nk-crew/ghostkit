import classnames from 'classnames/dedupe';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, Tooltip } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import RemoveButton from '../../components/remove-button';
import getUniqueSlug from '../../utils/get-unique-slug';
import EditBlockControls from './edit/block-controls';
import EditInspectorControls from './edit/inspector-controls';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;
	let { className = '' } = props;

	const {
		tabActive,
		buttonsVerticalAlign,
		buttonsAlign,
		tabsData = [],
	} = attributes;

	const { getBlocks, block, isSelectedBlockInRoot } = useSelect((select) => {
		const {
			getBlock,
			getBlocks: selectGetBlocks,
			isBlockSelected,
			hasSelectedInnerBlock,
		} = select('core/block-editor');

		return {
			getBlocks: selectGetBlocks,
			block: getBlock(clientId),
			isSelectedBlockInRoot:
				isBlockSelected(clientId) ||
				hasSelectedInnerBlock(clientId, true),
		};
	});

	const { updateBlockAttributes, removeBlock, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	/**
	 * Returns the layouts configuration for a given number of tabs.
	 *
	 * @param {number} attributes tabs attributes.
	 *
	 * @return {Object[]} Tabs layout configuration.
	 */
	const getTabsTemplate = () => {
		return tabsData.map((tabData) => ['ghostkit/tabs-tab-v2', tabData]);
	};

	const getTabs = () => {
		return block.innerBlocks;
	};

	const changeLabel = (value, i) => {
		const tabs = getTabs();

		if (tabs[i]) {
			const newSlug = getUniqueSlug(`tab ${value}`, tabs[i].clientId);

			const newTabsData = tabsData.map((oldTabData, newIndex) => {
				if (i === newIndex) {
					return {
						...oldTabData,
						...{
							title: value,
							slug: newSlug,
						},
					};
				}

				return oldTabData;
			});

			setAttributes({
				tabActive: newSlug,
				tabsData: newTabsData,
			});
			updateBlockAttributes(tabs[i].clientId, {
				slug: newSlug,
			});
		}
	};

	const removeTab = (i) => {
		if (block.innerBlocks.length <= 1) {
			removeBlock(block.clientId);
		} else if (block.innerBlocks[i]) {
			removeBlock(block.innerBlocks[i].clientId);

			if (tabsData[i]) {
				const newTabsData = [...tabsData];
				newTabsData.splice(i, 1);

				const innerBlocks = [...getBlocks(block.clientId)];
				innerBlocks.splice(i, 1);

				replaceInnerBlocks(block.clientId, innerBlocks, false);

				setAttributes({
					tabsData: newTabsData,
				});
			}
		}
	};

	className = classnames(
		className,
		'ghostkit-tabs',
		buttonsVerticalAlign && 'ghostkit-tabs-buttons-vertical'
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({
		className,
	});
	const innerBlockProps = useInnerBlocksProps(
		{ className: 'ghostkit-tabs-content' },
		{
			template: getTabsTemplate(),
			templateLock: 'all',
			allowedBlocks: ['ghostkit/tabs-tab-v2'],
		}
	);

	return (
		<>
			<EditBlockControls
				attributes={attributes}
				setAttributes={setAttributes}
			/>
			<EditInspectorControls
				attributes={attributes}
				setAttributes={setAttributes}
			/>

			<div {...blockProps}>
				<div
					className={classnames(
						'ghostkit-tabs-buttons',
						`ghostkit-tabs-buttons-align-${buttonsAlign}`
					)}
					role="tablist"
					aria-orientation={
						buttonsVerticalAlign ? 'vertical' : 'horizontal'
					}
				>
					{tabsData.map((tabData, i) => {
						const { slug, title } = tabData;
						const selected = tabActive === slug;
						const tabName = `tab_button_${i}`;

						return (
							<div
								id={`${slug}-button`}
								className={classnames(
									'ghostkit-tabs-buttons-item',
									selected &&
										'ghostkit-tabs-buttons-item-active'
								)}
								role="tab"
								key={tabName}
							>
								<RichText
									tagName="span"
									placeholder={__('Tab label', 'ghostkit')}
									value={title}
									onFocus={() =>
										setAttributes({ tabActive: slug })
									}
									onChange={(value) => {
										changeLabel(value, i);
									}}
									withoutInteractiveFormatting
								/>
								<RemoveButton
									show={isSelectedBlockInRoot}
									tooltipText={__('Remove tab?', 'ghostkit')}
									onRemove={() => {
										removeTab(i);
									}}
								/>
							</div>
						);
					})}
					{isSelectedBlockInRoot ? (
						<Tooltip text={__('Add Tab', 'ghostkit')}>
							<Button
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
									const newTabsData = [...tabsData];
									const newDataLength = tabsData.length + 1;

									newTabsData.push({
										slug: `tab-${newDataLength}`,
										title: `Tab ${newDataLength}`,
									});

									const newBlock = createBlock(
										'ghostkit/tabs-tab-v2',
										{
											slug: `tab-${newDataLength}`,
											title: `Tab ${newDataLength}`,
										}
									);

									let innerBlocks = getBlocks(clientId);
									innerBlocks = [...innerBlocks, newBlock];

									replaceInnerBlocks(
										clientId,
										innerBlocks,
										false
									);

									setAttributes({ tabsData: newTabsData });
								}}
							/>
						</Tooltip>
					) : null}
				</div>
				<div {...innerBlockProps} />
			</div>
		</>
	);
}
