/**
 * Ghost Kit Settings Page
 */

import ReactDOM from 'react-dom';

import './style.scss';
import Container from './containers/container.jsx';

window.addEventListener( 'load', () => {
    ReactDOM.render( <Container data={ window.ghostkitSettingsData } />, document.querySelector( '.ghostkit-admin-page' ) );
} );
