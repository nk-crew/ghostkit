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

const { Component, Fragment } = wp.element;

const { PanelBody, TextControl, ToggleControl } = wp.components;

const { InspectorControls, RichText } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes } = this.props;

    const {
      description,
      emailConfirmation,
      descriptionConfirmation,
      placeholderConfirmation,
      defaultConfirmation,
    } = attributes;

    let { className = '' } = this.props;

    className = classnames('ghostkit-form-field ghostkit-form-field-email', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <FieldDefaultSettings {...this.props} />
          </PanelBody>
          <PanelBody title={__('Email Confirmation', '@@text_domain')}>
            <ToggleControl
              label={__('Yes', '@@text_domain')}
              checked={emailConfirmation}
              onChange={() => {
                if (emailConfirmation) {
                  setAttributes({ emailConfirmation: !emailConfirmation });
                } else {
                  setAttributes({
                    emailConfirmation: !emailConfirmation,
                    description: description || __('Email', '@@text_domain'),
                    descriptionConfirmation:
                      descriptionConfirmation || __('Confirm Email', '@@text_domain'),
                  });
                }
              }}
            />
            {emailConfirmation ? (
              <Fragment>
                <TextControl
                  label={__('Placeholder', '@@text_domain')}
                  value={placeholderConfirmation}
                  onChange={(val) => setAttributes({ placeholderConfirmation: val })}
                />
                <TextControl
                  label={__('Default', '@@text_domain')}
                  value={defaultConfirmation}
                  onChange={(val) => setAttributes({ defaultConfirmation: val })}
                />
              </Fragment>
            ) : (
              ''
            )}
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          <FieldLabel {...this.props} />

          {emailConfirmation ? (
            <div className="ghostkit-form-field-row">
              <div className="ghostkit-form-field-email-primary">
                <TextControl type="email" {...getFieldAttributes(attributes)} />
                <FieldDescription {...this.props} />
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
                  tagName="small"
                  className="ghostkit-form-field-description"
                  value={descriptionConfirmation}
                  placeholder={__('Write description…', '@@text_domain')}
                  onChange={(val) => setAttributes({ descriptionConfirmation: val })}
                />
              </div>
            </div>
          ) : (
            <Fragment>
              <TextControl type="email" {...getFieldAttributes(attributes)} />
              <FieldDescription {...this.props} />
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}

export default BlockEdit;
