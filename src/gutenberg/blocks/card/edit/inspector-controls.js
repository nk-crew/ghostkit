/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { PanelBody, __experimentalUnitControl: UnitControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

export default function EditInspectorControls({ attributes, setAttributes }) {
  const { width } = attributes;
  return (
    <InspectorControls>
      <PanelBody>
        <UnitControl
          label={__('Width', '@@text_domain')}
          placeholder={__('Auto', '@@text_domain')}
          value={width}
          min={0}
          onChange={(val) => setAttributes({ width: val })}
        />
      </PanelBody>
    </InspectorControls>
  );
}
