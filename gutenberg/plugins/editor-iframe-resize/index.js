import { throttle } from 'lodash';

import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { subscribe, useSelect } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { PostPreviewButton } from '@wordpress/editor';
import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';

export const name = 'gkt-editor-iframe-resize';

/**
 * Resize editor iframe based on responsive size selected.
 */
function IframeResponsiveStyles() {
	const { device, allDevices } = useResponsive();

	if (!device) {
		return null;
	}

	let width = allDevices[device];
	let height = '100%';
	let marginVertical = '0px';

	if (device === 'sm') {
		// Set smaller width for mobile screen.
		if (width > 375) {
			width = 375;
		}

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

function ResponsiveToggleDropdown() {
	const { device, setDevice, allDevices } = useResponsive();

	const { hasActiveMetaboxes, isViewable } = useSelect((select) => {
		const { getEditedPostAttribute } = select('core/editor');
		const { getPostType } = select('core');
		const postType = getPostType(getEditedPostAttribute('type'));

		return {
			hasActiveMetaboxes: select('core/edit-post').hasMetaBoxes(),
			isViewable: postType?.viewable ?? false,
		};
	}, []);

	const items = [];
	const icons = [
		getIcon('tabs-mobile'),
		getIcon('tabs-tablet'),
		getIcon('tabs-laptop'),
		getIcon('tabs-desktop'),
		getIcon('tabs-tv'),
	];

	let selectedIcon = icons[icons.length - 1];

	[...Object.keys(allDevices), ''].forEach((deviceName, i) => {
		if (deviceName === device) {
			selectedIcon = icons[i];
		}

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

	return (
		<>
			<DropdownMenu
				className="ghostkit-toolbar-responsive__dropdown"
				popoverProps={{
					className: 'ghostkit-toolbar-responsive__dropdown-content',
					placement: 'bottom-end',
				}}
				toggleProps={{
					className: 'ghostkit-toolbar-responsive__button-toggle',
				}}
				menuProps={{
					'aria-label': __('View options', 'ghostkit'),
				}}
				icon={selectedIcon}
				label={__('Responsive Preview', 'ghostkit')}
			>
				{({ onClose }) => (
					<>
						<MenuGroup>
							{items.map((data) => {
								return (
									<MenuItem
										key={data.name}
										className={
											device === data.name && 'is-active'
										}
										onClick={() => setDevice(data.name)}
										icon={data.icon}
									>
										{data.title}
									</MenuItem>
								);
							})}
						</MenuGroup>
						{isViewable && (
							<MenuGroup>
								<div className="edit-post-header-preview__grouping-external">
									<PostPreviewButton
										className="edit-post-header-preview__button-external"
										role="menuitem"
										forceIsAutosaveable={hasActiveMetaboxes}
										textContent={
											<>
												{__('Preview in new tab')}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													aria-hidden="true"
													focusable="false"
												>
													<path d="M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z" />
												</svg>
											</>
										}
										onPreview={onClose}
									/>
								</div>
							</MenuGroup>
						)}
					</>
				)}
			</DropdownMenu>
			<style
				dangerouslySetInnerHTML={{
					__html: `
					.interface-interface-skeleton__header {
						z-index: 91;
					}
					`,
				}}
			/>
		</>
	);
}

export function Plugin() {
	return <IframeResponsiveStyles />;
}

/**
 * Add dropdown toggle to toolbar.
 */
const TOOLBAR_TOGGLE_CONTAINER_CLASS = 'ghostkit-toolbar-responsive';

const mountEditorToolbarToggle = () => {
	const createToggle = (postHeader) => {
		const toggleContainer = document.createElement('div');
		toggleContainer.classList.add(TOOLBAR_TOGGLE_CONTAINER_CLASS);

		postHeader.prepend(toggleContainer);

		const root = createRoot(toggleContainer);
		root.render(<ResponsiveToggleDropdown />);
	};

	// Always check if toggle is inserted, because post header sometimes gets unmounted.
	subscribe(
		throttle(
			() => {
				// Check if toggle exists already.
				if (
					document.querySelector(`.${TOOLBAR_TOGGLE_CONTAINER_CLASS}`)
				) {
					return;
				}

				const postHeader = document.querySelector(
					'.editor-header__settings, .edit-post-header__settings'
				);

				if (postHeader) {
					createToggle(postHeader);
				}
			},
			200,
			{ trailing: true }
		)
	);
};

domReady(mountEditorToolbarToggle);
