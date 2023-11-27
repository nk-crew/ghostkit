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

import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;

  const {
    description,
    emailConfirmation,
    descriptionConfirmation,
    placeholderConfirmation,
    defaultConfirmation,
  } = attributes;

  let { className = '' } = props;

  className = classnames('ghostkit-form-field ghostkit-form-field-email', className);
  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <FieldDefaultSettings {...props} />
        </PanelBody>
        <PanelBody title={__('Email Confirmation', 'ghostkit')}>
          <ToggleControl
            label={__('Yes', 'ghostkit')}
            checked={emailConfirmation}
            onChange={() => {
              if (emailConfirmation) {
                setAttributes({ emailConfirmation: !emailConfirmation });
              } else {
                setAttributes({
                  emailConfirmation: !emailConfirmation,
                  description: description || __('Email', 'ghostkit'),
                  descriptionConfirmation:
                    descriptionConfirmation || __('Confirm Email', 'ghostkit'),
                });
              }
            }}
          />
          {emailConfirmation ? (
            <Fragment>
              <TextControl
                label={__('Placeholder', 'ghostkit')}
                value={placeholderConfirmation}
                onChange={(val) => setAttributes({ placeholderConfirmation: val })}
              />
              <TextControl
                label={__('Default', 'ghostkit')}
                value={defaultConfirmation}
                onChange={(val) => setAttributes({ defaultConfirmation: val })}
              />
            </Fragment>
          ) : (
            ''
          )}
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />

        {emailConfirmation ? (
          <div className="ghostkit-form-field-row">
            <div className="ghostkit-form-field-email-primary">
              <TextControl type="email" {...getFieldAttributes(attributes)} />
              <FieldDescription {...props} />
            </div>
            <div className="ghostkit-form-field-email-confirm">
              <TextControl
                type="email"
                {...getFieldAttributes({
                  slug: attributes.slug ? `${attributes.slug}-confirmation` : null,
                  placeholder: attributes.placeholderConfirmation,
                  default: attributes.defaultConfirmation,
                  required: attributes.required,
                })}
              />
              <RichText
                inlineToolbar
                tagName="small"
                className="ghostkit-form-field-description"
                value={descriptionConfirmation}
                placeholder={__('Write description…', 'ghostkit')}
                onChange={(val) => setAttributes({ descriptionConfirmation: val })}
              />
            </div>
          </div>
        ) : (
          <Fragment>
            <TextControl type="email" {...getFieldAttributes(attributes)} />
            <FieldDescription {...props} />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
