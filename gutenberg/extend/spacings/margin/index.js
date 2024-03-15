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
		name: 'margin-top',
		label: __('Top', 'ghostkit'),
	},
	{
		name: 'margin-right',
		label: __('Right', 'ghostkit'),
	},
	{
		name: 'margin-bottom',
		label: __('Bottom', 'ghostkit'),
	},
	{
		name: 'margin-left',
		label: __('left', 'ghostkit'),
	},
];

function SpacingsMarginTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { allDevices } = useResponsive();

	let hasMargin = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allOptions.forEach((thisMargin) => {
			hasMargin = hasMargin || hasStyle(thisMargin.name, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Margin', 'ghostkit')}
			hasValue={() => !!hasMargin}
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
				label={__('Margin', 'ghostkit')}
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
	'ghostkit.extension.spacings.tools',
	'ghostkit/extension/spacings/tools/margin',
	(children, { props }) => {
		const hasMarginSupport =
			hasBlockSupport(props.name, ['ghostkit', 'spacings', 'margin']) ||
			getBlockSupport(props.name, ['ghostkit', 'spacings']) === true;

		if (!hasMarginSupport) {
			return children;
		}

		return (
			<>
				{children}
				<SpacingsMarginTools {...props} />
			</>
		);
	}
);
