import classnames from 'classnames/dedupe';

import { BaseControl, Button, Dropdown } from '@wordpress/components';

/**
 * Component
 *
 * @param props
 */
export default function DropdownPicker(props) {
	const {
		label,
		className,
		contentClassName,
		onClick,
		open,
		onToggle,
		children,
	} = props;

	return (
		<BaseControl
			className="ghostkit-component-dropdown-picker-wrapper"
			__nextHasNoMarginBottom
		>
			<Dropdown
				className={classnames(
					'ghostkit-component-dropdown-picker__dropdown',
					className
				)}
				contentClassName={classnames(
					'ghostkit-component-dropdown-picker__dropdown-content',
					contentClassName
				)}
				popoverProps={{
					placement: 'left-start',
					offset: 36,
					shift: true,
				}}
				open={open}
				onToggle={onToggle}
				renderToggle={({ isOpen, onToggle: toggle }) => (
					<Button
						className={classnames(
							'ghostkit-component-dropdown-picker-toggle',
							isOpen
								? 'ghostkit-component-dropdown-picker-toggle-active'
								: ''
						)}
						onClick={(e) => {
							if (onClick) {
								onClick(toggle, isOpen, e);
							} else {
								toggle();
							}
						}}
					>
						<span className="ghostkit-component-dropdown-picker-toggle-label">
							{label}
						</span>
					</Button>
				)}
				renderContent={() => children}
			/>
		</BaseControl>
	);
}
