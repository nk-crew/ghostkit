/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { PanelBody, ToggleControl, SelectControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

export default function EditInspectorControls({ attributes, setAttributes }) {
  const { trigger, buttonsAlign, buttonsVerticalAlign } = attributes;

  return (
    <InspectorControls>
      <PanelBody>
        <SelectControl
          label={__('Select Tab Trigger', '@@text_domain')}
          value={trigger}
          options={[
            {
              value: '',
              label: __('Click', '@@text_domain'),
            },
            {
              value: 'hover',
              label: __('Hover', '@@text_domain'),
            },
          ]}
          onChange={(val) => {
            setAttributes({ trigger: val });
          }}
        />
        <ToggleControl
          label={__('Vertical Tabs', '@@text_domain')}
          checked={!!buttonsVerticalAlign}
          onChange={(val) => {
            setAttributes({ buttonsVerticalAlign: val });

            if (val && buttonsAlign === 'stretch') {
              setAttributes({ buttonsAlign: 'start' });
            }
          }}
        />
      </PanelBody>
    </InspectorControls>
  );
}
