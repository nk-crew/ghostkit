import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import InputGroup from '../../../components/input-group';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

const hoverSelector = '&:hover';

const allOptions = [
	{
		name: 'border-top-left-radius',
		label: __('TL', 'ghostkit'),
	},
	{
		name: 'border-top-right-radius',
		label: __('TR', 'ghostkit'),
	},
	{
		name: 'border-bottom-right-radius',
		label: __('BR', 'ghostkit'),
	},
	{
		name: 'border-bottom-left-radius',
		label: __('BL', 'ghostkit'),
	},
];

function FrameBorderRadiusTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);
	const { allDevices } = useResponsive();

	let hasBorderRadius = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allOptions.forEach((thisProp) => {
			hasBorderRadius =
				hasBorderRadius ||
				hasStyle(thisProp.name, thisDevice) ||
				hasStyle(thisProp.name, thisDevice, hoverSelector);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Border Radius', 'ghostkit')}
			hasValue={() => !!hasBorderRadius}
			onDeselect={() => {
				resetStyles(
					allOptions.map((item) => {
						return item.name;
					}),
					true,
					['', '&:hover']
				);
			}}
			isShownByDefault={false}
		>
			<InputGroup
				label={__('Border Radius', 'ghostkit')}
				inputs={allOptions}
				hasValue={(name, media, isHover) =>
					hasStyle(name, media, isHover && hoverSelector)
				}
				getValue={(name, media, isHover) =>
					getStyle(name, media, isHover && hoverSelector)
				}
				onChange={(name, value, media, isHover) =>
					setStyles(
						{ [name]: value },
						media,
						isHover && hoverSelector
					)
				}
				expandOnFocus={6}
				withResponsive
				withState
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.frame.tools',
	'ghostkit/extension/frame/tools/borderRadius',
	(children, { props }) => {
		const hasBorderRadiusSupport =
			hasBlockSupport(props.name, [
				'ghostkit',
				'frame',
				'borderRadius',
			]) || getBlockSupport(props.name, ['ghostkit', 'frame']) === true;

		if (!hasBorderRadiusSupport) {
			return children;
		}

		return (
			<>
				{children}
				<FrameBorderRadiusTools {...props} />
			</>
		);
	}
);
