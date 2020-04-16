/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getColClass from './get-col-class';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
} = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        let className = getColClass( this.props );

        // background
        const background = applyFilters( 'ghostkit.blocks.grid-column.background', '', {
            ...{
                name,
            },
            ...this.props,
        } );

        if ( background ) {
            className = classnames( className, 'ghostkit-col-with-bg' );
        }

        return (
            <div className={ className }>
                { background }
                <div className="ghostkit-col-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    }
}

export default BlockSave;
