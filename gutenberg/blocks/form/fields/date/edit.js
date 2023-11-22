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
import { __ } from '@wordpress/i18n';

import { applyFilters } from '@wordpress/hooks';

import { Fragment } from '@wordpress/element';

import { PanelBody, TextControl } from '@wordpress/components';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;

  const { min, max, default: defaultVal } = attributes;

  let { className = '' } = props;

  className = classnames('ghostkit-form-field ghostkit-form-field-date', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  const defaultCustom = (
    <TextControl
      type="date"
      label={__('Default', '@@text_domain')}
      value={defaultVal}
      onChange={(val) => setAttributes({ default: val })}
      max={max}
      min={min}
    />
  );

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <FieldDefaultSettings {...props} defaultCustom={defaultCustom} />
        </PanelBody>
        <PanelBody title={__('Date Settings', '@@text_domain')}>
          <TextControl
            type="date"
            label={__('Min', '@@text_domain')}
            value={min}
            onChange={(val) => setAttributes({ min: val })}
            max={max}
          />
          <TextControl
            type="date"
            label={__('Max', '@@text_domain')}
            value={max}
            onChange={(val) => setAttributes({ max: val })}
            min={min}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />
        <TextControl type="date" {...getFieldAttributes(attributes)} />
        <FieldDescription {...props} />
      </div>
    </Fragment>
  );
}
