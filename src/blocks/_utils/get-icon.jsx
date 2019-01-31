import allIcons from '../_icons/index.jsx';

export default function getIcon( icon, iconOnly ) {
    if ( icon && typeof allIcons[ icon ] !== 'undefined' ) {
        // return icon only.
        if ( iconOnly ) {
            return allIcons[ icon ]();
        }

        // return object for block registration.
        return {
            foreground: '#C9586C',
            src: allIcons[ icon ],
        };
    }

    return '';
}
