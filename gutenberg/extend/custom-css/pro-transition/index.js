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
	__stableToolsPanelItem as StableToolsPanelItem,
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

const { pro } = window.GHOSTKIT;

const { version } = window.ghostkitVariables;

function ProTransitionTools() {
  return (
    <ToolsPanelItem
      label={__('Transition', 'ghostkit')}
      hasValue={() => false}
      onSelect={() => {}}
      onDeselect={() => {}}
      isShownByDefault={false}
    >
      <div style={{ gridColumn: '1 / -1' }}>
        <ProNote title={__('Transition', 'ghostkit')}>
          <p>
            {__(
              'Transition and transform configurations are available in the Ghost Kit Pro plugin only.',
              'ghostkit'
            )}
          </p>
          <ProNote.Button
            target="_blank"
            rel="noopener noreferrer"
            href={`https://ghostkit.io/extensions/custom-css/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_transition&utm_content=${version}`}
          >
            {__('Read More', 'ghostkit')}
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
