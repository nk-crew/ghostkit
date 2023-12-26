import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	BaseControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ImportantToggle from '../../../components/important-toggle';
import InputDrag from '../../../components/input-drag';
import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

const allPaddings = [
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
];

function SpacingsPaddingTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	const baseControlLabel = (
		<>
			{__('Padding', 'ghostkit')}
			<ResponsiveToggle
				checkActive={(checkMedia) => {
					let isActive = false;

					allPaddings.forEach((thisPadding) => {
						isActive =
							isActive || hasStyle(thisPadding, checkMedia);
					});

					return isActive;
				}}
			/>
		</>
	);

	let hasPadding = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allPaddings.forEach((thisPadding) => {
			hasPadding = hasPadding || hasStyle(thisPadding, thisDevice);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Padding', 'ghostkit')}
			hasValue={() => !!hasPadding}
			onDeselect={() => {
				resetStyles(allPaddings, true);
			}}
			isShownByDefault={false}
		>
			<BaseControl
				id={baseControlLabel}
				label={baseControlLabel}
				className="ghostkit-tools-panel-spacings-row"
			>
				<div>
					{allPaddings.map((paddingName) => {
						let label = __('Top', 'ghostkit');

						switch (paddingName) {
							case 'padding-right':
								label = __('Right', 'ghostkit');
								break;
							case 'padding-bottom':
								label = __('Bottom', 'ghostkit');
								break;
							case 'padding-left':
								label = __('Left', 'ghostkit');
								break;
							// no default
						}

						let value = getStyle(paddingName, device);

						const withImportant = / !important$/.test(value);
						if (withImportant) {
							value = value.replace(/ !important$/, '');
						}

						return (
							<div
								key={paddingName}
								className="ghostkit-tools-panel-spacings-item"
							>
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
											{ [paddingName]: newValue },
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
												{ [paddingName]: newValue },
												device
											);
										}
									}}
									isActive={withImportant}
								/>
							</div>
						);
					})}
				</div>
			</BaseControl>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.spacings.tools',
	'ghostkit/extension/spacings/tools/padding',
	(children, { props }) => {
		const hasPaddingSupport = hasBlockSupport(props.name, [
			'ghostkit',
			'spacings',
			'padding',
		]);

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
