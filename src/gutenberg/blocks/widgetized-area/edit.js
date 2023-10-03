/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Placeholder, SelectControl } = wp.components;

const { useBlockProps } = wp.blockEditor;

const { GHOSTKIT } = window;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { setAttributes, attributes } = props;

  let { className } = props;

  const { id } = attributes;

  className = classnames('ghostkit-widgetized-area', className);

  const blockProps = useBlockProps({ className });

  return (
    <div {...blockProps}>
      <Placeholder
        icon={getIcon('block-widgetized-area')}
        label={__('Widgetized Area', '@@text_domain')}
      >
        <SelectControl
          value={id}
          onChange={(value) => setAttributes({ id: value })}
          options={(() => {
            const sidebars = [
              {
                label: __('--- Select Sidebar ---', '@@text_domain'),
                value: '',
              },
            ];

            if (GHOSTKIT.sidebars) {
              Object.keys(GHOSTKIT.sidebars).forEach((k) => {
                sidebars.push({
                  label: GHOSTKIT.sidebars[k].name,
                  value: GHOSTKIT.sidebars[k].id,
                });
              });
            }

            return sidebars;
          })()}
        />
      </Placeholder>
    </div>
  );
}
