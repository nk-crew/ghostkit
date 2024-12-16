import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	RangeControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

function CustomCSSOpacityTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasOpacity = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasOpacity = hasOpacity || hasStyle('opacity', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Opacity', 'ghostkit')}
			hasValue={() => !!hasOpacity}
			onSelect={() => {
				if (!hasStyle('opacity')) {
					setStyles({ opacity: 1 });
				}
			}}
			onDeselect={() => {
				resetStyles(['opacity'], true);
			}}
			isShownByDefault={false}
		>
			<RangeControl
				label={
					<>
						{__('Opacity', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('opacity', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('opacity', device)}
				placeholder={1}
				onChange={(val) =>
					setStyles(
						{ opacity: val === '' ? undefined : parseFloat(val) },
						device
					)
				}
				min={0}
				max={1}
				step={0.01}
				style={{ flex: 1 }}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.customCSS.tools',
	'ghostkit/extension/customCSS/tools/opacity',
	(children, { props }) => {
		const hasOpacitySupport =
			hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'opacity']) ||
			getBlockSupport(props.name, ['ghostkit', 'customCSS']) === true;

		if (!hasOpacitySupport) {
			return children;
		}

		return (
			<>
				{children}
				<CustomCSSOpacityTools {...props} />
			</>
		);
	}
);
