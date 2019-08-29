/**
 * Styles
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { registerBlockStyle } = wp.blocks;

const { addFilter } = wp.hooks;

const { createHigherOrderComponent } = wp.compose;

registerBlockStyle( 'core/heading', {
    name: 'numbered',
    label: __( 'Numbered' ),
} );

const ghostkitHeadingNumbered = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {
        const {
            attributes,
            name,
        } = props;

        const {
            level,
            className,
        } = attributes;

        if ( 'core/heading' !== name || ! /is-style-numbered/.test( className ) ) {
            return <BlockListBlock { ...props } />;
        }

        return (
            <BlockListBlock
                { ...props }
                className={ `core-heading-level-${ level }` }
            />
        );
    };
}, 'ghostkitHeadingNumbered' );

addFilter( 'editor.BlockListBlock', 'ghostkit/heading/numbered', ghostkitHeadingNumbered );
