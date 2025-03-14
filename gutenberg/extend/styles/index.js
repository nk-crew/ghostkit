import deepEqual from 'deep-equal';
import { cloneDeep } from 'lodash';
import shorthash from 'shorthash';
import { throttle } from 'throttle-debounce';

import { getBlockSupport, getBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';

import EditorStyles from '../../components/editor-styles';
import { hasClass, replaceClass } from '../../utils/classes-replacer';
import { maybeDecode, maybeEncode } from '../../utils/encode-decode';
// We can't use lodash merge, because it skip the specified undefined value
// which we use to reset styles.
import merge from '../../utils/merge';
import getStyles from './get-styles';

function cleanBlockCustomStyles(styles) {
	const newStyles = {};

	Object.keys(styles).forEach((key) => {
		if (typeof styles[key] !== 'undefined') {
			if (
				typeof styles[key] === 'object' &&
				!Array.isArray(styles[key]) &&
				styles[key] !== null
			) {
				const innerStyles = cleanBlockCustomStyles(styles[key]);

				if (innerStyles && Object.keys(innerStyles).length) {
					newStyles[key] = innerStyles;
				}
			} else {
				newStyles[key] = styles[key];
			}
		}
	});

	return newStyles;
}

/**
 * Get recursive all blocks in list.
 *
 * @param {boolean} blocks - block list
 *
 * @return {Array} block list
 */
function getAllBlocks(blocks = false) {
	let result = [];

	if (!blocks) {
		return result;
	}

	blocks.forEach((data) => {
		result.push(data);

		if (data.innerBlocks && data.innerBlocks.length) {
			result = [...result, ...getAllBlocks(data.innerBlocks)];
		}
	});

	return result;
}

/**
 * Custom Styles Component.
 * @param props
 */
function CustomStylesComponent(props) {
	const { attributes, clientId, name } = props;

	const { ghostkit, className } = attributes;

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const customSelector = getBlockSupport(name, [
		'ghostkit',
		'styles',
		'customSelector',
	]);

	const { allBlocks, blockSettings } = useSelect(
		(select) => {
			const { getBlocks } = select('core/block-editor');

			return {
				allBlocks: getBlocks(),
				blockSettings: getBlockType(name),
			};
		},
		[name]
	);

	const getGhostKitID = useCallback(
		(checkDuplicates) => {
			let id = ghostkit?.id;

			// create block ID.
			if (!id || checkDuplicates) {
				const usedIds = {};

				// prevent unique ID duplication after block duplicated.
				if (checkDuplicates) {
					const blocks = getAllBlocks(allBlocks);
					blocks.forEach((data) => {
						if (data.clientId && data?.attributes?.ghostkit?.id) {
							usedIds[data.attributes.ghostkit.id] =
								data.clientId;

							if (
								data.clientId !== clientId &&
								data.attributes.ghostkit.id === id
							) {
								id = '';
							}
						}
					});
				}

				// prepare new block id.
				if (clientId && !id) {
					let newID = id || '';

					// check if id already exist.
					let tryCount = 10;
					while (
						!newID ||
						(typeof usedIds[newID] !== 'undefined' &&
							usedIds[newID] !== clientId &&
							tryCount > 0)
					) {
						newID = shorthash.unique(clientId);
						tryCount -= 1;
					}

					if (newID && typeof usedIds[newID] === 'undefined') {
						usedIds[newID] = clientId;
					}

					if (newID !== id) {
						id = newID;
					}
				}
			}

			return id || false;
		},
		[ghostkit, allBlocks, clientId]
	);

	const onUpdate = useCallback(
		(checkDuplicates) => {
			const newAttrs = {};

			// prepare custom block styles.
			const blockCustomStyles = applyFilters(
				'ghostkit.blocks.customStyles',
				blockSettings.ghostkit &&
					blockSettings.ghostkit.customStylesCallback
					? blockSettings.ghostkit.customStylesCallback(
							attributes,
							props
						)
					: {},
				props
			);

			const withBlockCustomStyles =
				blockCustomStyles && Object.keys(blockCustomStyles).length;
			const withExtensionCustomStyles =
				ghostkit?.styles && Object.keys(ghostkit.styles).length;

			let reset = !withBlockCustomStyles && !withExtensionCustomStyles;

			if (withBlockCustomStyles || withExtensionCustomStyles) {
				let newStyles = cloneDeep(ghostkit?.styles || {});

				if (withBlockCustomStyles) {
					newStyles = merge(
						newStyles,
						maybeEncode(blockCustomStyles)
					);
				}

				// Clean undefined and empty statements from custom styles list.
				if (newStyles) {
					newStyles = cleanBlockCustomStyles(newStyles);
				}

				const hasCustomStyles = Object.keys(newStyles).length;
				const ghostkitID =
					hasCustomStyles && getGhostKitID(checkDuplicates);

				if (!ghostkitID) {
					reset = true;
				} else {
					if (ghostkitID !== ghostkit?.id) {
						if (!newAttrs.ghostkit) {
							newAttrs.ghostkit = cloneDeep(ghostkit || {});
						}

						newAttrs.ghostkit.id = ghostkitID;
					}

					// Regenerate custom classname if it was removed or changed.
					// We have to check if class name contains ghostkit-custom-<id> because
					// it can be changed while your edit the custom block class.
					if (!hasClass(className, `ghostkit-custom-${ghostkitID}`)) {
						const newClassName = replaceClass(
							className,
							'ghostkit-custom',
							ghostkitID
						);
						if (newClassName !== className) {
							newAttrs.className = newClassName;
						}
					}

					// Check if styles changes and update it.
					if (!deepEqual(ghostkit?.styles, newStyles)) {
						if (!newAttrs.ghostkit) {
							newAttrs.ghostkit = cloneDeep(ghostkit || {});
						}

						newAttrs.ghostkit.styles = newStyles;
					}
				}
			}

			// Reset unused styles and ID.
			if (reset) {
				// Convert to undefined when empty to prevent unnecessary
				// rerenders if className remains unchanged.
				const newClassName =
					replaceClass(className, 'ghostkit-custom', '') || undefined;

				if (newClassName !== className) {
					newAttrs.className = !newClassName
						? undefined
						: newClassName;
				}

				if (ghostkit?.styles || ghostkit?.id) {
					if (!newAttrs.ghostkit) {
						newAttrs.ghostkit = cloneDeep(ghostkit || {});
					}

					if (newAttrs?.ghostkit?.styles) {
						delete newAttrs.ghostkit.styles;
					}

					if (newAttrs?.ghostkit?.id) {
						delete newAttrs.ghostkit.id;
					}
				}

				// Reset ghostkit attribute if empty.
				if (
					newAttrs?.ghostkit &&
					!Object.keys(newAttrs.ghostkit).length
				) {
					newAttrs.ghostkit = undefined;
				}
			}

			// Update attributes.
			if (Object.keys(newAttrs).length) {
				/**
				 * IMPORTANT!
				 * We can't use `setAttributes` here because it is not working correctly
				 * when we duplicate multiple blocks at once. `updateBlockAttributes` resolves this issue.
				 *
				 * @see https://github.com/nk-crew/lazy-blocks/issues/32#issuecomment-2681280713
				 */
				updateBlockAttributes(clientId, newAttrs);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			blockSettings,
			attributes,
			ghostkit,
			props,
			className,
			updateBlockAttributes,
			clientId,
		]
	);

	const onUpdateThrottle = throttle(60, onUpdate);

	const didMountRef = useRef(false);

	useEffect(() => {
		// Did update.
		if (didMountRef.current) {
			onUpdateThrottle();

			// Did mount.
		} else {
			didMountRef.current = true;

			onUpdate(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attributes]);

	let styles = '';

	// generate custom styles.
	if (ghostkit?.id) {
		// New custom styles.
		if (ghostkit?.styles && Object.keys(ghostkit?.styles).length) {
			let selector = `.ghostkit-custom-${ghostkit?.id}`;

			if (customSelector) {
				selector = customSelector.replace('&', selector);
			}

			styles +=
				(styles ? ' ' : '') +
				getStyles(
					maybeDecode({
						[selector]: ghostkit?.styles,
					}),
					'',
					false
				);
		}

		if (
			styles &&
			blockSettings &&
			blockSettings.ghostkit &&
			blockSettings.ghostkit.customStylesFilter
		) {
			styles = blockSettings.ghostkit.customStylesFilter(
				styles,
				maybeDecode(attributes?.ghostkit?.styles),
				true,
				attributes
			);
		}
	}

	// filter custom styles.
	styles = applyFilters('ghostkit.editor.customStylesOutput', styles, props);

	if (!styles) {
		return null;
	}

	return <EditorStyles styles={window.GHOSTKIT.replaceVars(styles)} />;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {Function | Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent(
	(BlockEdit) =>
		function (props) {
			return (
				<>
					<BlockEdit {...props} />
					<CustomStylesComponent {...props} />
				</>
			);
		},
	'withNewAttrs'
);

// Init filters.
addFilter(
	'editor.BlockEdit',
	'ghostkit/styles/additional-attributes',
	withNewAttrs
);
