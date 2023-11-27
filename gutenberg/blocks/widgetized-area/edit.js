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
import { __ } from '@wordpress/i18n';

import { Placeholder, SelectControl } from '@wordpress/components';

import { useBlockProps } from '@wordpress/block-editor';

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
        label={__('Widgetized Area', 'ghostkit')}
      >
        <SelectControl
          value={id}
          onChange={(value) => setAttributes({ id: value })}
          options={(() => {
            const sidebars = [
              {
                label: __('--- Select Sidebar ---', 'ghostkit'),
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
