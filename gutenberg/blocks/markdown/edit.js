import classnames from 'classnames/dedupe';

import {
	BlockControls,
	PlainText,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import MDRender from './render';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected } = props;
	const { content } = attributes;

	let { className } = props;

	const [activeTab, setActiveTab] = useState('editor');
	const ref = useRef();

	// Change active tab when block is not selected.
	useEffect(() => {
		if (!isSelected && activeTab === 'preview') {
			setActiveTab('editor');
		}
	}, [isSelected, activeTab]);

	// Focus input.
	useEffect(() => {
		if (isSelected && activeTab === 'editor' && ref?.current) {
			ref?.current?.focus?.();
		}
	}, [ref, isSelected, activeTab]);

	const { currentBlockId } = useSelect((select) => ({
		currentBlockId: select('core/block-editor').getSelectedBlockClientId(),
	}));

	const { removeBlocks } = useDispatch('core/block-editor');

	function removeBlock() {
		removeBlocks(currentBlockId);
	}

	className = classnames('ghostkit-markdown', className);

	const blockProps = useBlockProps({ className });

	if (!isSelected && (!content || content.trim() === '')) {
		return (
			<div {...blockProps}>
				<p>{__('Write your _Markdown_ **here**…', 'ghostkit')}</p>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className={classnames(
							'components-button components-tab-button',
							activeTab === 'editor' && 'is-pressed'
						)}
						onClick={() => setActiveTab('editor')}
					>
						<span>{__('Markdown', 'ghostkit')}</span>
					</ToolbarButton>
					<ToolbarButton
						className={classnames(
							'components-button components-tab-button',
							activeTab === 'preview' && 'is-pressed'
						)}
						onClick={() => setActiveTab('preview')}
					>
						<span>{__('Preview', 'ghostkit')}</span>
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>

			{activeTab === 'preview' || !isSelected ? (
				<MDRender content={content} />
			) : (
				<PlainText
					onChange={(val) => {
						setAttributes({ content: val });
					}}
					onKeyDown={(e) => {
						// Remove the block if content is empty and we're pressing the Backspace key
						if (e.keyCode === 8 && content === '') {
							removeBlock();
							e.preventDefault();
						}
					}}
					aria-label={__('Markdown', 'ghostkit')}
					ref={ref}
					value={content}
				/>
			)}
		</div>
	);
}
