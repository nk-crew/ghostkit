import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Select from '../select';
import PRESETS from './presets';

export default function TransitionPresetsControl(props) {
	const { label, value, onChange } = props;

	const [preset, setPreset] = useState();

	// Find default preset
	useEffect(() => {
		let newPreset = 'custom';

		const currentReveal = { ...(value || {}) };

		// Remove transition from the comparison.
		if (currentReveal?.transition) {
			delete currentReveal.transition;
		}

		Object.keys(PRESETS).forEach((slug) => {
			const presetData = { ...PRESETS[slug].data };

			// Remove transition from the comparison.
			if (presetData?.transition) {
				delete presetData.transition;
			}

			if (JSON.stringify(currentReveal) === JSON.stringify(presetData)) {
				newPreset = slug;
			}
		});

		setPreset(newPreset);
	}, [preset, value]);

	const presetOptions = [
		...(preset === 'custom'
			? [
					{
						value: 'custom',
						label: __('-- Presets --', 'ghostkit'),
					},
				]
			: []),
		...Object.keys(PRESETS).map((name) => {
			return {
				value: name,
				label: PRESETS[name].label,
				icon: PRESETS[name].icon,
			};
		}),
	];

	const presetValue = {
		value: preset,
		label: preset,
	};

	// Find actual label.
	if (presetValue.value) {
		presetOptions.forEach((presetData) => {
			if (presetValue.value === presetData.value) {
				presetValue.label = presetData.label;
			}
		});
	}

	return (
		<Select
			label={label}
			value={presetValue}
			onChange={(val) => {
				if (PRESETS?.[val.value]?.data) {
					onChange(PRESETS[val.value].data);
				}
			}}
			options={presetOptions}
			isSearchable={false}
		/>
	);
}
