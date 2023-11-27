/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Tooltip, Button } from '@wordpress/components';

/**
 * Component Class
 */
export default function ImportantToggle(props) {
  const { onClick, isActive } = props;

  return (
    <Tooltip text={__('!important', 'ghostkit')}>
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
