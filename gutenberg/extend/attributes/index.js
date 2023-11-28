/**
 * Internal dependencies
 */
import ApplyFilters from '../../components/apply-filters';
import ProNote from '../../components/pro-note';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import { hasBlockSupport } from '@wordpress/blocks';

import { InspectorControls } from '@wordpress/block-editor';

const { pro } = window.GHOSTKIT;

const { version } = window.ghostkitVariables;

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
    <ProNote title={__('Attributes', 'ghostkit')}>
      <p>
        {__(
          'Adding custom attributes to block available in the Ghost Kit Pro plugin only.',
          'ghostkit'
        )}
      </p>
      <ProNote.Button
        target="_blank"
        rel="noopener noreferrer"
        href={`https://ghostkit.io/extensions/attributes/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_attributes&utm_content=${version}`}
      >
        {__('Read More', 'ghostkit')}
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
