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
		name: 'padding-top',
		label: __('Top', 'ghostkit'),
	},
	{
		name: 'padding-right',
		label: __('Right', 'ghostkit'),
	},
	{
		name: 'padding-bottom',
		label: __('Bottom', 'ghostkit'),
	},
	{
		name: 'padding-left',
		label: __('left', 'ghostkit'),
	},
];

function SpacingsPaddingTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { allDevices } = useResponsive();

	let hasPadding = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allOptions.forEach((thisPadding) => {
			hasPadding = hasPadding || hasStyle(thisPadding.name, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Padding', 'ghostkit')}
			hasValue={() => !!hasPadding}
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
				label={__('Padding', 'ghostkit')}
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
	'ghostkit/extension/spacings/tools/padding',
	(children, { props }) => {
		const hasPaddingSupport =
			hasBlockSupport(props.name, ['ghostkit', 'spacings', 'padding']) ||
			getBlockSupport(props.name, ['ghostkit', 'spacings']) === true;

		if (!hasPaddingSupport) {
			return children;
		}

		return (
			<>
				{children}
				<SpacingsPaddingTools {...props} />
			</>
		);
	}
);
