/**
 * Internal dependencies
 */
import './padding';
import './margin';

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

const allSpacings = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
];

/**
 * Add inspector controls.
 */
function GhostKitExtensionSpacingsInspector(original, { props }) {
  const { name } = props;

  const hasSpacingsSupport = hasBlockSupport(name, ['ghostkit', 'spacings']);

  if (!hasSpacingsSupport) {
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
              <span className="ghostkit-ext-icon">{getIcon('extension-spacings')}</span>
              <span>{__('Spacings', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            const propsToReset = {};

            ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
              if (thisDevice) {
                propsToReset[`media_${thisDevice}`] = {};
              }

              allSpacings.forEach((thisMargin) => {
                if (thisDevice) {
                  propsToReset[`media_${thisDevice}`][thisMargin] = undefined;
                } else {
                  propsToReset[thisMargin] = undefined;
                }
              });
            });

            setStyles(propsToReset);
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
