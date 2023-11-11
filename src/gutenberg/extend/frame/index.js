/**
 * Internal dependencies
 */
import './border';
import './borderRadius';
import './shadow';

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

const allFrameProps = EXTENSIONS.frame.styles;

/**
 * Add inspector controls.
 */
function GhostKitExtensionFrameInspector(original, { props }) {
  const { name } = props;

  const hasFrameSupport = hasBlockSupport(name, ['ghostkit', 'frame']);

  if (!hasFrameSupport) {
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
              <span className="ghostkit-ext-icon">{getIcon('extension-frame')}</span>
              <span>{__('Frame', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            resetStyles(allFrameProps, true, ['', '&:hover']);
          }}
        >
          <div className="ghostkit-tools-panel-frame">
            <ApplyFilters name="ghostkit.extension.frame.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/frame/inspector',
  GhostKitExtensionFrameInspector
);
