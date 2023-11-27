/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { PanelRow, Button } from '@wordpress/components';

export default function ButtonClearMedia({
  nameAttributes,
  setAttributes,
  children = __('Clear Media', 'ghostkit'),
}) {
  const handleClick = (e) => {
    const clearAttributes = {};
    nameAttributes.forEach((name) => {
      clearAttributes[name] = '';
    });
    setAttributes(clearAttributes);

    e.preventDefault();
  };

  return (
    <PanelRow>
      <Button
        variant="secondary"
        size="small"
        onClick={handleClick}
        className="is-small"
        style={{ marginLeft: 'auto' }}
      >
        {children}
      </Button>
    </PanelRow>
  );
}
