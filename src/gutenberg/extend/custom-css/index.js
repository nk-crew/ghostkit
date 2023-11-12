/**
 * Internal dependencies
 */
import './opacity';
import './overflow';
import './cursor';
import './userSelect';
import './clipPath';
import './pro-transition';
import './custom';

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

const allCustomCSS = EXTENSIONS.customCSS.styles;

/**
 * Add inspector controls.
 */
function GhostKitExtensionCustomCSSInspector(original, { props }) {
  const { name } = props;

  const hasCustomCSSSupport = hasBlockSupport(name, ['ghostkit', 'customCSS']);

  if (!hasCustomCSSSupport) {
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
              <span className="ghostkit-ext-icon">{getIcon('extension-custom-css')}</span>
              <span>{__('Custom CSS', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            resetStyles(allCustomCSS, true);
          }}
        >
          <div className="ghostkit-tools-panel-custom-css">
            <ApplyFilters name="ghostkit.extension.customCSS.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/customCSS/inspector',
  GhostKitExtensionCustomCSSInspector,
  16
);
