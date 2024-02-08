import { cloneDeep } from 'lodash';

import { getBlockType, hasBlockSupport, parse } from '@wordpress/blocks';
import { useDispatch, useRegistry } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import compactObject from '../../utils/compact-object';
import merge from '../../utils/merge';
import { getSpecificPropsFromStyles } from '../../utils/styles';
import { EXTENSIONS } from '../constants';

/**
 * Determine if the copied text looks like serialized blocks or not.
 * Since plain text will always get parsed into a freeform block,
 * we check that if the parsed blocks is anything other than that.
 *
 * @param {string} text The copied text.
 * @return {boolean} True if the text looks like serialized blocks, false otherwise.
 */
function hasSerializedBlocks(text) {
	try {
		const blocks = parse(text, {
			__unstableSkipMigrationLogs: true,
			__unstableSkipAutop: true,
		});
		if (blocks.length === 1 && blocks[0].name === 'core/freeform') {
			// It's likely that the text is just plain text and not serialized blocks.
			return false;
		}
		return true;
	} catch (err) {
		// Parsing error, the text is not serialized blocks.
		// (Even though that it technically won't happen)
		return false;
	}
}

/**
 * Get the "ghostkit attributes" from a given block to a target block.
 *
 * @param {WPBlock} sourceBlock       The source block.
 * @param {WPBlock} targetBlock       The target block.
 * @param {string}  selectedExtension Copy the specific extension data.
 *
 * @return {Object} the filtered attributes object.
 */
function getGhostkitAttributes(
	sourceBlock,
	targetBlock,
	selectedExtension = ''
) {
	// Copy all extensions.
	if (!selectedExtension) {
		return {
			ghostkit: cloneDeep(sourceBlock?.attributes?.ghostkit || {}),
		};
	}

	const attributes = {};

	// Only apply the attribute if both blocks support it.
	if (
		hasBlockSupport(sourceBlock.name, ['ghostkit', selectedExtension]) &&
		hasBlockSupport(targetBlock.name, ['ghostkit', selectedExtension])
	) {
		attributes.ghostkit = cloneDeep(
			targetBlock?.attributes?.ghostkit || {}
		);

		// Extension with styles.
		if (EXTENSIONS[selectedExtension]?.styles) {
			if (!attributes?.ghostkit?.styles) {
				attributes.ghostkit.styles = {};
			}

			attributes.ghostkit.styles = merge(
				attributes.ghostkit.styles,
				getSpecificPropsFromStyles(
					sourceBlock?.attributes?.ghostkit?.styles || {},
					EXTENSIONS[selectedExtension].styles,
					EXTENSIONS[selectedExtension].responsive,
					EXTENSIONS[selectedExtension].selectors
				)
			);

			attributes.ghostkit.styles = compactObject(
				attributes.ghostkit.styles
			);
		}

		// Extension with attributes.
		if (EXTENSIONS[selectedExtension]?.attributes) {
			EXTENSIONS[selectedExtension].attributes.forEach((attrName) => {
				attributes.ghostkit[attrName] =
					sourceBlock?.attributes?.ghostkit?.[attrName] || undefined;
			});
		}
	}

	return attributes;
}

/**
 * Update the target blocks with extensions attributes recursively.
 *
 * @param {WPBlock[]} targetBlocks          The target blocks to be updated.
 * @param {WPBlock[]} sourceBlocks          The source blocks to get extensions attributes from.
 * @param {string}    selectedExtension     Copy the specific extension data.
 *
 * @param {Function}  updateBlockAttributes The function to update the attributes.
 */
function recursivelyUpdateBlockAttributes(
	targetBlocks,
	sourceBlocks,
	updateBlockAttributes,
	selectedExtension = ''
) {
	for (
		let index = 0;
		index < Math.min(sourceBlocks.length, targetBlocks.length);
		index += 1
	) {
		updateBlockAttributes(
			targetBlocks[index].clientId,
			getGhostkitAttributes(
				sourceBlocks[index],
				targetBlocks[index],
				selectedExtension
			)
		);

		recursivelyUpdateBlockAttributes(
			targetBlocks[index].innerBlocks,
			sourceBlocks[index].innerBlocks,
			updateBlockAttributes,
			selectedExtension
		);
	}
}

/**
 * A hook to return a pasteExtensions event function for handling pasting extensions to blocks.
 *
 * @return {Function} A function to update the extensions to the blocks.
 */
export default function usePasteExtensions() {
	const registry = useRegistry();
	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const { createSuccessNotice, createWarningNotice, createErrorNotice } =
		useDispatch(noticesStore);

	return useCallback(
		async (targetBlocks, selectedExtension) => {
			let html = '';
			try {
				// `http:` sites won't have the clipboard property on navigator.
				// (with the exception of localhost.)
				if (!window.navigator.clipboard) {
					createErrorNotice(
						__(
							'Unable to paste extensions. This feature is only available on secure (https) sites in supporting browsers.',
							'ghostkit'
						),
						{ type: 'snackbar' }
					);
					return;
				}

				html = await window.navigator.clipboard.readText();
			} catch (error) {
				// Possibly the permission is denied.
				createErrorNotice(
					__(
						'Unable to paste extensions. Please allow browser clipboard permissions before continuing.',
						'ghostkit'
					),
					{
						type: 'snackbar',
					}
				);
				return;
			}

			// Abort if the copied text is empty or doesn't look like serialized blocks.
			if (!html || !hasSerializedBlocks(html)) {
				createWarningNotice(
					__(
						"Unable to paste extensions. Block extensions couldn't be found within the copied content.",
						'ghostkit'
					),
					{
						type: 'snackbar',
					}
				);
				return;
			}

			const copiedBlocks = parse(html);

			if (copiedBlocks.length === 1) {
				// Apply extensions of the block to all the target blocks.
				registry.batch(() => {
					recursivelyUpdateBlockAttributes(
						targetBlocks,
						targetBlocks.map(() => copiedBlocks[0]),
						updateBlockAttributes,
						selectedExtension
					);
				});
			} else {
				registry.batch(() => {
					recursivelyUpdateBlockAttributes(
						targetBlocks,
						copiedBlocks,
						updateBlockAttributes,
						selectedExtension
					);
				});
			}

			if (targetBlocks.length === 1) {
				const title = getBlockType(targetBlocks[0].name)?.title;
				createSuccessNotice(
					sprintf(
						// Translators: Name of the block being pasted, e.g. "Paragraph".
						__('Pasted extensions to %s.'),
						title
					),
					{ type: 'snackbar' }
				);
			} else {
				createSuccessNotice(
					sprintf(
						// Translators: The number of the blocks.
						__('Pasted extensions to %d blocks.'),
						targetBlocks.length
					),
					{ type: 'snackbar' }
				);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			registry.batch,
			updateBlockAttributes,
			createSuccessNotice,
			createWarningNotice,
			createErrorNotice,
		]
	);
}
