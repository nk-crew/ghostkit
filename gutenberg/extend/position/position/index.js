import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	SelectControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Notice from '../../../components/notice';
import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

function PositionPositionTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasPosition = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasPosition = hasPosition || hasStyle('position', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Position', 'ghostkit')}
			hasValue={() => !!hasPosition}
			onSelect={() => {
				if (!hasStyle('position')) {
					setStyles({ position: 'default' });
				}
			}}
			onDeselect={() => {
				resetStyles(['position'], true);
			}}
			isShownByDefault={false}
		>
			{['absolute', 'fixed'].includes(getStyle('position', device)) ? (
				<>
					<Notice status="info" isDismissible={false}>
						{__(
							'Please note! Custom positioning is not considered best practice for responsive web design and should not be used too frequently.',
							'ghostkit'
						)}
					</Notice>
					<br />
				</>
			) : null}
			<SelectControl
				label={
					<>
						{__('Position', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('position', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('position', device)}
				onChange={(val) => {
					setStyles({ position: val || undefined }, device);
				}}
				options={[
					{
						value: '',
						label: __('Default', 'ghostkit'),
					},
					{
						value: 'absolute',
						label: __('Absolute', 'ghostkit'),
					},
					{
						value: 'fixed',
						label: __('Fixed', 'ghostkit'),
					},
					{
						value: 'relative',
						label: __('Relative', 'ghostkit'),
					},
					{
						value: 'sticky',
						label: __('Sticky', 'ghostkit'),
					},
				]}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.position.tools',
	'ghostkit/extension/position/tools/position',
	(children, { props }) => {
		const hasPositionSupport =
			hasBlockSupport(props.name, ['ghostkit', 'position', 'position']) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasPositionSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionPositionTools {...props} />
			</>
		);
	}
);
