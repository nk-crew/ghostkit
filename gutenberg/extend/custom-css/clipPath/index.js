import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	SelectControl,
	TextareaControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';
import PRESETS from './presets';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

const optionPresets = [
	{
		value: '',
		label: __('Custom', 'ghostkit'),
	},
	...Object.keys(PRESETS).map((value) => {
		return {
			value,
			label: PRESETS[value],
		};
	}),
];

function CustomCSSClipPathTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasClipPath = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasClipPath = hasClipPath || hasStyle('clip-path', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Clip Path', 'ghostkit')}
			hasValue={() => !!hasClipPath}
			onSelect={() => {
				if (!hasStyle('clip-path')) {
					setStyles({ 'clip-path': optionPresets[1].value });
				}
			}}
			onDeselect={() => {
				resetStyles(['clip-path'], true);
			}}
			isShownByDefault={false}
		>
			<SelectControl
				label={
					<>
						{__('Clip Path', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return hasStyle('clip-path', checkMedia);
							}}
						/>
					</>
				}
				value={getStyle('clip-path', device)}
				onChange={(val) => {
					setStyles({ 'clip-path': val }, device);
				}}
				options={optionPresets}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<br />
			<TextareaControl
				value={getStyle('clip-path', device)}
				onChange={(val) => {
					setStyles({ 'clip-path': val }, device);
				}}
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.customCSS.tools',
	'ghostkit/extension/customCSS/tools/clipPath',
	(children, { props }) => {
		const hasClipPathSupport =
			hasBlockSupport(props.name, [
				'ghostkit',
				'customCSS',
				'clipPath',
			]) ||
			getBlockSupport(props.name, ['ghostkit', 'customCSS']) === true;

		if (!hasClipPathSupport) {
			return children;
		}

		return (
			<>
				{children}
				<CustomCSSClipPathTools {...props} />
			</>
		);
	}
);
