import allIcons from '../../icons/index';

export default function getIcon(icon, returnObject) {
	if (icon && typeof allIcons[icon] !== 'undefined') {
		// return object for block registration.
		if (returnObject) {
			return {
				foreground: '#7d7cbf',
				src: allIcons[icon],
			};
		}

		// return icon.
		return allIcons[icon]();
	}

	return '';
}
