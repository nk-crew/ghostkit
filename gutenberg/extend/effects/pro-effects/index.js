/**
 * Internal dependencies
 */
import ProNote from '../../../components/pro-note';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import { useState } from '@wordpress/element';

import { hasBlockSupport } from '@wordpress/blocks';

import {
  __stableToolsPanelItem as StableToolsPanelItem,
  __experimentalToolsPanelItem as ExperimentalToolsPanelItem,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

const { pro } = window.GHOSTKIT;

const PRESETS = {
  mouseHover: {
    label: __('Mouse Hover', 'ghostkit'),
  },
  mousePress: {
    label: __('Mouse Press', 'ghostkit'),
  },
  mouseMove: {
    label: __('Mouse Move', 'ghostkit'),
  },
  scroll: {
    label: __('Scroll', 'ghostkit'),
  },
  loop: {
    label: __('Loop', 'ghostkit'),
  },
};

function EffectsProTools() {
  const [selected, setSelected] = useState(false);

  return (
    <>
      {selected && (
        <div style={{ gridColumn: '1 / -1' }}>
          <ProNote title={__('Advanced Effects', 'ghostkit')}>
            <p>
              {__(
                'Advanced effects are available in the Ghost Kit Pro plugin only.',
                'ghostkit'
              )}
            </p>
            <ProNote.Button
              target="_blank"
              rel="noopener noreferrer"
              href="https://ghostkit.io/extensions/effects/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_effects&utm_content=@@plugin_version"
            >
              {__('Read More', 'ghostkit')}
            </ProNote.Button>
          </ProNote>
        </div>
      )}
      {Object.keys(PRESETS).map((k) => (
        <ToolsPanelItem
          key={k}
          label={PRESETS[k].label}
          hasValue={() => false}
          onDeselect={() => {}}
          onSelect={() => {
            setSelected(true);
          }}
          isShownByDefault={false}
        />
      ))}
    </>
  );
}

addFilter(
  'ghostkit.extension.effects.tools',
  'ghostkit/extension/effects/pro',
  (children, { props }) => {
    if (pro) {
      return children;
    }

    const hasOneOfProEffectsSupport = Object.keys(PRESETS).some((k) =>
      hasBlockSupport(props.name, ['ghostkit', 'effects', k])
    );

    if (!hasOneOfProEffectsSupport) {
      return children;
    }

    return (
      <>
        {children}
        <EffectsProTools {...props} />
      </>
    );
  }
);
