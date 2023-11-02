/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Button } = wp.components;

/**
 * Component Class
 */
export default function ElementStateToggle(props) {
  const { isHover, onChange } = props;

  return (
    <Button
      className="ghostkit-control-element-state-toggle"
      onClick={() => {
        onChange(!isHover);
      }}
    >
      {getIcon('icon-pointer')}
      {isHover && <span>{__(':hover', '@@text_domain')}</span>}
    </Button>
  );
}
