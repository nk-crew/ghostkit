/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import metadata from './block.json';

const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            url,
            file,
            caption,
            showFooter,
            showLineNumbers,
        } = this.props.attributes;

        let className = 'ghostkit-gist';

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className } data-url={ url } data-file={ file } data-caption={ caption } data-show-footer={ showFooter ? 'true' : 'false' } data-show-line-numbers={ showLineNumbers ? 'true' : 'false' } />
        );
    }
}

export default BlockSave;
