import classnames from 'classnames/dedupe';

import { BaseControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

import useResponsive from '../../hooks/use-responsive';
import ElementStateToggle from '../element-state-toggle';
import ImportantToggle from '../important-toggle';
import InputDrag from '../input-drag';
import ResponsiveToggle from '../responsive-toggle';

const noop = () => {};

function InputGroupWithChildren(props) {
	const { className, children, ...restProps } = props;

	return (
		<BaseControl
			className={classnames('ghostkit-component-input-group', className)}
			__nextHasNoMarginBottom
			{...restProps}
		>
			<div className="ghostkit-component-input-group-wrapper">
				{children}
			</div>
		</BaseControl>
	);
}

/**
 * Component
 *
 * @param props
 */
export default function InputGroup(props) {
	if (props.children) {
		return <InputGroupWithChildren {...props} />;
	}

	const {
		label,
		inputs,
		hasValue = noop,
		getValue = noop,
		onChange = noop,
		withResponsive,
		withState,
		withImportant,
		expandOnFocus,
		className,
		...restProps
	} = props;

	const [isHover, setIsHover] = useState(false);
	const { device } = useResponsive();

	return (
		<BaseControl
			id={inputs[0].name}
			className={classnames('ghostkit-component-input-group', className)}
			label={
				<>
					{label}
					{withResponsive && (
						<ResponsiveToggle
							checkActive={(checkMedia) =>
								inputs.some((inputDate) =>
									hasValue(
										inputDate.name,
										checkMedia,
										isHover
									)
								)
							}
						/>
					)}
					{withState && (
						<ElementStateToggle
							isHover={isHover}
							onChange={() => {
								setIsHover(!isHover);
							}}
							checkActive={() =>
								inputs.some((inputDate) =>
									hasValue(inputDate.name, device, true)
								)
							}
						/>
					)}
				</>
			}
			__nextHasNoMarginBottom
			{...restProps}
		>
			<div className="ghostkit-component-input-group-wrapper">
				{inputs.map((inputData) => {
					let value = getValue(inputData.name, device, isHover);
					let hasImportant = false;

					if (withImportant) {
						hasImportant = / !important$/.test(value);

						if (hasImportant) {
							value = value.replace(/ !important$/, '');
						}
					}

					return (
						<div
							key={inputData.name}
							className="ghostkit-component-input-group-item"
						>
							<InputDrag
								id={inputData.name}
								help={inputData.label}
								value={value}
								onChange={(newValue) => {
									newValue = newValue
										? `${newValue}${
												hasImportant
													? ' !important'
													: ''
											}`
										: undefined;

									onChange(
										inputData.name,
										newValue,
										device,
										isHover
									);
								}}
								expandOnFocus={expandOnFocus}
								autoComplete="off"
							/>
							{withImportant && typeof value !== 'undefined' && (
								<ImportantToggle
									onClick={(newWithImportant) => {
										if (value) {
											const newValue = `${value}${
												newWithImportant
													? ' !important'
													: ''
											}`;

											onChange(
												inputData.name,
												newValue,
												device,
												isHover
											);
										}
									}}
									isActive={hasImportant}
								/>
							)}
						</div>
					);
				})}
			</div>
		</BaseControl>
	);
}
