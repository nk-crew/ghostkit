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

const { PanelBody, TextControl } = wp.components;

const { InspectorControls } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes } = this.props;

    const { min, max, step, default: defaultVal } = attributes;

    let { className = '' } = this.props;

    className = classnames('ghostkit-form-field ghostkit-form-field-number', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    const defaultCustom = (
      <TextControl
        type="number"
        label={__('Default', '@@text_domain')}
        value={defaultVal}
        onChange={(val) => setAttributes({ default: val })}
        step={step}
        max={max}
        min={min}
      />
    );

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <FieldDefaultSettings {...this.props} defaultCustom={defaultCustom} />
          </PanelBody>
          <PanelBody title={__('Number Settings', '@@text_domain')}>
            <TextControl
              type="number"
              label={__('Min', '@@text_domain')}
              value={min}
              onChange={(val) => setAttributes({ min: val })}
              step={step}
              max={max}
            />
            <TextControl
              type="number"
              label={__('Max', '@@text_domain')}
              value={max}
              onChange={(val) => setAttributes({ max: val })}
              step={step}
              min={min}
            />
            <TextControl
              type="number"
              label={__('Step', '@@text_domain')}
              value={step}
              onChange={(val) => setAttributes({ step: val })}
            />
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          <FieldLabel {...this.props} />
          <TextControl type="number" {...getFieldAttributes(attributes)} />
          <FieldDescription {...this.props} />
        </div>
      </Fragment>
    );
  }
}

export default BlockEdit;
