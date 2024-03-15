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
		name: 'min-width',
		label: __('Min', 'ghostkit'),
	},
	{
		name: 'max-width',
		label: __('Max', 'ghostkit'),
	},
];

function PositionMinMaxWidthTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { allDevices } = useResponsive();

	let hasMinMaxWidth = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allOptions.forEach((thisMinMax) => {
			hasMinMaxWidth =
				hasMinMaxWidth || hasStyle(thisMinMax.name, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Min Max Width', 'ghostkit')}
			hasValue={() => !!hasMinMaxWidth}
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
				label={__('Min Max Width', 'ghostkit')}
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
	'ghostkit/extension/position/tools/min-max-width',
	(children, { props }) => {
		const hasMinMaxWidthSupport =
			hasBlockSupport(props.name, [
				'ghostkit',
				'position',
				'minMaxWidth',
			]) ||
			getBlockSupport(props.name, ['ghostkit', 'position']) === true;

		if (!hasMinMaxWidthSupport) {
			return children;
		}

		return (
			<>
				{children}
				<PositionMinMaxWidthTools {...props} />
			</>
		);
	}
);
