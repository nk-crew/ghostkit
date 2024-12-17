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

function PositionHeightTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasHeight = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasHeight = hasHeight || hasStyle('height', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Height', 'ghostkit')}
			hasValue={() => !!hasHeight}
			onDeselect={() => {
				resetStyles(['height'], true);
			}}
			isShownByDefault={false}
		>
			<UnitControl
				label={
					<>
						{__('Height', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('height', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('height', device)}
				onChange={(val) => {
					setStyles({ height: val }, device);
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
	'ghostkit/extension/position/tools/height',
	(children, { props }) => {
		const hasHeightSupport =
			hasBlockSupport(props.name, ['ghostkit', 'position', 'height']) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasHeightSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionHeightTools {...props} />
			</>
		);
	}
);
