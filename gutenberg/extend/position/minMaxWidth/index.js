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

const allProps = ['min-width', 'max-width'];

function PositionMinMaxWidthTools(props) {
	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasMinMaxWidth = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasMinMaxWidth =
			hasMinMaxWidth ||
			hasStyle('min-width', thisDevice) ||
			hasStyle('max-width', thisDevice);
	});

	return (
		<ToolsPanelItem
			label={__('Min Max Width', 'ghostkit')}
			hasValue={() => !!hasMinMaxWidth}
			onDeselect={() => {
				resetStyles(allProps, true);
			}}
			isShownByDefault={false}
		>
			<InputGroup
				label={
					<>
						{__('Min Max Width', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								let isActive = false;

								allProps.forEach((thisProp) => {
									isActive =
										isActive ||
										hasStyle(thisProp, checkMedia);
								});

								return isActive;
							}}
						/>
					</>
				}
			>
				{allProps.map((propName) => {
					let label = __('Min', 'ghostkit');

					if (propName === 'max-width') {
						label = __('Max', 'ghostkit');
					}

					let value = getStyle(propName, device);

					const withImportant = / !important$/.test(value);
					if (withImportant) {
						value = value.replace(/ !important$/, '');
					}

					return (
						<div key={propName}>
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

									setStyles({ [propName]: newValue }, device);
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
											{ [propName]: newValue },
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
	'ghostkit/extension/position/tools/min-max-width',
	(children, { props }) => {
		const hasMinMaxWidthSupport = hasBlockSupport(props.name, [
			'ghostkit',
			'position',
			'minMaxWidth',
		]);

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
