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
const { applyFilters } = wp.hooks;

const { Fragment } = wp.element;

const { PanelBody, TextControl } = wp.components;

const { InspectorControls, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes } = props;

  let { className = '' } = props;

  className = classnames('ghostkit-form-field ghostkit-form-field-phone', className);
  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <FieldDefaultSettings {...props} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />
        <TextControl type="tel" {...getFieldAttributes(attributes)} />
        <FieldDescription {...props} />
      </div>
    </Fragment>
  );
}
