import { BaseControl, Button, Dropdown } from '@wordpress/components';
import classnames from 'classnames/dedupe';

/**
 * Component
 *
 * @param props
 */
export default function DropdownPicker(props) {
	const {
		label,
		indicator,
		value,
		className,
		contentClassName,
		onClick,
		open,
		onToggle,
		children,
	} = props;

	return (
		<BaseControl className="ghostkit-component-dropdown-picker-wrapper">
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
						aria-expanded={isOpen}
						onClick={(e) => {
							if (onClick) {
								onClick(toggle, isOpen, e);
							} else {
								toggle();
							}
						}}
					>
						{indicator && (
							<span className="ghostkit-component-dropdown-picker-toggle-indicator">
								{indicator}
							</span>
						)}
						<span className="ghostkit-component-dropdown-picker-toggle-label">
							{label}
						</span>
						{value && (
							<span className="ghostkit-component-dropdown-picker-toggle-value">
								{value}
							</span>
						)}
					</Button>
				)}
				renderContent={() => children}
			/>
		</BaseControl>
	);
}
