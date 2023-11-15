/**
 * External dependencies.
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies.
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies.
 */
const { useState } = wp.element;

const { Button } = wp.components;

/**
 * Component
 */
export default function ProNote(props) {
  const { title, children } = props;

  const [collapsed, setCollapsed] = useState(props.collapsed);

  return (
    <div
      className={classnames(
        'ghostkit-pro-component-note',
        collapsed && 'ghostkit-pro-component-note-collapsed'
      )}
    >
      <div className="ghostkit-pro-component-note-inner">
        {title && <h3>{title}</h3>}
        {collapsed && (
          <Button
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {getIcon('icon-arrow-right')}
          </Button>
        )}
        {!collapsed && children && <div>{children}</div>}
      </div>
    </div>
  );
}

/**
 * Button Component Class
 */
ProNote.Button = function ProNoteButton(props) {
  const { children } = props;

  return (
    <a className="ghostkit-pro-component-note-button" {...props}>
      {children}
    </a>
  );
};
