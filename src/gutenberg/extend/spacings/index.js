/**
 * Internal dependencies
 */
import './padding';
import './margin';

import { EXTENSIONS } from '../constants';
import useStyles from '../../hooks/use-styles';
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

const allSpacings = EXTENSIONS.spacings.styles;

/**
 * Add inspector controls.
 */
function GhostKitExtensionSpacingsInspector(original, { props }) {
  const { name } = props;

  const hasSpacingsSupport = hasBlockSupport(name, ['ghostkit', 'spacings']);

  if (!hasSpacingsSupport) {
    return original;
  }

  const { resetStyles } = useStyles(props);

  return (
    <>
      {original}
      <InspectorControls group="styles">
        <ToolsPanel
          label={
            <>
              <span className="ghostkit-ext-icon">{getIcon('extension-spacings')}</span>
              <span>{__('Spacings', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            resetStyles(allSpacings, true);
          }}
        >
          <div className="ghostkit-tools-panel-spacings">
            <ApplyFilters name="ghostkit.extension.spacings.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/spacings/inspector',
  GhostKitExtensionSpacingsInspector
);
