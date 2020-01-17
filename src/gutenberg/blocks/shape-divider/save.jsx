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
            svg,
            flipVertical,
            flipHorizontal,
        } = this.props.attributes;

        let className = classnames( 'ghostkit-shape-divider', {
            'ghostkit-shape-divider-flip-vertical': flipVertical,
            'ghostkit-shape-divider-flip-horizontal': flipHorizontal,
        }, className );

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className } dangerouslySetInnerHTML={ { __html: svg } } />
        );
    }
}

export default BlockSave;
