/**
 * Internal dependencies
 */
import './position';
import './distance';
import './width';
import './height';
import './minMaxWidth';
import './minMaxHeight';
import './zIndex';

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

const allPositionProps = EXTENSIONS.position.styles;

/**
 * Add inspector controls.
 */
function GhostKitExtensionPositionInspector(original, { props }) {
  const { name } = props;

  const hasPositionSupport = hasBlockSupport(name, ['ghostkit', 'position']);

  if (!hasPositionSupport) {
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
              <span className="ghostkit-ext-icon">{getIcon('extension-position')}</span>
              <span>{__('Position', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            resetStyles(allPositionProps, true);
          }}
        >
          <div className="ghostkit-tools-panel-position">
            <ApplyFilters name="ghostkit.extension.position.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/position/inspector',
  GhostKitExtensionPositionInspector,
  12
);
