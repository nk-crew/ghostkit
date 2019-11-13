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
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        let {
            className = '',
        } = this.props;

        className = classnames( className, 'ghostkit-tab' );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <div className={ className }>
                <InnerBlocks templateLock={ false } />
            </div>
        );
    }
}

export default BlockEdit;
