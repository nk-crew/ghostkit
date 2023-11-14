/**
 * Ghost Kit Settings Page
 */

/**
 * Internal dependencies
 */
import Container from './containers/container';

window.addEventListener('load', () => {
  wp.element.render(
    <Container data={window.ghostkitSettingsData} />,
    document.querySelector('.ghostkit-admin-page')
  );
});
