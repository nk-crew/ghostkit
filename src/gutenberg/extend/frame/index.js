/**
 * Internal dependencies
 */
import './border';
import './borderRadius';
import './shadow';

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

const hoverSelector = '&:hover';

const allFrameProps = [
  'border-style',
  'border-width',
  'border-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'box-shadow',
];

/**
 * Add inspector controls.
 */
function GhostKitExtensionFrameInspector(original, { props }) {
  const { name } = props;

  const hasFrameSupport = hasBlockSupport(name, ['ghostkit', 'frame']);

  if (!hasFrameSupport) {
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
              <span className="ghostkit-ext-icon">{getIcon('extension-frame')}</span>
              <span>{__('Frame', '@@text_domain')}</span>
            </>
          }
          resetAll={() => {
            const propsToReset = {
              [hoverSelector]: {},
            };

            ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
              if (thisDevice) {
                propsToReset[`media_${thisDevice}`] = {};
                propsToReset[`media_${thisDevice}`][hoverSelector] = {};
              }

              allFrameProps.forEach((thisProp) => {
                if (thisDevice) {
                  propsToReset[`media_${thisDevice}`][thisProp] = undefined;
                  propsToReset[`media_${thisDevice}`][hoverSelector][thisProp] = undefined;
                } else {
                  propsToReset[thisProp] = undefined;
                  propsToReset[hoverSelector][thisProp] = undefined;
                }
              });
            });

            setStyles(propsToReset);
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
