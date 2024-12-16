import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	SelectControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

function CustomCSSCursorTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasCursor = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasCursor = hasCursor || hasStyle('cursor', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Cursor', 'ghostkit')}
			hasValue={() => !!hasCursor}
			onSelect={() => {
				if (!hasStyle('cursor')) {
					setStyles({ cursor: 'default' });
				}
			}}
			onDeselect={() => {
				resetStyles(['cursor'], true);
			}}
			isShownByDefault={false}
		>
			<SelectControl
				label={
					<>
						{__('Cursor', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('cursor', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('cursor', device)}
				onChange={(val) => {
					setStyles({ cursor: val }, device);
				}}
				options={[
					{
						value: 'default',
						label: __('Default', 'ghostkit'),
					},
					{
						value: 'pointer',
						label: __('Pointer', 'ghostkit'),
					},
					{
						value: 'not-allowed',
						label: __('Not Allowed', 'ghostkit'),
					},
					{
						value: 'progress',
						label: __('Progress', 'ghostkit'),
					},
					{
						value: 'move',
						label: __('Move', 'ghostkit'),
					},
					{
						value: 'grab',
						label: __('Grab', 'ghostkit'),
					},
					{
						value: 'grabbing',
						label: __('Grabbing', 'ghostkit'),
					},
					{
						value: 'zoom-in',
						label: __('Zoom In', 'ghostkit'),
					},
					{
						value: 'zoom-out',
						label: __('Zoom Out', 'ghostkit'),
					},
					{
						value: 'copy',
						label: __('Copy', 'ghostkit'),
					},
					{
						value: 'no-drop',
						label: __('No Drop', 'ghostkit'),
					},
					{
						value: 'context-menu',
						label: __('Context Menu', 'ghostkit'),
					},
					{
						value: 'help',
						label: __('Help', 'ghostkit'),
					},
					{
						value: 'wait',
						label: __('Wait', 'ghostkit'),
					},
					{
						value: 'cell',
						label: __('Cell', 'ghostkit'),
					},
					{
						value: 'crosshair',
						label: __('Crosshair', 'ghostkit'),
					},
					{
						value: 'alias',
						label: __('Alias', 'ghostkit'),
					},
					{
						value: 'text',
						label: __('Text', 'ghostkit'),
					},
					{
						value: 'vertical-text',
						label: __('Vertical Text', 'ghostkit'),
					},
					{
						value: 'copy',
						label: __('Copy', 'ghostkit'),
					},
					{
						value: 'nw-resize',
						label: __('NW Resize', 'ghostkit'),
					},
					{
						value: 'n-resize',
						label: __('N Resize', 'ghostkit'),
					},
					{
						value: 'e-resize',
						label: __('E Resize', 'ghostkit'),
					},
					{
						value: 'se-resize',
						label: __('SE Resize', 'ghostkit'),
					},
					{
						value: 's-resize',
						label: __('S Resize', 'ghostkit'),
					},
					{
						value: 'sw-resize',
						label: __('SW Resize', 'ghostkit'),
					},
					{
						value: 'w-resize',
						label: __('W Resize', 'ghostkit'),
					},
					{
						value: 'ew-resize',
						label: __('EW Resize', 'ghostkit'),
					},
					{
						value: 'ns-resize',
						label: __('NS Resize', 'ghostkit'),
					},
					{
						value: 'nwse-resize',
						label: __('NWSE Resize', 'ghostkit'),
					},
					{
						value: 'nesw-resize',
						label: __('NESW Resize', 'ghostkit'),
					},
					{
						value: 'col-resize',
						label: __('Col Resize', 'ghostkit'),
					},
					{
						value: 'row-resize',
						label: __('Row Resize', 'ghostkit'),
					},
					{
						value: 'none',
						label: __('None', 'ghostkit'),
					},
				]}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.customCSS.tools',
	'ghostkit/extension/customCSS/tools/cursor',
	(children, { props }) => {
		const hasCursorSupport =
			hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'cursor']) ||
			getBlockSupport(props.name, ['ghostkit', 'customCSS']) === true;

		if (!hasCursorSupport) {
			return children;
		}

		return (
			<>
				{children}
				<CustomCSSCursorTools {...props} />
			</>
		);
	}
);
