import { BaseControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import DropdownPicker from '../dropdown-picker';
import ToggleGroup from '../toggle-group';
import {
	EasingBezierEditor,
	EasingControls,
} from '../transition-easing-controls';
import EASING_DEFAULT from '../transition-easing-controls/default';
import { SpringControls, SpringEditor } from '../transition-spring-controls';
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

	let buttonLabel = '';
	const resetButton = allowReset && value && (
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

	if (value?.type === 'easing') {
		buttonLabel = (
			<>
				<EasingBezierEditor variant="preview" value={easingValue} />
				{__('Easing', 'ghostkit')}
				{resetButton}
			</>
		);
	} else if (value?.type === 'spring') {
		buttonLabel = (
			<>
				<SpringEditor variant="preview" value={value} />
				{__('Spring', 'ghostkit')}
				{resetButton}
			</>
		);
	} else {
		buttonLabel = (
			<>
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
				{__('Add…', 'ghostkit')}
			</>
		);
	}

	if (!enableEasing && !enableSpring) {
		return false;
	}

	return (
		<BaseControl id={label} label={label} __nextHasNoMarginBottom>
			<DropdownPicker
				label={buttonLabel}
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
		</BaseControl>
	);
}
