/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Fragment } = wp.element;

const { RichTextToolbarButton, RichTextShortcut } = wp.blockEditor;

const { toggleFormat } = wp.richText;

export const name = 'ghostkit/uppercase';

export const settings = {
  title: __('Uppercase', '@@text_domain'),
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
          title={__('Uppercase', '@@text_domain')}
          icon={getIcon('icon-text-uppercase')}
          onClick={() => toggleUppercase()}
          isActive={isActive}
        />
      </Fragment>
    );
  },
};
