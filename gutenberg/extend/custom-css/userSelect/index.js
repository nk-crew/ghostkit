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

function CustomCSSUserSelectTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasUserSelect = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasUserSelect = hasUserSelect || hasStyle('user-select', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('User Select', 'ghostkit')}
			hasValue={() => !!hasUserSelect}
			onSelect={() => {
				if (!hasStyle('user-select')) {
					setStyles({ 'user-select': 'none' });
				}
			}}
			onDeselect={() => {
				resetStyles(['user-select'], true);
			}}
			isShownByDefault={false}
		>
			<SelectControl
				label={
					<>
						{__('User Select', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('user-select', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('user-select', device)}
				onChange={(val) => {
					setStyles({ 'user-select': val }, device);
				}}
				options={[
					{
						value: 'none',
						label: __('None', 'ghostkit'),
					},
					{
						value: 'auto',
						label: __('Auto', 'ghostkit'),
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
	'ghostkit/extension/customCSS/tools/userSelect',
	(children, { props }) => {
		const hasUserSelectSupport =
			hasBlockSupport(props.name, [
				'ghostkit',
				'customCSS',
				'userSelect',
			]) ||
			getBlockSupport(props.name, ['ghostkit', 'customCSS']) === true;

		if (!hasUserSelectSupport) {
			return children;
		}

		return (
			<>
				{children}
				<CustomCSSUserSelectTools {...props} />
			</>
		);
	}
);
