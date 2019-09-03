/**
 * WordPress dependencies
 */
const TokenList = wp.tokenList;

/**
 * Returns the active style from the given className.
 *
 * @param {string} className  Class name
 * @param {string} namespace  The replacing class namespace.
 * @param {bool} suffixOnly  Return suffix of the class only.
 *
 * @return {string} The active style.
 */
export function getActiveClass( className, namespace, suffixOnly ) {
    const list = new TokenList( className );

    for ( const activeClass of list.values() ) {
        if ( activeClass.indexOf( `${ namespace }-` ) === -1 ) {
            continue;
        }

        if ( suffixOnly ) {
            return activeClass.replace( `${ namespace }-`, '' );
        }

        return activeClass;
    }

    return false;
}

/**
 * Replaces the active class with namespace in the className.
 *
 * @param {string} className  Class name.
 * @param {string} namespace  The replacing class namespace.
 * @param {string} newClass   The replacing class.
 *
 * @return {string} The updated className.
 */
export function replaceClass( className, namespace, newClass ) {
    const list = new TokenList( className );
    const namespaceRegExp = new RegExp( `${ namespace }-` );

    // remove classes with the same namespace.
    for ( const activeClass of list.values() ) {
        if ( namespaceRegExp.test( activeClass ) ) {
            list.remove( activeClass );
        }
    }

    // add new class.
    if ( newClass ) {
        list.add( `${ namespace }-${ newClass }` );
    }

    return list.value;
}
