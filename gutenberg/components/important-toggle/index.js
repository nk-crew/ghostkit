/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Tooltip, Button } = wp.components;

/**
 * Component Class
 */
export default function ImportantToggle(props) {
  const { onClick, isActive } = props;

  return (
    <Tooltip text={__('!important', '@@text_domain')}>
      <Button
        className={classnames('ghostkit-control-important-toggle', isActive && 'is-active')}
        onClick={() => {
          onClick(!isActive);
        }}
      >
        !
      </Button>
    </Tooltip>
  );
}
