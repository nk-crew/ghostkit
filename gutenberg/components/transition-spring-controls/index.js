import classnames from 'classnames/dedupe';

import {
	__experimentalGrid as ExperimentalGrid,
	__experimentalNumberControl as ExperimentalNumberControl,
	__stableGrid as StableGrid,
	__stableNumberControl as StableNumberControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import round from '../../utils/round';
import Select from '../select';
import TransitionPreview from '../transition-preview';
import DEFAULT from './default';
import PRESETS from './presets';

const NumberControl = StableNumberControl || ExperimentalNumberControl;
const Grid = StableGrid || ExperimentalGrid;

const {
	Motion: { spring },
} = window;

export { DEFAULT };
export { PRESETS };

export function SpringEditor(props) {
	const { value, variant = '', backgroundColor } = props;
	const [path, setPath] = useState('');
	const [duration, setDuration] = useState(null);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	let options = {
		width: 228,
		height: 140,
		padding: 10,
		curveColor: '#bfbfbf',
		curveWidth: 2,
		framesLength: 2000,
	};

	if (variant === 'preview') {
		options = {
			...options,
			width: 20,
			height: 20,
			padding: 3,
			curveColor: '#fff',
			curveWidth: 1.5,
		};
	}

	/**
	 * Prepare SVG path with spring.
	 */
	useEffect(() => {
		const springData = spring({
			stiffness: value?.stiffness,
			damping: value?.damping,
			mass: value?.mass,
			keyframes: [0, options.framesLength],
		});

		const width = options.width - options.padding * 2;
		const height = options.height - options.padding * 2;

		const points = [];

		// const step = 10;
		for (let i = 0; i <= options.framesLength; i++) {
			const valuePercent =
				(options.framesLength - springData.next(i).value) /
				options.framesLength;
			const framesPercent = i / options.framesLength;
			const x = round(framesPercent * width, 4) + options.padding;
			const y =
				round((valuePercent * height) / 2, 4) +
				height / 2 +
				options.padding;

			points.push([x, y]);
		}

		let newPath = `M${options.padding}`;

		for (let p = 0, l = points.length; p < l; p += 1) {
			newPath += ` ${points[p][1]}L${points[p][0]}`;
		}

		newPath += ` ${height / 2 + options.padding}`;

		setPath(newPath);
		setDuration(springData.duration);
	}, [options, value?.stiffness, value?.damping, value?.mass]);

	return (
		<div
			className={classnames(
				'ghostkit-component-spring-editor',
				variant && `ghostkit-component-spring-editor-${variant}`
			)}
			style={backgroundColor ? { backgroundColor } : {}}
		>
			<svg
				width={options.width}
				height={options.height}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d={path}
					stroke={options.curveColor}
					fill="transparent"
					strokeLinecap="round"
					strokeWidth={options.curveWidth}
				/>
			</svg>
			{!!duration && variant !== 'preview' && (
				<span className="ghostkit-component-spring-editor-duration">
					{duration}s
				</span>
			)}
		</div>
	);
}

export function SpringControls(props) {
	const { value, onChange, enableDelayControl = true } = props;
	const [preset, setPreset] = useState();

	function updateValue(val) {
		onChange({ ...value, ...val });
	}

	// Find default preset
	useEffect(() => {
		let newPreset = 'custom';

		Object.keys(PRESETS).forEach((slug) => {
			if (
				value?.stiffness === PRESETS[slug].stiffness &&
				value?.damping === PRESETS[slug].damping &&
				value?.mass === PRESETS[slug].mass
			) {
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
		<>
			<Select
				value={presetValue}
				onChange={({ value: newPreset }) => {
					if (PRESETS?.[newPreset]?.stiffness) {
						updateValue({
							stiffness: PRESETS[newPreset].stiffness,
							damping: PRESETS[newPreset].damping,
							mass: PRESETS[newPreset].mass,
						});
					}
				}}
				options={presetOptions}
				isSearchable={false}
			/>
			<SpringEditor value={value} />
			<Grid columns={3}>
				<NumberControl
					label={__('Stiffness', 'ghostkit')}
					value={value?.stiffness}
					onChange={(val) =>
						updateValue({ stiffness: parseFloat(val) })
					}
					min={1}
					max={1000}
					step={1}
				/>
				<NumberControl
					label={__('Damping', 'ghostkit')}
					value={value?.damping}
					onChange={(val) =>
						updateValue({ damping: parseFloat(val) })
					}
					min={0}
					max={100}
					step={0.1}
				/>
				<NumberControl
					label={__('Mass', 'ghostkit')}
					value={value?.mass}
					onChange={(val) => updateValue({ mass: parseFloat(val) })}
					min={0}
					max={10}
					step={0.05}
				/>
			</Grid>
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
					type: 'spring',
					stiffness: value?.stiffness,
					damping: value?.damping,
					mass: value?.mass,
				}}
			/>
		</>
	);
}
