import { useDispatch, useSelect } from '@wordpress/data';
import { PluginPreviewMenuItem } from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import classnames from 'classnames/dedupe';

import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';
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
 * Add Ghost Kit breakpoints to the editor "View" menu next to the core devices.
 */
function ResponsivePreviewMenuItems() {
	const { device, setDevice, allDevices } = useResponsive();

	// Public slot since WordPress 6.7.
	if (!PluginPreviewMenuItem) {
		return null;
	}

	const items = [];
	const icons = [
		getIcon('tabs-mobile'),
		getIcon('tabs-tablet'),
		getIcon('tabs-laptop'),
		getIcon('tabs-desktop'),
	];

	Object.keys(allDevices).forEach((deviceName, i) => {
		let title = __('Desktop', 'ghostkit');

		switch (deviceName) {
			case 'sm':
				title = __('Mobile', 'ghostkit');
				break;
			case 'md':
				title = __('Mobile Landscape', 'ghostkit');
				break;
			case 'lg':
				title = __('Tablet', 'ghostkit');
				break;
			case 'xl':
				title = __('Laptop', 'ghostkit');
				break;
			// no default
		}

		items.unshift({
			name: deviceName,
			icon: icons[i],
			title,
		});
	});

	return items.map((data) => {
		const isActive = device === data.name;

		return (
			<PluginPreviewMenuItem
				key={data.name}
				className={classnames(
					'ghostkit-preview-menu-item',
					isActive && 'is-active'
				)}
				icon={data.icon}
				role="menuitemcheckbox"
				isSelected={isActive}
				info={sprintf(
					// translators: %s: breakpoint width in pixels, for example "768px".
					__('Devices with screen width <= %s', 'ghostkit'),
					`${allDevices[data.name]}px`
				)}
				onClick={() => setDevice(isActive ? '' : data.name)}
			>
				{data.title}
			</PluginPreviewMenuItem>
		);
	});
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

	return (
		<>
			<IframeResponsiveStyles />
			<ResponsivePreviewMenuItems />
		</>
	);
}
