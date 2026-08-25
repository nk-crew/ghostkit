import {
	__experimentalNumberControl as ExperimentalNumberControl,
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableNumberControl as StableNumberControl,
	__stableToolsPanelItem as StableToolsPanelItem,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;
const NumberControl = StableNumberControl || ExperimentalNumberControl;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

function PositionZIndexTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasZIndex = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasZIndex = hasZIndex || hasStyle('z-index', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('zIndex', 'ghostkit')}
			hasValue={() => !!hasZIndex}
			onDeselect={() => {
				resetStyles(['z-index'], true);
			}}
			isShownByDefault={false}
		>
			<NumberControl
				label={
					<>
						{__('zIndex', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('z-index', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('z-index', device)}
				onChange={(val) => {
					setStyles({ 'z-index': val }, device);
				}}
				labelPosition="edge"
				__unstableInputWidth="70px"
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.position.tools',
	'ghostkit/extension/position/tools/zIndex',
	(children, { props }) => {
		const hasZIndexSupport =
			hasBlockSupport(props.name, ['ghostkit', 'position', 'zIndex']) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasZIndexSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionZIndexTools {...props} />
			</>
		);
	}
);
