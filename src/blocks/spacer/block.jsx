// External Dependencies.
import ResizableBox from 're-resizable';

// Internal Dependencies.
const { __ } = wp.i18n;
const {
    RangeControl,
} = wp.components;
const {
    registerBlockType,
    InspectorControls,
} = wp.blocks;

/**
 * Register: GhostKit Spacer Block.
 * Based on GutenKit spacer block https://wordpress.org/plugins/spacer-block-gutenberg/
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('ghostkit/spacer', {
    title: __('Spacer'),
    description: __('Add space between other blocks.'),
    icon: [
        <svg aria-hidden role="img" focusable="false" className="dashicon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <path d="M0,3 L20,3 L20,17 L0,17 L0,3 Z M2,5.03271484 L2,15.0327148 L18.001709,15.0327148 L18.001709,5.03271484 L2,5.03271484 Z" />
        </svg>,
    ],
    category: 'layout',
    keywords: [
        __('hr'),
        __('separator'),
        __('ghostkit'),
    ],
    supports: {
        html: false,
    },
    attributes: {
        height: {
            type: 'number',
            default: 50,
        },
    },

    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     *
     * The "edit" property must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    edit({
        className, attributes, setAttributes, isSelected, toggleSelection,
    }) {
        const { height } = attributes;

        className += ' ghostkit-spacer';

        const inspectorControls = isSelected && (
            <InspectorControls key="inspector">
                <RangeControl
                    label={__('Height')}
                    value={height || ''}
                    onChange={value => setAttributes({ height: value })}
                    min={30}
                    max={800}
                />
            </InspectorControls>
        );

        return [
            inspectorControls,
            <ResizableBox
                className={className}
                size={{
                    width: '100%',
                    height,
                }}
                minWidth="100%"
                maxWidth="100%"
                minHeight="100%"
                handleClasses={{
                    bottomLeft: 'ghostkit-spacer__resize-handler',
                }}
                enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false }}
                onResizeStart={() => {
                    toggleSelection(false);
                }}
                onResizeStop={(event, direction, elt, delta) => {
                    setAttributes({
                        height: parseInt(height + delta.height, 10),
                    });
                    toggleSelection(true);
                }}
            />,
        ];
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    save({ attributes, className }) {
        const { height } = attributes;

        return (
            <hr className={className} style={{ height: height ? `${height}px` : undefined }} />
        );
    },
});
