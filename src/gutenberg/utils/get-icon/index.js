/**
 * Internal dependencies
 */
import allIcons from '../../icons/index';

export default function getIcon( icon, returnObject ) {
    if ( icon && 'undefined' !== typeof allIcons[ icon ] ) {
        // return object for block registration.
        if ( returnObject ) {
            return {
                foreground: '#2F1747',
                src: allIcons[ icon ],
            };
        }

        // return icon.
        return allIcons[ icon ]();
    }

    return '';
}
