/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.editor;

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
            iconPosition,
            showContent,
        } = this.props.attributes;

        let className = 'ghostkit-icon-box';

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { icon ? (
                    <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }>
                        <IconPicker.Render name={ icon } />
                    </div>
                ) : '' }
                { showContent ? (
                    <div className="ghostkit-icon-box-content">
                        <InnerBlocks.Content />
                    </div>
                ) : '' }
            </div>
        );
    }
}

export default BlockSave;
