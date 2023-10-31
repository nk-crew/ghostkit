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
import useResponsive from '../../hooks/use-responsive';
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

const allCustomCSS = [
  'opacity',
  'overflow-x',
  'overflow-y',
  'cursor',
  'user-select',
  'clip-path',
  'custom',
];

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
  const { allDevices } = useResponsive();

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
            const propsToReset = {};

            ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
              if (thisDevice) {
                propsToReset[`media_${thisDevice}`] = {};
              }

              allCustomCSS.forEach((propName) => {
                if (thisDevice) {
                  propsToReset[`media_${thisDevice}`][propName] = undefined;
                } else {
                  propsToReset[propName] = undefined;
                }
              });
            });

            setStyles(propsToReset);
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
  GhostKitExtensionCustomCSSInspector
);
