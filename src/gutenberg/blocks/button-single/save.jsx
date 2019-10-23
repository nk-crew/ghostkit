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
    RichText,
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
            text,
            icon,
            iconPosition,
            hideText,
            url,
            target,
            rel,
            size,
            focusOutlineWeight,
            focusOutlineColor,
        } = this.props.attributes;

        let className = classnames(
            'ghostkit-button',
            size ? `ghostkit-button-${ size }` : '',
            hideText ? 'ghostkit-button-icon-only' : ''
        );

        // focus outline
        if ( focusOutlineWeight && focusOutlineColor ) {
            className = classnames( className, 'ghostkit-button-with-outline' );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        const result = [];

        if ( ! hideText ) {
            result.push( <RichText.Content tagName="span" className="ghostkit-button-text" value={ text } key="button-text" /> );
        }

        // add icon.
        if ( icon ) {
            if ( iconPosition === 'right' ) {
                result.push(
                    <span className="ghostkit-button-icon ghostkit-button-icon-right" key="button-icon">
                        <IconPicker.Render name={ icon } />
                    </span>
                );
            } else {
                result.unshift(
                    <span className="ghostkit-button-icon ghostkit-button-icon-left" key="button-icon">
                        <IconPicker.Render name={ icon } />
                    </span>
                );
            }
        }

        return url ? (
            <a className={ className } href={ url } target={ target || false } rel={ rel || false }>
                { result }
            </a>
        ) : (
            <span className={ className }>
                { result }
            </span>
        );
    }
}

export default BlockSave;
