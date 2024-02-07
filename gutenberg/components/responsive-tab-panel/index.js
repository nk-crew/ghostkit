import classnames from 'classnames/dedupe';

import { Button, Tooltip } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';
import ActiveIndicator from '../active-indicator';

/**
 * Component Class
 *
 * @param props
 */
export default function ResponsiveTabPanel(props) {
	const { children } = props;

	// Fallback for deprecated filledTabs prop.
	const active = props?.active || props?.filledTabs || {};

	const { allDevices, device, setDevice } = useResponsive();

	const tabs = [];
	const icons = [
		getIcon('tabs-mobile'),
		getIcon('tabs-tablet'),
		getIcon('tabs-laptop'),
		getIcon('tabs-desktop'),
		getIcon('tabs-tv'),
	];

	[...Object.keys(allDevices), ''].forEach((name, i) => {
		tabs.unshift({
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
					<span className="ghostkit-control-tabs-icon">
						{icons[i]}
						{active && active[name] ? <ActiveIndicator /> : ''}
					</span>
				</Tooltip>
			),
		});
	});

	return (
		<div className="ghostkit-control-tabs ghostkit-control-tabs-wide">
			<div className="components-tab-panel__tabs">
				{tabs.map((data) => {
					return (
						<Button
							key={data.name}
							className={classnames(
								'ghostkit-control-tabs-tab',
								data.name === device && 'is-active'
							)}
							onClick={() => {
								setDevice(data.name);
							}}
						>
							{data.title}
						</Button>
					);
				})}
			</div>
			{children({ name: device })}
		</div>
	);
}
