/**
 * External dependencies
 */
const { compact, map } = window.lodash;

/**
 * WordPress dependencies
 */
const { useEffect } = wp.element;

const { transformStyles } = wp.blockEditor;

/**
 * Function from https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/editor-styles/index.js
 *
 * @returns {Null} nothing.
 */
export default function EditorStyles( { styles } ) {
    useEffect( () => {
        const updatedStyles = transformStyles(
            styles,
            '.editor-styles-wrapper'
        );

        const nodes = map( compact( updatedStyles ), ( updatedCSS ) => {
            const node = document.createElement( 'style' );
            node.innerHTML = updatedCSS;
            document.body.appendChild( node );

            return node;
        } );

        return () => nodes.forEach( ( node ) => document.body.removeChild( node ) );
    }, [ styles ] );

    return null;
}
