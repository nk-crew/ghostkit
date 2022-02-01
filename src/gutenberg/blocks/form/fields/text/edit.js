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

const { Component, Fragment } = wp.element;

const { PanelBody, TextControl } = wp.components;

const { InspectorControls } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes } = this.props;

    let { className = '' } = this.props;

    className = classnames('ghostkit-form-field ghostkit-form-field-text', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <FieldDefaultSettings {...this.props} />
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          <FieldLabel {...this.props} />
          <TextControl {...getFieldAttributes(attributes)} />
          <FieldDescription {...this.props} />
        </div>
      </Fragment>
    );
  }
}

export default BlockEdit;
