/**
 * Internal dependencies
 */
import allIcons from '../../icons/index';

export default function getIcon( icon, returnObject ) {
    if ( icon && typeof allIcons[ icon ] !== 'undefined' ) {
        // return object for block registration.
        if ( returnObject ) {
            return {
                foreground: '#5c39a7',
                src: allIcons[ icon ],
            };
        }

        // return icon.
        return allIcons[ icon ]();
    }

    return '';
}
