/**
 * Ghost Kit Settings Page
 */

/**
 * Import CSS
 */
import './style.scss';

/**
 * Internal dependencies
 */
import '../gutenberg/store';
import Container from './containers/container';

window.addEventListener( 'load', () => {
    wp.element.render(
        <Container data={ window.ghostkitSettingsData } />,
        document.querySelector( '.ghostkit-admin-page' )
    );
} );
