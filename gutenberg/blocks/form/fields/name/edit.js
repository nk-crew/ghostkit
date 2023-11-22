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

import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;

  const {
    description,
    nameFields,
    descriptionLast,
    placeholderLast,
    defaultLast,
    descriptionMiddle,
    placeholderMiddle,
    defaultMiddle,
  } = attributes;

  let { className = '' } = props;

  className = classnames(
    'ghostkit-form-field ghostkit-form-field-name',
    nameFields === 'first-middle-last' || nameFields === 'first-last'
      ? 'ghostkit-form-field-name-with-last'
      : '',
    nameFields === 'first-middle-last' ? 'ghostkit-form-field-name-with-middle' : '',
    className
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <FieldDefaultSettings {...props} />
        </PanelBody>
        <PanelBody title={__('Name Fields', '@@text_domain')}>
          <SelectControl
            options={[
              {
                label: 'First',
                value: 'first',
              },
              {
                label: 'First Last',
                value: 'first-last',
              },
              {
                label: 'First Middle Last',
                value: 'first-middle-last',
              },
            ]}
            value={nameFields}
            onChange={(val) => {
              if (val === 'first-last') {
                setAttributes({
                  nameFields: val,
                  description: description || __('First', '@@text_domain'),
                  descriptionLast: descriptionLast || __('Last', '@@text_domain'),
                });
              } else if (val === 'first-middle-last') {
                setAttributes({
                  nameFields: val,
                  description: description || __('First', '@@text_domain'),
                  descriptionLast: descriptionLast || __('Last', '@@text_domain'),
                  descriptionMiddle: descriptionMiddle || __('Middle', '@@text_domain'),
                });
              } else {
                setAttributes({ nameFields: val });
              }
            }}
          />
          {nameFields === 'first-middle-last' ? (
            <Fragment>
              <TextControl
                label={__('Middle Placeholder', '@@text_domain')}
                value={placeholderMiddle}
                onChange={(val) => setAttributes({ placeholderMiddle: val })}
              />
              <TextControl
                label={__('Middle Default', '@@text_domain')}
                value={defaultMiddle}
                onChange={(val) => setAttributes({ defaultMiddle: val })}
              />
            </Fragment>
          ) : (
            ''
          )}
          {nameFields === 'first-middle-last' || nameFields === 'first-last' ? (
            <Fragment>
              <TextControl
                label={__('Last Placeholder', '@@text_domain')}
                value={placeholderLast}
                onChange={(val) => setAttributes({ placeholderLast: val })}
              />
              <TextControl
                label={__('Last Default', '@@text_domain')}
                value={defaultLast}
                onChange={(val) => setAttributes({ defaultLast: val })}
              />
            </Fragment>
          ) : (
            ''
          )}
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <FieldLabel {...props} />

        {nameFields === 'first-middle-last' || nameFields === 'first-last' ? (
          <div className="ghostkit-form-field-row">
            <div className="ghostkit-form-field-name-first">
              <TextControl type="email" {...getFieldAttributes(attributes)} />
              <FieldDescription {...props} />
            </div>
            {nameFields === 'first-middle-last' ? (
              <div className="ghostkit-form-field-name-middle">
                <TextControl
                  type="email"
                  {...getFieldAttributes({
                    slug: attributes.slug ? `${attributes.slug}-middle` : null,
                    placeholder: attributes.placeholderMiddle,
                    default: attributes.defaultMiddle,
                    required: attributes.required,
                  })}
                />
                <RichText
                  inlineToolbar
                  tagName="small"
                  className="ghostkit-form-field-description"
                  value={descriptionMiddle}
                  placeholder={__('Write description…', '@@text_domain')}
                  onChange={(val) => setAttributes({ descriptionMiddle: val })}
                />
              </div>
            ) : (
              ''
            )}
            {nameFields === 'first-middle-last' || nameFields === 'first-last' ? (
              <div className="ghostkit-form-field-name-last">
                <TextControl
                  type="email"
                  {...getFieldAttributes({
                    slug: attributes.slug ? `${attributes.slug}-last` : null,
                    placeholder: attributes.placeholderLast,
                    default: attributes.defaultLast,
                    required: attributes.required,
                  })}
                />
                <RichText
                  inlineToolbar
                  tagName="small"
                  className="ghostkit-form-field-description"
                  value={descriptionLast}
                  placeholder={__('Write description…', '@@text_domain')}
                  onChange={(val) => setAttributes({ descriptionLast: val })}
                />
              </div>
            ) : (
              ''
            )}
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
