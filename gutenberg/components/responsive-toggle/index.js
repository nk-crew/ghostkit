import classnames from 'classnames/dedupe';

import { Button, Tooltip } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';
import ActiveIndicator from '../active-indicator';

/**
 * Component Class
 *
 * @param props
 */
export default function ResponsiveToggle(props) {
	const {
		checkActive = () => {
			return false;
		},
	} = props;

	const [isOpen, setIsOpen] = useState(false);

	const { allDevices, device, setDevice } = useResponsive();

	useEffect(() => {
		function handleClickOutside(event) {
			if (!event.target.closest('.ghostkit-control-responsive-toggle')) {
				setIsOpen(false);
			}
		}

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const items = [];
	const icons = [
		getIcon('tabs-mobile'),
		getIcon('tabs-tablet'),
		getIcon('tabs-laptop'),
		getIcon('tabs-desktop'),
		getIcon('tabs-tv'),
	];

	let selectedIcon = icons[icons.length - 1];
	let translateY = '0';
	let withActiveResponsive = false;

	[...Object.keys(allDevices), ''].forEach((name, i) => {
		if (name === device) {
			selectedIcon = icons[i];
			translateY = `${(100 * (1 + i - icons.length)) / icons.length}%`;

			// Additional transform for gap.
			translateY = `calc(${translateY} + ${icons.length - i - 1}px)`;
		}

		const isActive = name && checkActive && checkActive(name);

		withActiveResponsive = withActiveResponsive || isActive;

		items.unshift({
			name,
			title: (
				<Tooltip
					text={
						!name
							? __('All devices', 'ghostkit')
							: sprintf(
									__(
										'Devices with screen width <= %s',
										'ghostkit'
									),
									`${allDevices[name]}px`
								)
					}
				>
					<span className="ghostkit-control-responsive-toggle-icon">
						{icons[i]}
						{isActive && <ActiveIndicator />}
					</span>
				</Tooltip>
			),
		});
	});

	return (
		<div className="ghostkit-control-responsive-toggle">
			<Button
				className="ghostkit-control-responsive-toggle-button"
				onClick={() => {
					setIsOpen(true);
				}}
			>
				{selectedIcon}
				{withActiveResponsive && <ActiveIndicator />}
			</Button>
			<div
				className={classnames(
					'ghostkit-control-responsive-toggle-dropdown',
					isOpen && 'is-open'
				)}
				style={{
					transform: `translateY(${translateY})`,
				}}
			>
				{items.map((data) => {
					return (
						<Button
							key={data.name}
							className={classnames(
								data.name === device && 'is-active'
							)}
							onClick={() => {
								setDevice(data.name);
								setIsOpen(false);
							}}
						>
							{data.title}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
