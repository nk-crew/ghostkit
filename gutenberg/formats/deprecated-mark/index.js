/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Fragment } from '@wordpress/element';

import { RichTextToolbarButton, RichTextShortcut } from '@wordpress/block-editor';

import { toggleFormat } from '@wordpress/rich-text';

export const name = 'ghostkit/mark';

export const settings = {
  title: __('Highlight', '@@text_domain'),
  tagName: 'mark',
  className: 'ghostkit-highlight',
  edit: function HighlightFormat(props) {
    const { value, onChange, isActive } = props;

    function toggleMark() {
      onChange(
        toggleFormat(value, {
          type: name,
        })
      );
    }

    // Since this format is deprecated, we don't need to display it in UI.
    if (!isActive) {
      return null;
    }

    return (
      <Fragment>
        <RichTextShortcut type="access" character="m" onUse={() => toggleMark()} />
        <RichTextToolbarButton
          shortcutCharacter="m"
          shortcutType="access"
          title={__('Highlight', '@@text_domain')}
          icon={getIcon('icon-felt-pen')}
          onClick={() => toggleMark()}
          isActive={isActive}
        />
      </Fragment>
    );
  },
};
