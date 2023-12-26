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

	const { setDevice } = useDispatch('ghostkit/responsive');

	return {
		device,
		setDevice,
		allDevices,
	};
}
