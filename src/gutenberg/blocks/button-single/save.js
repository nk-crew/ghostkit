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
    RichText,
} = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            tagName,
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
            result.unshift(
                <IconPicker.Render
                    name={ icon }
                    tag="span"
                    className={ `ghostkit-button-icon ghostkit-button-icon-${ 'right' === iconPosition ? 'right' : 'left' }` }
                    key="button-icon"
                />
            );
        }

        let Tag = tagName;

        if ( ! Tag ) {
            Tag = url ? 'a' : 'span';
        }

        return 'a' === Tag ? (
            <Tag className={ className } href={ url } target={ target || false } rel={ rel || false }>
                { result }
            </Tag>
        ) : (
            <Tag className={ className }>
                { result }
            </Tag>
        );
    }
}

export default BlockSave;
