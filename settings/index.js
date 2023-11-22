/**
 * Ghost Kit Settings Page
 */

/**
 * Internal dependencies
 */
import Container from './containers/container';

import { render  } from '@wordpress/element';

window.addEventListener('load', () => {
  render(
    <Container data={window.ghostkitSettingsData} />,
    document.querySelector('.ghostkit-admin-page')
  );
});
