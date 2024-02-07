import { BaseControl, RangeControl, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

/**
 * Component Class
 *
 * @param root0
 * @param root0.allowCustomMin
 * @param root0.allowCustomMax
 * @param root0.label
 */
export default function CustomRangeControl({
	allowCustomMin,
	allowCustomMax,
	label,
	...props
}) {
	const [min, setMin] = useState(parseFloat(props.min) || 0);
	const [max, setMax] = useState(parseFloat(props.max) || 100);

	useEffect(() => {
		if (allowCustomMin && props.value && props.value < min) {
			setMin(props.value);
		}
		if (allowCustomMax && props.value && props.value > max) {
			setMax(props.value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value]);

	if (allowCustomMin || allowCustomMax) {
		return (
			<BaseControl
				id={label}
				label={label}
				className="ghostkit-component-range-control"
			>
				<RangeControl
					{...props}
					min={min}
					max={max}
					withInputField={false}
				/>
				<TextControl
					type="number"
					value={props.value}
					min={min}
					max={max}
					step={props.step}
					onChange={(val) => {
						const result = val === '' ? undefined : parseFloat(val);

						if (!allowCustomMin && val < min) {
							props.onChange(min);
						} else if (!allowCustomMax && val > max) {
							props.onChange(max);
						} else {
							props.onChange(result);
						}
					}}
				/>
			</BaseControl>
		);
	}

	return <RangeControl {...props} label={label} min={min} max={max} />;
}
