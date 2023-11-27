/**
 * Internal dependencies
 */
import './reveal';
import './pro-effects';

import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import { hasBlockSupport } from '@wordpress/blocks';

import { InspectorControls, BlockControls } from '@wordpress/block-editor';

import {
	ToolbarDropdownMenu,
  MenuGroup,
  Button,
  __stableToolsPanel as StableToolsPanel,
  __experimentalToolsPanel as ExperimentalToolsPanel,
} from '@wordpress/components';

const ToolsPanel = StableToolsPanel || ExperimentalToolsPanel;

/**
 * Add inspector controls.
 */
function GhostKitExtensionEffectsInspector(original, { props }) {
  const { name, attributes, setAttributes } = props;

  const hasEffectsSupport = hasBlockSupport(name, ['ghostkit', 'effects']);

  if (!hasEffectsSupport) {
    return original;
  }

  return (
    <>
      {original}
      <InspectorControls group="styles">
        <ToolsPanel
          label={
            <>
              <span className="ghostkit-ext-icon">{getIcon('extension-sr')}</span>
              <span>{__('Effects', 'ghostkit')}</span>
            </>
          }
          resetAll={() => {
            const ghostkitData = {
              ...(attributes?.ghostkit || {}),
            };

            if (typeof ghostkitData?.effects !== 'undefined') {
              delete ghostkitData?.effects;

              setAttributes({ ghostkit: ghostkitData });
            }
          }}
        >
          <div className="ghostkit-tools-panel-effects">
            <ApplyFilters name="ghostkit.extension.effects.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

/**
 * Add toolbar controls.
 */
function GhostKitExtensionEffectsToolbar(original, { props }) {
  const { name, attributes, setAttributes } = props;

  const hasEffectsSupport = hasBlockSupport(name, ['ghostkit', 'effects']);

  if (!hasEffectsSupport) {
    return original;
  }

  const hasEffects = attributes?.ghostkit?.effects;

  if (!hasEffects) {
    return original;
  }

  return (
    <>
      {original}
      <BlockControls group="other">
        <ToolbarDropdownMenu
          icon={getIcon('extension-sr')}
          label={__('Effects', 'ghostkit')}
          menuProps={{
            style: { width: '260px' },
          }}
          popoverProps={{ focusOnMount: false }}
        >
          {() => (
            <>
              <MenuGroup>
                {__(
                  'There are effects added to the current block. To change these options open the "Effects" block settings panel.',
                  'ghostkit'
                )}
              </MenuGroup>
              <MenuGroup>
                {__('Reset all effects of the current block:', 'ghostkit')}
                <Button
                  variant="link"
                  onClick={() => {
                    const ghostkitData = {
                      ...(attributes?.ghostkit || {}),
                    };

                    if (typeof ghostkitData?.effects !== 'undefined') {
                      delete ghostkitData?.effects;

                      setAttributes({ ghostkit: ghostkitData });
                    }
                  }}
                >
                  {__('Reset All', 'ghostkit')}
                </Button>
              </MenuGroup>
            </>
          )}
        </ToolbarDropdownMenu>
      </BlockControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/effects/inspector',
  GhostKitExtensionEffectsInspector,
  11
);
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/effects/toolbar',
  GhostKitExtensionEffectsToolbar
);
