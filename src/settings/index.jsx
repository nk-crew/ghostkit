/**
 * Ghost Kit Settings Page
 */

/**
 * Store
 */
import '../gutenberg/store';

import './style.scss';
import Container from './containers/container.jsx';

window.addEventListener( 'load', () => {
    wp.element.render(
        <Container data={ window.ghostkitSettingsData } />,
        document.querySelector( '.ghostkit-admin-page' )
    );
} );
