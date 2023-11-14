/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { useState } = wp.element;

const { __ } = wp.i18n;

const { Button, Popover } = wp.components;

/**
 * Component Class
 */
export default function RemoveButton(props) {
  const [confirmed, setConfirmed] = useState(-1);

  const {
    onRemove,
    show,
    style,
    tooltipText = __('Remove Block?', '@@text_domain'),
    tooltipRemoveText = __('Remove', '@@text_domain'),
    tooltipCancelText = __('Cancel', '@@text_domain'),
  } = props;

  if (!show) {
    return null;
  }

  return (
    <Button
      className="ghostkit-component-remove-button"
      onClick={() => {
        if (confirmed === -1) {
          setConfirmed(0);
        }
      }}
      style={style}
    >
      {confirmed === 0 ? (
        <Popover
          className="ghostkit-component-remove-button-confirm"
          onClose={() => {
            setConfirmed(-1);
          }}
          onFocusOutside={() => {
            setConfirmed(-1);
          }}
        >
          {tooltipText}
          <Button className="ghostkit-component-remove-button-confirm-yep" onClick={onRemove}>
            {tooltipRemoveText}
          </Button>
          <Button
            className="ghostkit-component-remove-button-confirm-nope"
            onClick={() => {
              setConfirmed(-1);
            }}
          >
            {tooltipCancelText}
          </Button>
        </Popover>
      ) : null}
      {getIcon('icon-trash')}
    </Button>
  );
}
