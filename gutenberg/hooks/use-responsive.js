import { useDispatch, useSelect } from '@wordpress/data';

const { ghostkitVariables } = window;

const allDevices = { ...ghostkitVariables.media_sizes };

export default function useResponsive() {
	const { device } = useSelect((select) => {
		const { getDevice } = select('ghostkit/responsive');

		return {
			device: getDevice(),
		};
	});

	// Check if 'core/editor' store is available. It is not available in the Widgets editor.
	const { setDeviceType } = useDispatch('core/editor') || {};
	const { setDevice } = useDispatch('ghostkit/responsive');

	const setDeviceWithReset = (...args) => {
		setDevice(...args);

		// Reset default preview device.
		if (setDeviceType) {
			setDeviceType('Desktop');
		}
	};

	return {
		device,
		setDevice: setDeviceWithReset,
		allDevices,
	};
}
