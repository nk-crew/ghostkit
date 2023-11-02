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
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { hasBlockSupport } = wp.blocks;

const { InspectorControls, BlockControls } = wp.blockEditor;

const {
  ToolbarDropdownMenu,
  MenuGroup,
  Button,
  ToolsPanel: __stableToolsPanel,
  __experimentalToolsPanel,
} = wp.components;

const ToolsPanel = __stableToolsPanel || __experimentalToolsPanel;

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
              <span>{__('Effects', '@@text_domain')}</span>
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
          label={__('Effects', '@@text_domain')}
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
                  '@@text_domain'
                )}
              </MenuGroup>
              <MenuGroup>
                {__('Reset all effects of the current block:', '@@text_domain')}
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
                  {__('Reset All', '@@text_domain')}
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
  GhostKitExtensionEffectsInspector
);
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/effects/toolbar',
  GhostKitExtensionEffectsToolbar
);
