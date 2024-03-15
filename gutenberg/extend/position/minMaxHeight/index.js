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

const allOptions = [
	{
		name: 'min-height',
		label: __('Min', 'ghostkit'),
	},
	{
		name: 'max-height',
		label: __('Max', 'ghostkit'),
	},
];

function PositionMinMaxHeightTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { allDevices } = useResponsive();

	let hasMinMaxHeight = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allOptions.forEach((thisMinMax) => {
			hasMinMaxHeight =
				hasMinMaxHeight || hasStyle(thisMinMax.name, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Min Max Height', 'ghostkit')}
			hasValue={() => !!hasMinMaxHeight}
			onDeselect={() => {
				resetStyles(
					allOptions.map((item) => {
						return item.name;
					}),
					true
				);
			}}
			isShownByDefault={false}
		>
			<InputGroup
				label={__('Min Max Height', 'ghostkit')}
				inputs={allOptions}
				hasValue={(name, media) => hasStyle(name, media)}
				getValue={(name, media) => getStyle(name, media)}
				onChange={(name, value, media) =>
					setStyles({ [name]: value }, media)
				}
				withResponsive
				withImportant
				expandOnFocus={17}
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.position.tools',
	'ghostkit/extension/position/tools/min-max-height',
	(children, { props }) => {
		const hasMinMaxHeightSupport =
			hasBlockSupport(props.name, [
				'ghostkit',
				'position',
				'minMaxHeight',
			]) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasMinMaxHeightSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionMinMaxHeightTools {...props} />
			</>
		);
	}
);
