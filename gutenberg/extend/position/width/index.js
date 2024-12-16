import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__experimentalUnitControl as ExperimentalUnitControl,
	__stableToolsPanelItem as StableToolsPanelItem,
	__stableUnitControl as StableUnitControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;
const UnitControl = StableUnitControl || ExperimentalUnitControl;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

function PositionWidthTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasWidth = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasWidth = hasWidth || hasStyle('width', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Width', 'ghostkit')}
			hasValue={() => !!hasWidth}
			onDeselect={() => {
				resetStyles(['width'], true);
			}}
			isShownByDefault={false}
		>
			<UnitControl
				label={
					<>
						{__('Width', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('width', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('width', device)}
				onChange={(val) => {
					setStyles({ width: val }, device);
				}}
				labelPosition="edge"
				units={[
					{ value: 'px', label: 'px' },
					{ value: '%', label: '%' },
					{ value: 'em', label: 'em' },
					{ value: 'rem', label: 'rem' },
					{ value: 'vw', label: 'vw' },
					{ value: 'vh', label: 'vh' },
				]}
				min={0}
				__unstableInputWidth="70px"
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.position.tools',
	'ghostkit/extension/position/tools/width',
	(children, { props }) => {
		const hasWidthSupport =
			hasBlockSupport(props.name, ['ghostkit', 'position', 'width']) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasWidthSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionWidthTools {...props} />
			</>
		);
	}
);
