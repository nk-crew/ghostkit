/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getBackgroundStyles from './get-background-styles';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.blockEditor;

const { name } = metadata;

export default [
    // v2.8.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const {
                    awb_image: image,
                } = attributes;

                let result = {};

                // Image styles.
                if ( image ) {
                    result = {
                        ...result,
                        ...getBackgroundStyles( attributes ),
                    };
                }

                return result;
            },
            customStylesFilter( styles, data, isEditor, attributes ) {
                // change custom styles in Editor.
                if ( isEditor && attributes.ghostkitClassname ) {
                    // background.
                    styles = styles.replace( new RegExp( `.${ attributes.ghostkitClassname } > .nk-awb .jarallax-img`, 'g' ), `.ghostkit-grid .${ attributes.ghostkitClassname } > .awb-gutenberg-preview-block .jarallax-img` );
                }
                return styles;
            },
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        save: class BlockSave extends Component {
            render() {
                const {
                    verticalAlign,
                    horizontalAlign,
                    gap,
                } = this.props.attributes;

                let className = classnames(
                    'ghostkit-grid',
                    `ghostkit-grid-gap-${ gap }`,
                    verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
                    horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
                );

                // background
                const background = applyFilters( 'ghostkit.blocks.grid.background', '', {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                if ( background ) {
                    className = classnames( className, 'ghostkit-grid-with-bg' );
                }

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                return (
                    <div className={ className }>
                        { background }
                        <InnerBlocks.Content />
                    </div>
                );
            }
        },
    },
];
