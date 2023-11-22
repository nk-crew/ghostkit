/**
 * Internal dependencies
 */
import ProNote from '../../../components/pro-note';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import {
	__stableToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem
} from '@wordpress/components';

const ToolsPanelItem = ToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

const { pro } = window.GHOSTKIT;

function ProTransitionTools() {
  return (
    <ToolsPanelItem
      label={__('Transition', '@@text_domain')}
      hasValue={() => false}
      onSelect={() => {}}
      onDeselect={() => {}}
      isShownByDefault={false}
    >
      <div style={{ gridColumn: '1 / -1' }}>
        <ProNote title={__('Transition', '@@text_domain')}>
          <p>
            {__(
              'Transition and transform configurations are available in the Ghost Kit Pro plugin only.',
              '@@text_domain'
            )}
          </p>
          <ProNote.Button
            target="_blank"
            rel="noopener noreferrer"
            href="https://ghostkit.io/extensions/custom-css/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_transition&utm_content=@@plugin_version"
          >
            {__('Read More', '@@text_domain')}
          </ProNote.Button>
        </ProNote>
      </div>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/transition',
  (children, { props }) => {
    if (pro) {
      return children;
    }

    const hasTransitionSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'customCSS',
      'transition',
    ]);

    if (!hasTransitionSupport) {
      return children;
    }

    return (
      <>
        {children}
        <ProTransitionTools {...props} />
      </>
    );
  }
);
