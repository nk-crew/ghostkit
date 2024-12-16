import { useDrag } from '@use-gesture/react';
import classnames from 'classnames/dedupe';

import { TextControl } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';

const units = [
	'px',
	'%',
	'rem',
	'em',
	'vh',
	'vw',
	'vmin',
	'vmax',
	'ex',
	'cm',
	'mm',
	'in',
	'pt',
	'pc',
	'ch',
];

/**
 * The function counts the number of digits after the decimal point.
 *
 * @param {number} number - Any Number.
 * @return {number} - Number of decimal places.
 */
const numberOfDecimal = (number) =>
	number.toString().includes('.')
		? number.toString().split('.').pop().length
		: 0;

function fixRounding(value, precision) {
	const power = Math.pow(10, precision || 0);
	return Math.round(value * power) / power;
}

/**
 * Component
 *
 * @param {*} props component props.
 * @return {*}
 */
export default function InputDrag(props) {
	const {
		label,
		help,
		icon,
		placeholder,
		value,
		step,
		defaultUnit,
		expandOnFocus,
		autoComplete,
		className,
		onChange,
	} = props;

	const inputRef = useRef();
	const [isFocused, setIsFocused] = useState(false);

	function parseValue() {
		let valueNum = parseFloat(value);
		let unit = '';

		// check if value contains units and save it.
		if (value !== `${valueNum}`) {
			const matchUnit = (value || '').match(
				new RegExp(`${valueNum}(${units.join('|')})`, 'i')
			);

			if (matchUnit && matchUnit[1]) {
				unit = matchUnit[1];
			}
		}

		if (Number.isNaN(valueNum)) {
			valueNum = 0;
			if (typeof defaultUnit !== 'undefined') {
				unit = defaultUnit;
			}
		}

		return {
			num: valueNum,
			unit,
			full: value,
		};
	}

	function onDragChange(distance, shiftKey) {
		let newVal = distance;
		const shiftVal = 10;

		if (step) {
			newVal *= step;
		}
		if (shiftKey) {
			newVal *= shiftVal;
		}

		const valueObj = parseValue();

		// If value differs from full value, then do nothing.
		// It may be for example when used value such as:
		// - calc(10px)
		// - var(--var-name)
		if (
			typeof valueObj.full !== 'undefined' &&
			`${valueObj.num}${valueObj.unit}` !== valueObj.full
		) {
			return;
		}

		newVal = valueObj.num + newVal;

		// Fix rounding problem after multiplication.
		// https://stackoverflow.com/questions/9993266/javascript-multiply-not-precise
		const decimals = numberOfDecimal(newVal);
		if (decimals > 10) {
			newVal = fixRounding(newVal, decimals - 1);
		}

		onChange(newVal + valueObj.unit);
	}

	function keyDown(e) {
		switch (e.keyCode) {
			// down.
			case 40:
				e.preventDefault();
				onDragChange(-1, e.shiftKey);
				break;
			// up.
			case 38:
				e.preventDefault();
				onDragChange(1, e.shiftKey);
				break;
			// no default
		}
	}

	const dragGestureProps = useDrag(
		(dragProps) => {
			const { event, dragging, _direction, shiftKey } = dragProps;

			if (!dragging) {
				return;
			}

			event.stopPropagation();

			onDragChange(-1 * _direction[1], shiftKey);
		},
		{
			axis: 'y',
			threshold: 10,
			enabled: true,
			pointer: { capture: false },
		}
	);

	let classHasIcon = 'ghostkit-component-input-drag-no-icon';

	if (typeof icon !== 'undefined') {
		classHasIcon = 'ghostkit-component-input-drag-has-icon';
	}

	return (
		<div
			className={classnames(
				classHasIcon,
				isFocused &&
					expandOnFocus &&
					value &&
					value.length >= expandOnFocus &&
					'ghostkit-component-input-drag-expand',
				className
			)}
		>
			{icon}
			<TextControl
				{...dragGestureProps()}
				ref={inputRef}
				label={label}
				help={help}
				placeholder={placeholder}
				value={value || ''}
				onKeyDown={keyDown}
				onChange={(val) => {
					onChange(val);
				}}
				onFocus={() => {
					setIsFocused(true);
				}}
				onBlur={() => {
					setIsFocused(false);
				}}
				className="ghostkit-component-input-drag"
				autoComplete={autoComplete}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</div>
	);
}
