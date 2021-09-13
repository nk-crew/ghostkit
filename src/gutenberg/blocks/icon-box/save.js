/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

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

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            icon,
            iconPosition,
            showContent,
            url,
            target,
            rel,
        } = this.props.attributes;

        let className = classnames(
            'ghostkit-icon-box',
            url ? 'ghostkit-icon-box-with-link' : ''
        );

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { url ? (
                    <a className="ghostkit-icon-box-link" href={ url } target={ target || false } rel={ rel || false }>
                        <span />
                    </a>
                ) : '' }
                { icon ? (
                    <IconPicker.Render
                        name={ icon }
                        tag="div"
                        className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition || 'left' }` }
                    />
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
