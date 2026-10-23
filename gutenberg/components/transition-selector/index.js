import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import DropdownPicker from '../dropdown-picker';
import ToggleGroup from '../toggle-group';
import {
	EasingBezierEditor,
	EasingControls,
} from '../transition-easing-controls';
import EASING_DEFAULT from '../transition-easing-controls/default';
import {
	getSpringDuration,
	SpringControls,
	SpringEditor,
} from '../transition-spring-controls';
import SPRING_DEFAULT from '../transition-spring-controls/default';

export default function TransitionSelector(props) {
	const {
		label,
		value,
		onChange,
		enableEasing = true,
		enableSpring = true,
		enableDelayControl = true,
		allowReset = false,
	} = props;

	const [isOpenTransition, setIsOpenTransition] = useState(false);

	let easingValue = value?.easing;
	if (!easingValue || easingValue.length !== 4) {
		easingValue = EASING_DEFAULT.easing;
	}

	const resetButton = allowReset && value && (
		// biome-ignore lint/a11y/useSemanticElements: this sits inside the dropdown toggle button, a real <button> would nest interactive controls.
		<span
			className="ghostkit-component-transition-selector-reset"
			onClick={(e) => {
				// Reset.
				e.preventDefault();
				e.stopPropagation();

				setIsOpenTransition(false);

				onChange(undefined);
			}}
			onKeyDown={() => {}}
			role="button"
			tabIndex={0}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				aria-hidden="true"
				focusable="false"
			>
				<path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z" />
			</svg>
		</span>
	);

	let typeLabel = '';
	let duration = 0;
	let indicator;

	if (value?.type === 'easing') {
		typeLabel = __('Easing', 'ghostkit');
		duration = value?.duration ?? EASING_DEFAULT.duration;
		indicator = (
			<EasingBezierEditor variant="preview" value={easingValue} />
		);
	} else if (value?.type === 'spring') {
		typeLabel = __('Spring', 'ghostkit');
		duration = getSpringDuration(value);
		indicator = <SpringEditor variant="preview" value={value} />;
	} else {
		indicator = (
			<SpringEditor
				variant="preview"
				value={{
					type: 'spring',
					stiffness: 930,
					damping: 40,
					mass: 6,
					delay: 0,
				}}
				backgroundColor="#c3c3c3"
			/>
		);
	}

	// The label names the row and the type moves into the summary, like "Spring · 1.05s".
	let rowLabel = label || __('Add…', 'ghostkit');
	// A spring that never settles has no duration to show.
	const durationText = duration === null ? '' : `${duration}s`;
	let summary =
		typeLabel && [typeLabel, durationText].filter(Boolean).join(' · ');

	if (!label && typeLabel) {
		rowLabel = typeLabel;
		summary = durationText;
	}

	if (!enableEasing && !enableSpring) {
		return false;
	}

	return (
		<div className="ghostkit-component-dropdown-picker-group">
			<DropdownPicker
				label={rowLabel}
				indicator={indicator}
				value={
					(summary || resetButton) && (
						<>
							{summary}
							{resetButton}
						</>
					)
				}
				className="ghostkit-component-transition-selector"
				contentClassName="ghostkit-component-transition-selector-content"
				isOpenTransition={isOpenTransition}
				onToggle={(isOpen) => {
					setIsOpenTransition(isOpen);
				}}
				onClick={(onToggle) => {
					// Toggle dropdown.
					if (value?.type === 'spring' || value?.type === 'easing') {
						onToggle();

						// Add spring transition.
					} else {
						const addTransition = {
							type: 'spring',
							...SPRING_DEFAULT,
						};

						delete addTransition.label;

						onChange(addTransition);
					}
				}}
			>
				{enableEasing && enableSpring && (
					<ToggleGroup
						value={value?.type || 'spring'}
						options={[
							{
								label: __('Easing', 'ghostkit'),
								value: 'easing',
							},
							{
								label: __('Spring', 'ghostkit'),
								value: 'spring',
							},
						]}
						onChange={(val) => {
							const defaultTransition =
								val === 'easing'
									? { type: 'easing', ...EASING_DEFAULT }
									: { type: 'spring', ...SPRING_DEFAULT };

							delete defaultTransition.label;

							onChange(defaultTransition);
						}}
						isBlock
					/>
				)}
				{enableSpring && value?.type !== 'easing' && (
					<SpringControls
						value={value}
						onChange={(val) => {
							onChange(val);
						}}
						enableDelayControl={enableDelayControl}
					/>
				)}
				{enableEasing && value?.type === 'easing' && (
					<EasingControls
						value={value}
						onChange={(val) => {
							onChange(val);
						}}
						enableDelayControl={enableDelayControl}
					/>
				)}
			</DropdownPicker>
		</div>
	);
}
