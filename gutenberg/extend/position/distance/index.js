import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ImportantToggle from '../../../components/important-toggle';
import InputDrag from '../../../components/input-drag';
import InputGroup from '../../../components/input-group';
import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

const allDistances = ['top', 'right', 'bottom', 'left'];

function PositionDistanceTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasDistance = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allDistances.forEach((thisDistance) => {
			hasDistance = hasDistance || hasStyle(thisDistance, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Distance', 'ghostkit')}
			hasValue={() => !!hasDistance}
			onDeselect={() => {
				resetStyles(allDistances, true);
			}}
			isShownByDefault={false}
		>
			<InputGroup
				label={
					<>
						{__('Distance', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								let isActive = false;

								allDistances.forEach((thisDistance) => {
									isActive =
										isActive ||
										hasStyle(thisDistance, checkMedia);
								});

								return isActive;
							}}
						/>
					</>
				}
			>
				{allDistances.map((distanceName) => {
					let label = __('Top', 'ghostkit');

					switch (distanceName) {
						case 'right':
							label = __('Right', 'ghostkit');
							break;
						case 'bottom':
							label = __('Bottom', 'ghostkit');
							break;
						case 'left':
							label = __('Left', 'ghostkit');
							break;
						// no default
					}

					let value = getStyle(distanceName, device);

					const withImportant = / !important$/.test(value);
					if (withImportant) {
						value = value.replace(/ !important$/, '');
					}

					return (
						<div key={distanceName}>
							<InputDrag
								help={label}
								value={value}
								placeholder="-"
								onChange={(val) => {
									const newValue = val
										? `${val}${
												withImportant
													? ' !important'
													: ''
											}`
										: undefined;

									setStyles(
										{ [distanceName]: newValue },
										device
									);
								}}
								autoComplete="off"
							/>
							<ImportantToggle
								onClick={(newWithImportant) => {
									if (value) {
										const newValue = `${value}${
											newWithImportant
												? ' !important'
												: ''
										}`;

										setStyles(
											{ [distanceName]: newValue },
											device
										);
									}
								}}
								isActive={withImportant}
							/>
						</div>
					);
				})}
			</InputGroup>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.position.tools',
	'ghostkit/extension/position/tools/distance',
	(children, { props }) => {
		const hasDistanceSupport = hasBlockSupport(props.name, [
			'ghostkit',
			'position',
			'distance',
		]);

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
