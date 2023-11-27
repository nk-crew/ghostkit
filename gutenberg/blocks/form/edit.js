/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import ToggleGroup from '../../components/toggle-group';

import RecaptchaSettings from './recaptcha';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';

import { useEffect, Fragment } from '@wordpress/element';

import { useSelect, useDispatch } from '@wordpress/data';

import { BaseControl, PanelBody, TextControl, TextareaControl, ToggleControl } from '@wordpress/components';

import { InspectorControls, useBlockProps, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
  ['ghostkit/form-field-name', { slug: 'field_name' }],
  ['ghostkit/form-field-email', { slug: 'field_email', required: true }],
  [
    'ghostkit/form-field-text',
    { slug: 'field_subject', label: __('Subject', 'ghostkit'), required: true },
  ],
  [
    'ghostkit/form-field-textarea',
    { slug: 'field_message', label: __('Message', 'ghostkit'), required: true },
  ],
  ['ghostkit/form-submit-button'],
];
const ALLOWED_BLOCKS = [
  'core/paragraph',
  'core/heading',
  'core/list',
  'core/divider',
  'ghostkit/divider',
];

/**
 * Parse all Form inner blocks and get Fields data.
 *
 * @param {Object} formData Form block data.
 *
 * @return {Array} - fields list.
 */
function getAllFieldsData(formData) {
  let result = [];

  if (formData.innerBlocks && formData.innerBlocks.length) {
    formData.innerBlocks.forEach((block) => {
      // field data.
      if (block.name && /^ghostkit\/form-field/g.test(block.name)) {
        result.push({
          clientId: block.clientId,
          name: block.name,
          type: block.name.replace(/^ghostkit\/form-field-/g, ''),
          attributes: block.attributes,
        });
      }

      // inner blocks.
      if (block.innerBlocks && block.innerBlocks.length) {
        result = [...result, ...getAllFieldsData(block)];
      }
    });
  }

  return result;
}

/**
 * Get unique field slug.
 *
 * @param {Object} data - field data.
 * @param {Object} uniqueIds - all available uniqu IDs.
 *
 * @return {String} - unique slug.
 */
function getUniqueFieldSlug(data, uniqueIds) {
  let newSlug = `field_${data.type}`;

  // check if slug already exist.
  let tryCount = 100;
  let i = 0;
  while (typeof uniqueIds[data.type][newSlug] !== 'undefined' && tryCount > 0) {
    i += 1;
    tryCount -= 1;
    newSlug = `field_${data.type}_${i}`;
  }

  return newSlug;
}

/**
 * Block Edit component.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, clientId } = props;

  let { className = '' } = props;

  const {
    mailAllow,
    mailTo,
    mailSubject,
    mailFrom,
    mailReplyTo,
    mailMessage,

    confirmationType,
    confirmationMessage,
    confirmationRedirect,
  } = attributes;

  const { isSelectedBlockInRoot, allFieldsData } = useSelect(
    (select) => {
      const { getBlock, isBlockSelected, hasSelectedInnerBlock } = select('core/block-editor');

      return {
        allFieldsData: getAllFieldsData(getBlock(clientId)),
        isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
      };
    },
    [clientId]
  );

  const { updateBlockAttributes } = useDispatch('core/block-editor');

  function updateFieldsSlugs() {
    const uniqueIds = {};

    // Collect all available slugs.
    allFieldsData.forEach((data) => {
      if (!uniqueIds[data.type]) {
        uniqueIds[data.type] = {};
      }
      if (data.attributes.slug) {
        // Slug already exist.
        if (typeof uniqueIds[data.type][data.attributes.slug] !== 'undefined') {
          const newSlug = getUniqueFieldSlug(data, uniqueIds);

          uniqueIds[data.type][newSlug] = true;

          updateBlockAttributes(data.clientId, {
            slug: newSlug,
          });
        } else {
          uniqueIds[data.type][data.attributes.slug] = true;
        }
      }
    });

    // Generate slugs for new fields.
    allFieldsData.forEach((data) => {
      if (!uniqueIds[data.type]) {
        uniqueIds[data.type] = {};
      }

      if (!data.attributes.slug) {
        const newSlug = getUniqueFieldSlug(data, uniqueIds);

        uniqueIds[data.type][newSlug] = true;

        updateBlockAttributes(data.clientId, {
          slug: newSlug,
        });
      }
    });
  }

  const maybeUpdateFieldSlug = throttle(200, () => {
    updateFieldsSlugs();
  });

  // Mount and update.
  useEffect(() => {
    maybeUpdateFieldSlug();
  });

  className = classnames(className, 'ghostkit-form');
  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });
  const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps, {
    template: TEMPLATE,
    allowedBlocks: ALLOWED_BLOCKS,
    renderAppender: () => null,
  });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Mail', 'ghostkit')}>
          {mailAllow ? (
            <Fragment>
              <TextControl
                label={__('Send To Email Address', 'ghostkit')}
                value={mailTo}
                onChange={(val) => setAttributes({ mailTo: val })}
              />
              <TextControl
                label={__('Subject', 'ghostkit')}
                value={mailSubject}
                onChange={(val) => setAttributes({ mailSubject: val })}
              />
              <TextControl
                label={__('From', 'ghostkit')}
                value={mailFrom}
                onChange={(val) => setAttributes({ mailFrom: val })}
              />
              <TextControl
                label={__('Reply To', 'ghostkit')}
                value={mailReplyTo}
                onChange={(val) => setAttributes({ mailReplyTo: val })}
              />
              <TextareaControl
                label={__('Message', 'ghostkit')}
                value={mailMessage}
                onChange={(val) => setAttributes({ mailMessage: val })}
              />
            </Fragment>
          ) : (
            ''
          )}
          <BaseControl
            label={__('Send Email', 'ghostkit')}
            help={__(
              "In case if you don't want to receive email messages from this form, you may disable sending emails functionality."
            )}
          >
            <ToggleControl
              Label={__('Yes', 'ghostkit')}
              checked={!!mailAllow}
              onChange={() => setAttributes({ mailAllow: !mailAllow })}
            />
          </BaseControl>
        </PanelBody>
        <PanelBody title={__('Confirmation', 'ghostkit')}>
          <ToggleGroup
            label={__('Type', 'ghostkit')}
            value={confirmationType}
            options={[
              {
                label: __('Message', 'ghostkit'),
                value: 'message',
              },
              {
                label: __('Redirect', 'ghostkit'),
                value: 'redirect',
              },
            ]}
            onChange={(value) => {
              setAttributes({ confirmationType: value });
            }}
            isDeselectable
          />

          {!confirmationType || confirmationType === 'message' ? (
            <TextareaControl
              label={__('Message', 'ghostkit')}
              value={confirmationMessage}
              onChange={(val) => setAttributes({ confirmationMessage: val })}
            />
          ) : (
            ''
          )}
          {confirmationType === 'redirect' ? (
            <TextControl
              label={__('Redirect URL', 'ghostkit')}
              value={confirmationRedirect}
              onChange={(val) => setAttributes({ confirmationRedirect: val })}
            />
          ) : (
            ''
          )}
        </PanelBody>
        <RecaptchaSettings />
      </InspectorControls>
      <div {...innerBlockProps}>
        {children}
        {isSelectedBlockInRoot ? <InnerBlocks.ButtonBlockAppender /> : ''}
      </div>
    </Fragment>
  );
}
