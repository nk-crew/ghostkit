/**
 * Internal dependencies
 */
import './deprecated-scroll-reveal';
import './reveal';
import './pro-animations';

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
  __experimentalToolsPanel: ToolsPanel,
} = wp.components;

/**
 * Add inspector controls.
 */
function GhostKitExtensionAnimationInspector(original, { props }) {
  const { name, attributes, setAttributes } = props;

  const hasAnimationSupport = hasBlockSupport(name, ['ghostkit', 'animation']);

  if (!hasAnimationSupport) {
    return original;
  }

  return (
    <>
      {original}
      <InspectorControls>
        <ToolsPanel
          label={
            <>
              <span className="ghostkit-ext-icon">{getIcon('extension-sr')}</span>
              <span>{__('Animation', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            const ghostkitData = {
              ...(attributes?.ghostkit || {}),
            };

            if (typeof ghostkitData?.animation !== 'undefined') {
              delete ghostkitData?.animation;

              setAttributes({ ghostkit: ghostkitData });
            }
          }}
        >
          <div className="ghostkit-tools-panel-animation">
            <ApplyFilters name="ghostkit.extension.animation.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

/**
 * Add toolbar controls.
 */
function GhostKitExtensionAnimationToolbar(original, { props }) {
  const { name, attributes, setAttributes } = props;

  const hasAnimationSupport = hasBlockSupport(name, ['ghostkit', 'animation']);

  if (!hasAnimationSupport) {
    return original;
  }

  const hasAnimation = attributes?.ghostkit?.animation;

  if (!hasAnimation) {
    return original;
  }

  return (
    <>
      {original}
      <BlockControls group="other">
        <ToolbarDropdownMenu
          icon={getIcon('extension-sr')}
          label={__('Animations', '@@text_domain')}
          menuProps={{
            style: { width: '260px' },
          }}
          popoverProps={{ focusOnMount: false }}
        >
          {() => (
            <>
              <MenuGroup>
                {__(
                  'There are animations added to the current block. To change animation options open the "Animation" block settings panel.',
                  '@@text_domain'
                )}
              </MenuGroup>
              <MenuGroup>
                {__('Reset all animations of the current block:', '@@text_domain')}
                <Button
                  variant="link"
                  onClick={() => {
                    const ghostkitData = {
                      ...(attributes?.ghostkit || {}),
                    };

                    if (typeof ghostkitData?.animation !== 'undefined') {
                      delete ghostkitData?.animation;

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
  'ghostkit/extension/animation/inspector',
  GhostKitExtensionAnimationInspector
);
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/animation/toolbar',
  GhostKitExtensionAnimationToolbar
);
