/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

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

/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
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
}

export default BlockSave;
