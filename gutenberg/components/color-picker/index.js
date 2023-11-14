/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPalette from '../color-palette';

/**
 * WordPress dependencies
 */
const { Dropdown, Button, BaseControl } = wp.components;

/**
 * Component
 */
export default function ColorPicker(props) {
  const {
    value,
    onChange,
    label,
    colorPalette = true,
    alpha = false,
    gradient = false, // PRO.
    afterDropdownContent,
  } = props;

  return (
    <BaseControl className="ghostkit-component-color-picker-wrapper">
      <Dropdown
        className="ghostkit-component-color-picker__dropdown"
        contentClassName="ghostkit-component-color-picker__dropdown-content"
        popoverProps={{
          placement: 'left-start',
          offset: 36,
          shift: true,
        }}
        renderToggle={({ isOpen, onToggle }) => (
          <Button
            className={classnames(
              'ghostkit-component-color-toggle',
              isOpen ? 'ghostkit-component-color-toggle-active' : ''
            )}
            onClick={onToggle}
          >
            <span
              className="ghostkit-component-color-toggle-indicator"
              style={{ background: value || '' }}
            />
            <span className="ghostkit-component-color-toggle-label">{label}</span>
          </Button>
        )}
        renderContent={() => (
          <div className="ghostkit-component-color-picker">
            <ColorPalette
              value={value}
              palette={colorPalette}
              alpha={alpha}
              gradient={gradient}
              onChange={(color) => {
                onChange(color || '');
              }}
            />
            {afterDropdownContent || ''}
          </div>
        )}
      />
    </BaseControl>
  );
}
