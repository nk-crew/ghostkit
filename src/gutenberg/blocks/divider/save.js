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

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            icon,
            type,
        } = this.props.attributes;

        let className = `ghostkit-divider ghostkit-divider-type-${ type }`;

        if ( icon ) {
            className = classnames( className, 'ghostkit-divider-with-icon' );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { icon ? (
                    <IconPicker.Render
                        name={ icon }
                        tag="div"
                        className="ghostkit-divider-icon"
                    />
                ) : '' }
            </div>
        );
    }
}

export default BlockSave;
