import { Button, Tooltip } from '@wordpress/components';
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import classnames from 'classnames/dedupe';

import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';
import ActiveIndicator from '../active-indicator';

/**
 * Get the top edge of the nearest ancestor that clips its overflow.
 *
 * @param {Element} element - element to start from.
 *
 * @return {number}
 */
function getClippingTop(element) {
	let parent = element.parentElement;

	while (parent && parent !== document.body) {
		if (window.getComputedStyle(parent).overflowY !== 'visible') {
			return Math.max(0, parent.getBoundingClientRect().top);
		}

		parent = parent.parentElement;
	}

	return 0;
}

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
	const [shiftDown, setShiftDown] = useState(0);
	const toggleRef = useRef();
	const dropdownRef = useRef();

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

	// The list is pulled up to put the active item over the toggle. Push it
	// back down when that would hide items behind a clipping parent, such as a popover.
	useLayoutEffect(() => {
		if (!isOpen) {
			setShiftDown(0);
			return;
		}

		const hiddenHeight =
			getClippingTop(dropdownRef.current) -
			dropdownRef.current.getBoundingClientRect().top;

		if (hiddenHeight > 0) {
			setShiftDown(hiddenHeight);
		}
	}, [isOpen]);

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
									// translators: %s: breakpoint width in pixels, for example "768px".
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
				ref={toggleRef}
				className="ghostkit-control-responsive-toggle-button"
				onClick={() => {
					setIsOpen(true);
				}}
			>
				{selectedIcon}
				{withActiveResponsive && <ActiveIndicator />}
			</Button>
			<div
				ref={dropdownRef}
				className={classnames(
					'ghostkit-control-responsive-toggle-dropdown',
					isOpen && 'is-open'
				)}
				style={{
					transform: `translateY(${translateY})`,
					marginTop: shiftDown || undefined,
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

								// Hiding the focused item would drop focus to the body,
								// and a parent popover closes on focus loss.
								toggleRef.current.focus();
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
