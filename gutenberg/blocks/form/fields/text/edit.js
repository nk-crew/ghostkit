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
import { applyFilters } from '@wordpress/hooks';

import { Fragment } from '@wordpress/element';

import { PanelBody, TextControl } from '@wordpress/components';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes } = props;

  let { className = '' } = props;

  className = classnames('ghostkit-form-field ghostkit-form-field-text', className);
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
        <TextControl {...getFieldAttributes(attributes)} />
        <FieldDescription {...props} />
      </div>
    </Fragment>
  );
}
