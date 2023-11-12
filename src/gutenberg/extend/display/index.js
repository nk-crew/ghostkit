/**
 * Internal dependencies
 */
import './screenSize';

import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { hasBlockSupport } = wp.blocks;

const { InspectorControls } = wp.blockEditor;

const { ToolsPanel: __stableToolsPanel, __experimentalToolsPanel } = wp.components;

const ToolsPanel = __stableToolsPanel || __experimentalToolsPanel;

/**
 * Add inspector controls.
 */
function GhostKitExtensionDisplayInspector(original, { props }) {
  const { name } = props;

  const hasDisplaySupport = hasBlockSupport(name, ['ghostkit', 'display']);

  if (!hasDisplaySupport) {
    return original;
  }

  return (
    <>
      {original}
      <InspectorControls group="styles">
        <ToolsPanel
          label={
            <>
              <span className="ghostkit-ext-icon">{getIcon('extension-display')}</span>
              <span>{__('Display Conditions', '@@text_domain')}</span>
            </>
          }
        >
          <div className="ghostkit-tools-panel-display">
            <ApplyFilters name="ghostkit.extension.display.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/display/inspector',
  GhostKitExtensionDisplayInspector,
  17
);
