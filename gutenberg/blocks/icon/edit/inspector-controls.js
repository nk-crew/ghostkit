/**
 * Internal dependencies
 */
import IconPicker from '../../../components/icon-picker';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

export default function EditInspectorControls({ attributes, setAttributes }) {
  const { icon, width } = attributes;

  return (
    <InspectorControls>
      <PanelBody>
        <IconPicker
          label={__('Icon', '@@text_domain')}
          value={icon}
          onChange={(value) => setAttributes({ icon: value })}
          insideInspector
        />
        <UnitControl
          label={__('Width', '@@text_domain')}
          placeholder={__('Auto', '@@text_domain')}
          value={width}
          onChange={(val) => setAttributes({ width: val })}
          labelPosition="edge"
          __unstableInputWidth="70px"
          min={0}
        />
      </PanelBody>
    </InspectorControls>
  );
}
