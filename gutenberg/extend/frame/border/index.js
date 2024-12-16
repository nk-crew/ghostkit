import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	BaseControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ColorPicker from '../../../components/color-picker';
import ElementStateToggle from '../../../components/element-state-toggle';
import InputDrag from '../../../components/input-drag';
import ResponsiveToggle from '../../../components/responsive-toggle';
import ToggleGroup from '../../../components/toggle-group';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';
import { maybeDecode } from '../../../utils/encode-decode';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

const hoverSelector = '&:hover';

const allBorderProps = ['border-style', 'border-width', 'border-color'];

const borderStyles = [
	{
		value: 'solid',
		label: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M5 11.25H19V12.75H5V11.25Z" fill="currentColor" />
			</svg>
		),
	},
	{
		value: 'dashed',
		label: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5 11.25H8V12.75H5V11.25ZM10.5 11.25H13.5V12.75H10.5V11.25ZM19 11.25H16V12.75H19V11.25Z"
					fill="currentColor"
				/>
			</svg>
		),
	},
	{
		value: 'dotted',
		label: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.25 11.25H6.75V12.75H5.25V11.25ZM8.25 11.25H9.75V12.75H8.25V11.25ZM12.75 11.25H11.25V12.75H12.75V11.25ZM14.25 11.25H15.75V12.75H14.25V11.25ZM18.75 11.25H17.25V12.75H18.75V11.25Z"
					fill="currentColor"
				/>
			</svg>
		),
	},
	{
		value: 'double',
		label: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M5 9.25H19V10.75H5V9.25Z" fill="currentColor" />
				<path d="M5 13H19V14.5H5V13Z" fill="currentColor" />
			</svg>
		),
	},
];

function FrameBorderTools(props) {
	const [isHover, setIsHover] = useState(false);

	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);
	const { device, allDevices } = useResponsive();

	let hasBorder = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allBorderProps.forEach((thisProp) => {
			hasBorder =
				hasBorder ||
				hasStyle(thisProp, thisDevice) ||
				hasStyle(thisProp, thisDevice, hoverSelector);
		});
	});

	const borderStyle = getStyle(
		'border-style',
		device,
		isHover && hoverSelector
	);

	const baseControlLabel = (
		<>
			{__('Border', 'ghostkit')}
			<ResponsiveToggle
				checkActive={(checkMedia) => {
					return hasStyle(
						'border-style',
						checkMedia,
						isHover && hoverSelector
					);
				}}
			/>
			<ElementStateToggle
				isHover={isHover}
				onChange={() => {
					setIsHover(!isHover);
				}}
				checkActive={() => {
					return hasStyle('border-style', device, hoverSelector);
				}}
			/>
		</>
	);

	return (
		<ToolsPanelItem
			label={__('Border', 'ghostkit')}
			hasValue={() => !!hasBorder}
			onSelect={() => {
				setStyles({
					'border-style': 'solid',
					'border-width': '1px',
					'border-color': '#000',
				});
			}}
			onDeselect={() => {
				resetStyles(allBorderProps, true, ['', '&:hover']);
			}}
			isShownByDefault={false}
		>
			<BaseControl
				id={baseControlLabel}
				label={baseControlLabel}
				__nextHasNoMarginBottom
			>
				<div className="ghostkit-control-border-row">
					<ColorPicker
						value={maybeDecode(
							getStyle(
								'border-color',
								device,
								isHover && hoverSelector
							)
						)}
						onChange={(value) =>
							setStyles(
								{ 'border-color': value },
								device,
								isHover && hoverSelector
							)
						}
						alpha
					/>
					<ToggleGroup
						value={borderStyle}
						options={borderStyles}
						onChange={(value) => {
							setStyles(
								{
									'border-style':
										value === 'none' ? '' : value,
								},
								device,
								isHover && hoverSelector
							);
						}}
						isBlock
					/>
					<InputDrag
						value={getStyle(
							'border-width',
							device,
							isHover && hoverSelector
						)}
						placeholder={__('Width', 'ghostkit')}
						onChange={(value) =>
							setStyles(
								{ 'border-width': value },
								device,
								isHover && hoverSelector
							)
						}
						autoComplete="off"
					/>
				</div>
			</BaseControl>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.frame.tools',
	'ghostkit/extension/frame/tools/border',
	(children, { props }) => {
		const hasBorderSupport =
			hasBlockSupport(props.name, ['ghostkit', 'frame', 'border']) ||
			getBlockSupport(props.name, ['ghostkit', 'frame']) === true;

		if (!hasBorderSupport) {
			return children;
		}

		return (
			<>
				{children}
				<FrameBorderTools {...props} />
			</>
		);
	}
);
