/**
 * Internal dependencies
 */
import GroupControls from '../../../components/group-controls';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { PanelBody, __experimentalUnitControl: UnitControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

export default function EditInspectorControls({ attributes, setAttributes }) {
  const { width, height } = attributes;
  return (
    <InspectorControls>
      <PanelBody>
        <GroupControls>
          <UnitControl
            label={__('Width', '@@text_domain')}
            placeholder={__('Auto', '@@text_domain')}
            value={width}
            min={0}
            onChange={(val) => setAttributes({ width: val })}
          />
          <UnitControl
            label={__('Height', '@@text_domain')}
            placeholder={__('Auto', '@@text_domain')}
            value={height}
            min={0}
            onChange={(val) => setAttributes({ height: val })}
          />
        </GroupControls>
      </PanelBody>
    </InspectorControls>
  );
}
