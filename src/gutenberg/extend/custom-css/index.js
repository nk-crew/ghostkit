/**
 * Internal dependencies
 */
import './opacity';
import './overflow';
import './cursor';
import './userSelect';
import './clipPath';
import './custom';

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

/**
 * Allow custom styles in blocks.
 *
 * @param {Boolean} allow Original block allow custom styles.
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function allowCustomStyles(allow, settings) {
  const { name } = settings;

  if (hasBlockSupport(name, ['ghostkit', 'customCSS'])) {
    return true;
  }

  return allow;
}

/**
 * Add inspector controls.
 */
function GhostKitExtensionCustomCSSInspector(original, { props }) {
  const { name } = props;

  const hasCustomCSSSupport = hasBlockSupport(name, ['ghostkit', 'customCSS']);

  if (!hasCustomCSSSupport) {
    return original;
  }

  const { setStyles } = useStyles(props);

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
            setStyles({
              opacity: undefined,
              'overflow-x': undefined,
              'overflow-y': undefined,
              cursor: undefined,
              'user-select': undefined,
              'clip-path': undefined,
              custom: undefined,
            });
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
  'ghostkit.blocks.allowCustomStyles',
  'ghostkit/extension/customCSS/allow-custom-styles',
  allowCustomStyles
);
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/customCSS/inspector',
  GhostKitExtensionCustomCSSInspector
);
