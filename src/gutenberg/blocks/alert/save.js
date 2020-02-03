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
import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            icon,
            hideButton,
        } = this.props.attributes;

        let className = 'ghostkit-alert';

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { icon ? (
                    <div className="ghostkit-alert-icon">
                        <IconPicker.Render name={ icon } />
                    </div>
                ) : '' }
                <div className="ghostkit-alert-content">
                    <InnerBlocks.Content />
                </div>
                { hideButton ? (
                    <div className="ghostkit-alert-hide-button">
                        <span className="fas fa-times" />
                    </div>
                ) : '' }
            </div>
        );
    }
}

export default BlockSave;
