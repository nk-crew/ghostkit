/**
 * Internal dependencies
 */
import './screenSize';

import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import { hasBlockSupport } from '@wordpress/blocks';

import { InspectorControls } from '@wordpress/block-editor';

import {
  __stableToolsPanel as StableToolsPanel,
  __experimentalToolsPanel as ExperimentalToolsPanel,
} from '@wordpress/components';

const ToolsPanel = StableToolsPanel || ExperimentalToolsPanel;

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
