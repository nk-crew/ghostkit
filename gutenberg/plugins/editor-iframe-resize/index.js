import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import useResponsive from '../../hooks/use-responsive';
import { getPreviewWidth } from '../../utils/get-media-sizes';

export const name = 'gkt-editor-iframe-resize';

/**
 * Resize editor iframe based on responsive size selected.
 */
function IframeResponsiveStyles() {
	const { device } = useResponsive();

	if (!device) {
		return null;
	}

	const width = getPreviewWidth(device);

	if (!width) {
		return null;
	}

	let height = '100%';
	let marginVertical = '0px';

	if (device === 'sm') {
		height = `${(width * 16) / 7.5}px`;
		marginVertical = '40px';
	} else if (device === 'md' || device === 'lg') {
		height = `${(width * 3) / 4}px`;
		marginVertical = '40px';
	}

	return (
		<style
			dangerouslySetInnerHTML={{
				__html: `
				.block-editor-iframe__container iframe {
					width: ${width}px !important;
					height: ${height} !important;
					margin: ${marginVertical} auto;
					overflow-y: auto;
				}
				`,
			}}
		/>
	);
}

/**
 * A core device change (Tablet, Mobile, or a resized canvas) takes over the
 * preview, so turn the Ghost Kit breakpoint off. Picking a Ghost Kit
 * breakpoint switches core back to Desktop, see useResponsive().
 */
function useResetOnCoreDeviceChange() {
	const coreDeviceType = useSelect(
		(select) => select('core/editor')?.getDeviceType?.(),
		[]
	);
	const { setDevice } = useDispatch('ghostkit/responsive');

	useEffect(() => {
		if (coreDeviceType && coreDeviceType !== 'Desktop') {
			setDevice('');
		}
	}, [coreDeviceType, setDevice]);
}

export function Plugin() {
	useResetOnCoreDeviceChange();

	return <IframeResponsiveStyles />;
}
