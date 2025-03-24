import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';

import { getSlug } from '../../utils/get-unique-slug';

const anchors = {};

/**
 * Returns the text without markup.
 *
 * @param {string} text The text.
 *
 * @return {string} The text without markup.
 */
const getTextWithoutMarkup = (text) => {
	const dummyElement = document.createElement('div');
	dummyElement.innerHTML = text;
	return dummyElement.innerText;
};

/**
 * Set the anchor for a heading.
 *
 * @param {string}      clientId The block ID.
 * @param {string|null} anchor   The block anchor.
 */
const setAnchor = (clientId, anchor) => {
	anchors[clientId] = anchor;
};

/**
 * Generate the anchor for a heading.
 *
 * @param {string} clientId The block ID.
 * @param {string} content  The block content.
 *
 * @return {string|null} Return the heading anchor.
 */
const generateAnchor = (clientId, content) => {
	const slug = getSlug(getTextWithoutMarkup(content));

	// If slug is empty, then return null.
	// Returning null instead of an empty string allows us to check again when the content changes.
	if ('' === slug) {
		return null;
	}

	delete anchors[clientId];

	let anchor = slug;
	let i = 0;

	// If the anchor already exists in another heading, append -i.
	while (Object.values(anchors).includes(anchor)) {
		i += 1;
		anchor = slug + '-' + i;
	}

	return anchor;
};

function CustomBlockIdComponent({ attributes, setAttributes, clientId }) {
	const { anchor, content } = attributes;

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch('core/block-editor');

	const { canGenerateAnchors } = useSelect((select) => {
		const { getGlobalBlockCount, getSettings } =
			select('core/block-editor');
		const settings = getSettings();

		// Gutenberg already has anchors generation and we don't need to generate
		// anchors when Gutenberg can do it.
		// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/heading/edit.js
		const gutenbergCanGenerateAnchors =
			!!settings.generateAnchors ||
			getGlobalBlockCount('core/table-of-contents') > 0;

		return {
			canGenerateAnchors:
				!gutenbergCanGenerateAnchors &&
				getGlobalBlockCount('ghostkit/table-of-contents') > 0,
		};
	}, []);

	useEffect(() => {
		if (!canGenerateAnchors) {
			return;
		}

		// Initially set anchor for headings that have content but no anchor set.
		// This is used when transforming a block to heading, or for legacy anchors.
		if (!anchor && content) {
			// This side-effect should not create an undo level.
			if (__unstableMarkNextChangeAsNotPersistent) {
				__unstableMarkNextChangeAsNotPersistent();
			}

			setAttributes({
				anchor: generateAnchor(clientId, content),
			});

			// Remove anchor when content is empty.
		} else if (anchor && !content) {
			setAnchor(clientId, null);
			setAttributes({ anchor: null });

			// Update anchor when content changes.
		} else if (content && generateAnchor(clientId, content) !== anchor) {
			setAttributes({ anchor: generateAnchor(clientId, content) });
		}

		setAnchor(clientId, anchor);

		// Remove anchor map when block unmounts.
		return () => setAnchor(clientId, null);
	}, [
		anchor,
		content,
		clientId,
		canGenerateAnchors,
		__unstableMarkNextChangeAsNotPersistent,
		setAttributes,
	]);

	return null;
}

/**
 * Include component with hook to generate ID for each heading block.
 *
 * @param {Function | Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent(
	(BlockEdit) =>
		function (props) {
			if (props.name !== 'core/heading') {
				return <BlockEdit {...props} />;
			}

			return (
				<>
					<BlockEdit {...props} />
					<CustomBlockIdComponent {...props} />
				</>
			);
		},
	'withNewAttrs'
);

// Init filters.
addFilter('editor.BlockEdit', 'ghostkit/heading/anchors', withNewAttrs);
