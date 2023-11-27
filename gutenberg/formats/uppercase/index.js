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

export const name = 'ghostkit/uppercase';

export const settings = {
  title: __('Uppercase', 'ghostkit'),
  tagName: 'span',
  className: 'ghostkit-text-uppercase',
  edit: function BadgeFormat(props) {
    const { value, onChange, isActive } = props;

    function toggleUppercase() {
      onChange(
        toggleFormat(value, {
          type: name,
        })
      );
    }

    return (
      <Fragment>
        <RichTextShortcut type="access" character="u" onUse={() => toggleUppercase()} />
        <RichTextToolbarButton
          shortcutCharacter="u"
          shortcutType="access"
          title={__('Uppercase', 'ghostkit')}
          icon={getIcon('icon-text-uppercase')}
          onClick={() => toggleUppercase()}
          isActive={isActive}
        />
      </Fragment>
    );
  },
};
