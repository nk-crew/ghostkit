// TODO: check for better implementation - https://codepen.io/osublake/pen/OyPGEo
import BezierEditor from 'bezier-easing-editor';
import classnames from 'classnames/dedupe';

import {
	__experimentalNumberControl as ExperimentalNumberControl,
	__stableNumberControl as StableNumberControl,
	BaseControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import round from '../../utils/round';
import Select from '../select';
import TransitionPreview from '../transition-preview';
import DEFAULT from './default';
import PRESETS from './presets';

const NumberControl = StableNumberControl || ExperimentalNumberControl;

export { DEFAULT };
export { PRESETS };

export function EasingBezierEditor(props) {
	const { value, onChange, variant = '', backgroundColor } = props;

	let options = {
		value,
		width: 228,
		height: 140,
		padding: [25, 55, 25, 55],
		background: 'transparent',
		color: '#ccc',
		gridColor: 'transparent',
		curveColor: '#bfbfbf',
		progressColor: '#ccc',
		handleColor: 'var(--wp-admin-theme-color)',
		curveWidth: 2,
		handleRadius: 6,
		handleStroke: 2,
		textStyle: {
			display: 'none',
		},
		// We have to add the onChange callback to prevent warning in console.
		onChange(val) {
			if (onChange) {
				onChange(val);
			}
		},
	};

	if (variant === 'preview') {
		options = {
			...options,
			readOnly: true,
			width: 20,
			height: 20,
			padding: [3, 3, 3, 3],
			curveColor: '#fff',
			curveWidth: 1.5,
		};
	}

	return (
		<div
			className={classnames(
				'ghostkit-component-bezier-editor',
				variant && `ghostkit-component-bezier-editor-${variant}`
			)}
			style={backgroundColor ? { backgroundColor } : {}}
		>
			<BezierEditor {...options} />
		</div>
	);
}

export function EasingControls(props) {
	const { value, onChange, enableDelayControl = true } = props;

	const [preset, setPreset] = useState();

	function updateValue(val) {
		// Fix invalid easing value
		if (val.easing && val.easing.length) {
			val.easing[0] = Math.max(Math.min(val.easing[0], 1), 0);
			val.easing[2] = Math.max(Math.min(val.easing[2], 1), 0);
		}

		onChange({ ...value, ...val });
	}

	let easing = value?.easing;
	if (!easing || easing.length !== 4) {
		easing = DEFAULT.easing;
	}

	// Find default preset
	useEffect(() => {
		let newPreset = 'custom';

		Object.keys(PRESETS).forEach((slug) => {
			const presetData = PRESETS[slug].easing;

			if (JSON.stringify(easing) === JSON.stringify(presetData)) {
				newPreset = slug;
			}
		});

		setPreset(newPreset);
	}, [preset, easing]);

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

	// Parse pasted cubic bezier values.
	// Supported values:
	// - cubic-bezier(.62,1.45,0,-0.7)
	// - (.62,1.45,0,-0.7)
	// - .62,1.45,0,-0.7
	// - 0.62,1.45,0,-0.7
	// - 0.62, 1.45, 0, -0.7
	function handlePasteBezier(e) {
		const clipboard = e.clipboardData.getData('text');

		if (!clipboard) {
			return;
		}

		const parts = clipboard.split(',');

		if (!parts || parts.length !== 4) {
			return;
		}

		parts[0] = parts[0].replace(/^cubic-bezier/, '').replace(/^\(/, '');
		parts[3] = parts[3].replace(/\)$/, '');

		const result = parts.map((a) => {
			return parseFloat(a);
		});

		if (!result || result.length !== 4) {
			return;
		}

		e.preventDefault();

		updateValue({ easing: result });
	}

	return (
		<>
			<Select
				value={presetValue}
				onChange={({ value: newPreset }) => {
					if (PRESETS?.[newPreset]?.easing) {
						updateValue({ easing: PRESETS[newPreset].easing });
					}
				}}
				options={presetOptions}
				isSearchable={false}
			/>
			<EasingBezierEditor
				value={easing}
				onChange={(val) => {
					const newEase = val.map((v) => {
						return round(v, 2);
					});

					updateValue({ easing: newEase });
				}}
			/>
			<BaseControl
				id={__('Bezier', 'ghostkit')}
				label={__('Bezier', 'ghostkit')}
				className="ghostkit-component-easing-controls-bezier"
				__nextHasNoMarginBottom
			>
				<NumberControl
					value={easing[0]}
					onChange={(val) =>
						updateValue({
							easing: [
								round(parseFloat(val), 2),
								easing[1],
								easing[2],
								easing[3],
							],
						})
					}
					onPaste={(e) => handlePasteBezier(e)}
					min={0}
					max={1}
					step={0.01}
				/>
				<NumberControl
					value={easing[1]}
					onChange={(val) =>
						updateValue({
							easing: [
								easing[0],
								round(parseFloat(val), 2),
								easing[2],
								easing[3],
							],
						})
					}
					onPaste={(e) => handlePasteBezier(e)}
					min={-5}
					max={5}
					step={0.01}
				/>
				<NumberControl
					value={easing[2]}
					onChange={(val) =>
						updateValue({
							easing: [
								easing[0],
								easing[1],
								round(parseFloat(val), 2),
								easing[3],
							],
						})
					}
					onPaste={(e) => handlePasteBezier(e)}
					min={0}
					max={1}
					step={0.01}
				/>
				<NumberControl
					value={easing[3]}
					onChange={(val) =>
						updateValue({
							easing: [
								easing[0],
								easing[1],
								easing[2],
								round(parseFloat(val), 2),
							],
						})
					}
					onPaste={(e) => handlePasteBezier(e)}
					min={-5}
					max={5}
					step={0.01}
				/>
			</BaseControl>
			<NumberControl
				label={__('Duration', 'ghostkit')}
				suffix="s&nbsp;"
				value={value?.duration || 0}
				onChange={(val) => updateValue({ duration: parseFloat(val) })}
				labelPosition="edge"
				__unstableInputWidth="90px"
				min={0}
				max={10}
				step={0.01}
			/>
			{enableDelayControl && (
				<NumberControl
					label={__('Delay', 'ghostkit')}
					suffix="s&nbsp;"
					value={value?.delay || 0}
					onChange={(val) => updateValue({ delay: parseFloat(val) })}
					labelPosition="edge"
					__unstableInputWidth="90px"
					min={0}
					max={10}
					step={0.01}
				/>
			)}
			<TransitionPreview
				label={__('Preview', 'ghostkit')}
				options={{
					type: 'easing',
					duration: value?.duration || 0,
					easing,
				}}
			/>
		</>
	);
}
