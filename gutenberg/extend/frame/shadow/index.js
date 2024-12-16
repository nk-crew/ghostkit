import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	BaseControl,
	Tooltip,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ColorPicker from '../../../components/color-picker';
import ElementStateToggle from '../../../components/element-state-toggle';
import InputDrag from '../../../components/input-drag';
import InputGroup from '../../../components/input-group';
import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';
import arrayMove from '../../../utils/array-move';
import { maybeDecode } from '../../../utils/encode-decode';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

const hoverSelector = '&:hover';

/**
 * Add `px` suffix to number string.
 *
 * @param {string} str string.
 *
 * @return {string} string with pixels.
 */
function addPixelsToString(str) {
	// add pixels.
	if (typeof str === 'string' && str !== '0' && /^[0-9.-]*$/.test(str)) {
		str += 'px';
	}

	return str;
}

function parseShadowString(str) {
	if (str) {
		let parsedShadow = maybeDecode(str).split(/ (?![^(]*\))/);

		if (parsedShadow && parsedShadow.length === 5) {
			// Is first item color.
			if (/^(#|rgb|hsl)/.test(parsedShadow[0])) {
				parsedShadow = arrayMove(parsedShadow, 0, 5);
			}

			return parsedShadow;
		}
	}

	return false;
}

/**
 * Component
 *
 * @param props
 */
function FrameShadowTools(props) {
	const [isHover, setIsHover] = useState(false);

	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);
	const { device, allDevices } = useResponsive();

	const [x, setX] = useState();
	const [y, setY] = useState();
	const [blur, setBlur] = useState();
	const [spread, setSpread] = useState();
	const [color, setColor] = useState();

	// Prepare current shadow state.
	useEffect(() => {
		const parsedShadow = parseShadowString(
			getStyle('box-shadow', device, isHover && hoverSelector)
		);

		if (parsedShadow && parsedShadow.length === 5) {
			setX(parsedShadow[0]);
			setY(parsedShadow[1]);
			setBlur(parsedShadow[2]);
			setSpread(parsedShadow[3]);
			setColor(parsedShadow[4]);
		} else {
			setX(undefined);
			setY(undefined);
			setBlur(undefined);
			setSpread(undefined);
			setColor(undefined);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [device, isHover]);

	// Update shadow.
	useEffect(() => {
		if (
			typeof x === 'undefined' &&
			typeof y === 'undefined' &&
			typeof blur === 'undefined' &&
			typeof spread === 'undefined' &&
			typeof color === 'undefined'
		) {
			// Reset.
			if (getStyle('box-shadow', device, isHover && hoverSelector)) {
				setStyles(
					{
						'box-shadow': undefined,
					},
					device,
					isHover && hoverSelector
				);
			}

			return;
		}

		setStyles(
			{
				'box-shadow': `${addPixelsToString(x || 0)} ${addPixelsToString(
					y || 0
				)} ${addPixelsToString(blur || 0)} ${addPixelsToString(
					spread || 0
				)} ${color || '#000'}`,
			},
			device,
			isHover && hoverSelector
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [x, y, blur, spread, color]);

	let hasShadow = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasShadow =
			hasShadow ||
			hasStyle('box-shadow', thisDevice) ||
			hasStyle('box-shadow', thisDevice, hoverSelector);
	});

	const baseControlLabel = (
		<>
			{__('Shadow', 'ghostkit')}
			<ResponsiveToggle
				checkActive={(checkMedia) => {
					return hasStyle(
						'box-shadow',
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
					return hasStyle('box-shadow', device, hoverSelector);
				}}
			/>
		</>
	);

	return (
		<ToolsPanelItem
			label={__('Shadow', 'ghostkit')}
			hasValue={() => !!hasShadow}
			onDeselect={() => {
				resetStyles(['box-shadow'], true, ['', '&:hover']);

				setX(undefined);
				setY(undefined);
				setBlur(undefined);
				setSpread(undefined);
				setColor(undefined);
			}}
			isShownByDefault={false}
		>
			<BaseControl
				id={baseControlLabel}
				label={baseControlLabel}
				__nextHasNoMarginBottom
			>
				<div className="ghostkit-control-box-shadow">
					<Tooltip text={__('Color', 'ghostkit')}>
						<div>
							<ColorPicker
								value={color}
								onChange={(val) => {
									setColor(val);
								}}
								alpha
							/>
						</div>
					</Tooltip>
					<InputGroup>
						<InputDrag
							help={__('X', 'ghostkit')}
							value={x}
							onChange={(val) => {
								setX(val || 0);
							}}
							autoComplete="off"
						/>
						<InputDrag
							help={__('Y', 'ghostkit')}
							value={y}
							onChange={(val) => {
								setY(val || 0);
							}}
							autoComplete="off"
						/>
						<InputDrag
							help={__('Blur', 'ghostkit')}
							value={blur}
							onChange={(val) => {
								setBlur(val || 0);
							}}
							autoComplete="off"
						/>
						<InputDrag
							help={__('Spread', 'ghostkit')}
							value={spread}
							onChange={(val) => {
								setSpread(val || 0);
							}}
							autoComplete="off"
						/>
					</InputGroup>
				</div>
			</BaseControl>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.frame.tools',
	'ghostkit/extension/frame/tools/shadow',
	(children, { props }) => {
		const hasShadowSupport =
			hasBlockSupport(props.name, ['ghostkit', 'frame', 'shadow']) ||
			getBlockSupport(props.name, ['ghostkit', 'frame']) === true;

		if (!hasShadowSupport) {
			return children;
		}

		return (
			<>
				{children}
				<FrameShadowTools {...props} />
			</>
		);
	}
);
