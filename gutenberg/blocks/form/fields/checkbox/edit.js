/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';
import FieldDescription from '../../field-description';
import FieldOptions from '../../field-options';
import { getFieldAttributes, FieldDefaultSettings } from '../../field-attributes';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { applyFilters } from '@wordpress/hooks';

import { Fragment } from '@wordpress/element';

import { PanelBody, ToggleControl } from '@wordpress/components';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Block Edit component.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

  const { slug, inline } = attributes;

  let { options } = attributes;

  let { className = '' } = props;

  className = classnames(
    'ghostkit-form-field ghostkit-form-field-checkbox',
    inline ? 'ghostkit-form-field-checkbox-inline' : '',
    className
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  if (!options || !options.length) {
    options = [
      {
        label: '',
        value: '',
        selected: false,
      },
    ];
  }

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <FieldDefaultSettings {...props} defaultCustom={' '} placeholderCustom={' '} />
          <ToggleControl
            label={__('Inline', '@@text_domain')}
            checked={inline}
            onChange={() => setAttributes({ inline: !inline })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />

        {isSelected ? (
          <FieldOptions
            options={options}
            onChange={(val) => setAttributes({ options: val })}
            multiple
          />
        ) : (
          <div className="ghostkit-form-field-checkbox-items">
            {options.map((data, i) => {
              const itemName = `${slug}-item-${i}`;

              return (
                <label
                  key={itemName}
                  htmlFor={itemName}
                  className="ghostkit-form-field-checkbox-item"
                >
                  <input
                    type="checkbox"
                    checked={data.selected}
                    onChange={() => {}}
                    {...getFieldAttributes(attributes)}
                  />
                  {data.label}
                </label>
              );
            })}
          </div>
        )}

        <FieldDescription {...props} />
      </div>
    </Fragment>
  );
}
