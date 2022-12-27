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
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { BaseControl, PanelBody, TextControl, TextareaControl, ToggleControl } = wp.components;

const { InspectorControls, InnerBlocks } = wp.blockEditor;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

const TEMPLATE = [
  ['ghostkit/form-field-name', { slug: 'field_name' }],
  ['ghostkit/form-field-email', { slug: 'field_email', required: true }],
  [
    'ghostkit/form-field-text',
    { slug: 'field_subject', label: __('Subject', '@@text_domain'), required: true },
  ],
  [
    'ghostkit/form-field-textarea',
    { slug: 'field_message', label: __('Message', '@@text_domain'), required: true },
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
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.maybeUpdateFieldSlug = throttle(200, this.maybeUpdateFieldSlug.bind(this));
  }

  componentDidMount() {
    this.maybeUpdateFieldSlug();
  }

  componentDidUpdate() {
    this.maybeUpdateFieldSlug();
  }

  maybeUpdateFieldSlug() {
    this.props.updateFieldsSlugs();
  }

  render() {
    const { attributes, setAttributes, isSelectedBlockInRoot } = this.props;

    let { className = '' } = this.props;

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

    className = classnames(className, 'ghostkit-form');

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={__('Mail', '@@text_domain')}>
            {mailAllow ? (
              <Fragment>
                <TextControl
                  label={__('Send To Email Address', '@@text_domain')}
                  value={mailTo}
                  onChange={(val) => setAttributes({ mailTo: val })}
                />
                <TextControl
                  label={__('Subject', '@@text_domain')}
                  value={mailSubject}
                  onChange={(val) => setAttributes({ mailSubject: val })}
                />
                <TextControl
                  label={__('From', '@@text_domain')}
                  value={mailFrom}
                  onChange={(val) => setAttributes({ mailFrom: val })}
                />
                <TextControl
                  label={__('Reply To', '@@text_domain')}
                  value={mailReplyTo}
                  onChange={(val) => setAttributes({ mailReplyTo: val })}
                />
                <TextareaControl
                  label={__('Message', '@@text_domain')}
                  value={mailMessage}
                  onChange={(val) => setAttributes({ mailMessage: val })}
                />
              </Fragment>
            ) : (
              ''
            )}
            <BaseControl
              label={__('Send Email', '@@text_domain')}
              help={__(
                "In case if you don't want to receive email messages from this form, you may disable sending emails functionality."
              )}
            >
              <ToggleControl
                Label={__('Yes', '@@text_domain')}
                checked={!!mailAllow}
                onChange={() => setAttributes({ mailAllow: !mailAllow })}
              />
            </BaseControl>
          </PanelBody>
          <PanelBody title={__('Confirmation', '@@text_domain')}>
            <ToggleGroup
              label={__('Type', '@@text_domain')}
              value={confirmationType}
              options={[
                {
                  label: __('Message', '@@text_domain'),
                  value: 'message',
                },
                {
                  label: __('Redirect', '@@text_domain'),
                  value: 'redirect',
                },
              ]}
              onChange={(value) => {
                setAttributes({ confirmationType: value });
              }}
              allowReset
            />

            {!confirmationType || confirmationType === 'message' ? (
              <TextareaControl
                label={__('Message', '@@text_domain')}
                value={confirmationMessage}
                onChange={(val) => setAttributes({ confirmationMessage: val })}
              />
            ) : (
              ''
            )}
            {confirmationType === 'redirect' ? (
              <TextControl
                label={__('Redirect URL', '@@text_domain')}
                value={confirmationRedirect}
                onChange={(val) => setAttributes({ confirmationRedirect: val })}
              />
            ) : (
              ''
            )}
          </PanelBody>
          <RecaptchaSettings />
        </InspectorControls>
        <div className={className}>
          <InnerBlocks
            template={TEMPLATE}
            allowedBlocks={ALLOWED_BLOCKS}
            renderAppender={() => null}
          />
          {isSelectedBlockInRoot ? <InnerBlocks.ButtonBlockAppender /> : ''}
        </div>
      </Fragment>
    );
  }
}

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

export default compose([
  withSelect((select, ownProps) => {
    const { getBlock, isBlockSelected, hasSelectedInnerBlock } = select('core/block-editor');

    const { clientId } = ownProps;

    return {
      allFieldsData: getAllFieldsData(getBlock(ownProps.clientId)),
      isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
    };
  }),
  withDispatch((dispatch, ownProps) => {
    const { updateBlockAttributes } = dispatch('core/block-editor');

    return {
      updateFieldsSlugs() {
        const { allFieldsData = [] } = ownProps;

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
      },
    };
  }),
])(BlockEdit);
