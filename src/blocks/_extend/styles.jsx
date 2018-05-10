// External Dependencies.
import shorthash from 'shorthash';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.element;

/**
 * Extend block attributes with styles.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
    if ( settings && settings.attributes && settings.name && /^ghostkit/.test( settings.name ) ) {
        if ( ! settings.attributes.ghostkitGetStylesAttr ) {
            settings.attributes.ghostkitGetStylesAttr = {
                type: 'function',
                default: ( generateStyles ) => {
                    return getCustomStylesAttr( generateStyles );
                },
            };
        }
        if ( ! settings.attributes.ghostkitClassname ) {
            settings.attributes.ghostkitClassname = {
                type: 'string',
                default: '',
            };
        }
        if ( ! settings.attributes.ghostkitId ) {
            settings.attributes.ghostkitId = {
                type: 'string',
                default: false,
            };
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        // add new ghostkit props.
        if ( /^ghostkit/.test( props.name ) && ! props.attributes.ghostkitId ) {
            props.attributes.ghostkitId = shorthash.unique( props.id );
            props.attributes.ghostkitClassname = props.name.replace( '/', '-' ) + '-' + props.attributes.ghostkitId;
        }

        return <BlockEdit { ...props } />;
    };
}, 'withNewAttrs' );

export function styles() {
    addFilter( 'blocks.registerBlockType', 'ghostkit/styles/additional-attributes', addAttribute );
    addFilter( 'blocks.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs );
}
