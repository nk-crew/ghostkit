import { render } from '@wordpress/element';

import Container from './containers/container';

window.addEventListener('load', () => {
	render(
		<Container data={window.ghostkitSettingsData} />,
		document.querySelector('.ghostkit-admin-page')
	);
});
