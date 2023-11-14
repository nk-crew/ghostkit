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
const { __ } = wp.i18n;

const { applyFilters } = wp.hooks;

const { Fragment } = wp.element;

const { PanelBody, ToggleControl } = wp.components;

const { InspectorControls, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

  const { slug, inline } = attributes;

  let { options } = attributes;

  let { className = '' } = props;

  className = classnames(
    'ghostkit-form-field ghostkit-form-field-radio',
    inline ? 'ghostkit-form-field-radio-inline' : '',
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

  let selectVal = '';

  options.forEach((data) => {
    if (!selectVal && data.selected) {
      selectVal = data.value;
    }
  });

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
          <FieldOptions options={options} onChange={(val) => setAttributes({ options: val })} />
        ) : (
          <div className="ghostkit-form-field-radio-items">
            {options.map((data, i) => {
              const fieldName = `${slug}-item-${i}`;
              return (
                <label
                  key={fieldName}
                  htmlFor={fieldName}
                  className="ghostkit-form-field-radio-item"
                >
                  <input
                    type="radio"
                    checked={selectVal === data.value}
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
