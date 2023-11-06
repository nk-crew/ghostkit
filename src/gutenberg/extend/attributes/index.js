/**
 * Internal dependencies
 */
import ApplyFilters from '../../components/apply-filters';
import ProNote from '../../components/pro-note';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { hasBlockSupport } = wp.blocks;

const { InspectorControls } = wp.blockEditor;

const { pro } = window.GHOSTKIT;

/**
 * Add inspector controls.
 */
function GhostKitExtensionAttributesInspector(original, { props }) {
  const { name } = props;

  const hasAttributesSupport = hasBlockSupport(name, ['ghostkit', 'attributes']);

  if (!hasAttributesSupport) {
    return original;
  }

  return (
    <>
      {original}
      <InspectorControls group="advanced">
        <ApplyFilters name="ghostkit.extension.attributes.controls" props={props} />
      </InspectorControls>
    </>
  );
}

function ProAttributesControls() {
  return (
    <ProNote title={__('Attributes', '@@text_domain')}>
      <p>
        {__(
          'Adding custom attributes to block available in the Ghost Kit Pro plugin only.',
          '@@text_domain'
        )}
      </p>
      <ProNote.Button
        target="_blank"
        rel="noopener noreferrer"
        href="https://ghostkit.io/extensions/attributes/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_attributes&utm_content=@@plugin_version"
      >
        {__('Read More', '@@text_domain')}
      </ProNote.Button>
    </ProNote>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/attributes/inspector',
  GhostKitExtensionAttributesInspector
);
addFilter(
  'ghostkit.extension.attributes.controls',
  'ghostkit/extension/attributes/controls',
  (children, { props }) => {
    if (pro) {
      return children;
    }

    return (
      <>
        {children}
        <ProAttributesControls {...props} />
      </>
    );
  }
);
