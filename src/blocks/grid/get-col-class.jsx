// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    applyFilters,
} = wp.hooks;

/**
 * Returns the ready to use className for grid column.
 *
 * @param {object} props - block properties.
 * @param {boolean} addGhostkitIdClass - add class with unique ID.
 *
 * @return {String} Classname for Grid container.
 */
export default function colClass( props, addGhostkitIdClass = false ) {
    const {
        attributes,
    } = props;
    let result = 'ghostkit-col';

    Object.keys( attributes ).map( ( key ) => {
        if ( attributes[ key ] ) {
            let prefix = key.split( '_' )[ 0 ];
            let type = key.split( '_' )[ 1 ];

            if ( ! type ) {
                type = prefix;
                prefix = '';
            }

            if ( type && ( type === 'size' || type === 'order' ) ) {
                prefix = prefix ? `-${ prefix }` : '';
                type = type === 'size' ? '' : `-${ type }`;

                result = classnames(
                    result,
                    `ghostkit-col${ type }${ prefix || '' }${ attributes[ key ] !== 'auto' ? `-${ attributes[ key ] }` : '' }`
                );
            }
        }
    } );

    // variant classname.
    if ( 'default' !== attributes.variant ) {
        result = classnames( result, `ghostkit-col-attributes.-${ attributes.variant }` );
    }

    // add custom classname.
    if ( addGhostkitIdClass && attributes.ghostkitClassname ) {
        result = classnames( result, attributes.ghostkitClassname );
    }

    result = applyFilters( 'ghostkit.editor.className', result, props );

    return result;
}
