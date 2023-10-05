/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Dropdown, Button, BaseControl } = wp.components;

/**
 * Component
 */
export default function DropdownPicker(props) {
  const { label, className, contentClassName, onClick, children } = props;

  return (
    <BaseControl className="ghostkit-component-dropdown-picker-wrapper">
      <Dropdown
        className={classnames('ghostkit-component-dropdown-picker__dropdown', className)}
        contentClassName={classnames(
          'ghostkit-component-dropdown-picker__dropdown-content',
          contentClassName
        )}
        popoverProps={{
          placement: 'left-start',
          offset: 36,
          shift: true,
        }}
        renderToggle={({ isOpen, onToggle }) => (
          <Button
            className={classnames(
              'ghostkit-component-dropdown-picker-toggle',
              isOpen ? 'ghostkit-component-dropdown-picker-toggle-active' : ''
            )}
            onClick={(e) => {
              if (onClick) {
                onClick(onToggle, isOpen, e);
              } else {
                onToggle();
              }
            }}
          >
            <span className="ghostkit-component-dropdown-picker-toggle-label">{label}</span>
          </Button>
        )}
        renderContent={() => children}
      />
    </BaseControl>
  );
}
