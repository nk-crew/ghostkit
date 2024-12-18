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

	const { setDeviceType } = useDispatch('core/editor');
	const { setDevice } = useDispatch('ghostkit/responsive');

	const setDeviceWithReset = (...args) => {
		setDevice(...args);

		// Reset default preview device.
		setDeviceType('Desktop');
	};

	return {
		device,
		setDevice: setDeviceWithReset,
		allDevices,
	};
}
