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

const { PanelBody, SelectControl, ToggleControl } = wp.components;

const { InspectorControls, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

  const { multiple } = attributes;

  let { options } = attributes;

  let { className = '' } = props;

  className = classnames('ghostkit-form-field ghostkit-form-field-select', className);

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

  let selectVal = multiple ? [] : '';

  options.forEach((data) => {
    if (multiple && data.selected) {
      selectVal.push(data.value);
    } else if (!multiple && !selectVal && data.selected) {
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
            label={__('Multiple', '@@text_domain')}
            checked={multiple}
            onChange={() => {
              if (multiple) {
                const newOptions = [...options];
                let singleSelected = false;

                newOptions.forEach((data, i) => {
                  if (data.selected) {
                    if (singleSelected) {
                      newOptions[i].selected = false;
                    }

                    singleSelected = true;
                  }
                });

                setAttributes({
                  multiple: !multiple,
                  options: newOptions,
                });
              } else {
                setAttributes({ multiple: !multiple });
              }
            }}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />

        {isSelected ? (
          <FieldOptions
            options={options}
            multiple={multiple}
            onChange={(val) => setAttributes({ options: val })}
          />
        ) : (
          <SelectControl
            {...getFieldAttributes(attributes)}
            value={selectVal}
            options={(() => {
              if (!multiple) {
                let addNullOption = true;

                Object.keys(options).forEach((data) => {
                  if (data.selected) {
                    addNullOption = false;
                  }
                });

                if (addNullOption) {
                  return [
                    {
                      label: __('--- Select ---', '@@text_domain'),
                      value: '',
                      selected: true,
                    },
                    ...options,
                  ];
                }
              }

              return options;
            })()}
          />
        )}

        <FieldDescription {...props} />
      </div>
    </Fragment>
  );
}
