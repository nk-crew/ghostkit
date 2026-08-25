import { createRoot } from '@wordpress/element';

import Container from './containers/container';

window.addEventListener('load', () => {
	const root = createRoot(document.querySelector('.ghostkit-admin-page'));
	root.render(<Container data={window.ghostkitSettingsData} />);
});
