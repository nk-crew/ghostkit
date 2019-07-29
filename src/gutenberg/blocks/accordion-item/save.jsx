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

const {
    InnerBlocks,
    RichText,
} = wp.editor;

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
            heading,
            active,
            itemNumber,
        } = this.props.attributes;

        let className = classnames(
            'ghostkit-accordion-item',
            active ? 'ghostkit-accordion-item-active' : ''
        );

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                <a href={ `#accordion-${ itemNumber }` } className="ghostkit-accordion-item-heading">
                    <RichText.Content
                        className="ghostkit-accordion-item-label"
                        tagName="span"
                        value={ heading }
                    />
                    <span className="ghostkit-accordion-item-collapse">
                        <span className="fas fa-angle-right" />
                    </span>
                </a>
                <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
            </div>
        );
    }
}

export default BlockSave;
