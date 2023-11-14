/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';
import FieldDescription from '../../field-description';
import { getFieldAttributes, FieldDefaultSettings } from '../../field-attributes';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { applyFilters } = wp.hooks;

const { Fragment } = wp.element;

const { PanelBody, TextareaControl } = wp.components;

const { InspectorControls, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;

  const { default: defaultVal } = attributes;

  let { className = '' } = props;

  className = classnames('ghostkit-form-field ghostkit-form-field-textarea', className);
  className = applyFilters('ghostkit.editor.className', className, props);

  const defaultCustom = (
    <TextareaControl
      label={__('Default', '@@text_domain')}
      value={defaultVal}
      onChange={(val) => setAttributes({ default: val })}
    />
  );

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <FieldDefaultSettings {...props} defaultCustom={defaultCustom} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />
        <TextareaControl {...getFieldAttributes(attributes)} />
        <FieldDescription {...props} />
      </div>
    </Fragment>
  );
}
