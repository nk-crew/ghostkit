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
		name: 'top',
		label: __('Top', 'ghostkit'),
	},
	{
		name: 'right',
		label: __('Right', 'ghostkit'),
	},
	{
		name: 'bottom',
		label: __('Bottom', 'ghostkit'),
	},
	{
		name: 'left',
		label: __('left', 'ghostkit'),
	},
];

function PositionDistanceTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { allDevices } = useResponsive();

	let hasDistance = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allOptions.forEach((thisDistance) => {
			hasDistance =
				hasDistance || hasStyle(thisDistance.name, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Distance', 'ghostkit')}
			hasValue={() => !!hasDistance}
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
				label={__('Distance', 'ghostkit')}
				inputs={allOptions}
				hasValue={(name, media) => hasStyle(name, media)}
				getValue={(name, media) => getStyle(name, media)}
				onChange={(name, value, media) =>
					setStyles({ [name]: value }, media)
				}
				withResponsive
				withImportant
				expandOnFocus={6}
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.position.tools',
	'ghostkit/extension/position/tools/distance',
	(children, { props }) => {
		const hasDistanceSupport =
			hasBlockSupport(props.name, ['ghostkit', 'position', 'distance']) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasDistanceSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionDistanceTools {...props} />
			</>
		);
	}
);
