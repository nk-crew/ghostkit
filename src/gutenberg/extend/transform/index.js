/**
 * External dependencies
 */
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import './pro-transforms';

import { hasClass, addClass, removeClass } from '../../utils/classes-replacer';
import useStyles from '../../hooks/use-styles';
import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter, applyFilters } = wp.hooks;

const { useEffect, useRef } = wp.element;

const { hasBlockSupport } = wp.blocks;

const { InspectorControls } = wp.blockEditor;

const { ToolsPanel: __stableToolsPanel, __experimentalToolsPanel } = wp.components;

const { createHigherOrderComponent } = wp.compose;

const ToolsPanel = __stableToolsPanel || __experimentalToolsPanel;

const hoverSelector = '&:hover';

const allProps = [
  '--gkt-transform-perspective',
  '--gkt-transform-x',
  '--gkt-transform-y',
  '--gkt-transform-scale',
  '--gkt-transform-rotate',
  '--gkt-transform-rotate-x',
  '--gkt-transform-rotate-y',
  '--gkt-transform-rotate-z',
  '--gkt-transform-skew-x',
  '--gkt-transform-skew-y',
  '--gkt-transform-origin',
];

const keyExists = (obj, key) => {
  let result = false;

  if (typeof obj === 'object') {
    if (key in obj) {
      result = true;
    } else {
      Object.keys(obj).forEach((k) => {
        result = result || keyExists(obj[k], key);
      });
    }
  }

  return result;
};

/**
 * Add inspector controls.
 */
function GhostKitExtensionTransformInspector(original, { props }) {
  const { name } = props;

  const hasTransformSupport = hasBlockSupport(name, ['ghostkit', 'transform']);

  if (!hasTransformSupport) {
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
              <span className="ghostkit-ext-icon">{getIcon('extension-transform')}</span>
              <span>{__('Transform', '@@text_domain')}</span>
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

              allProps.forEach((thisProp) => {
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
          <div className="ghostkit-tools-panel-transform">
            <ApplyFilters name="ghostkit.extension.transform.tools" props={props} />
          </div>
        </ToolsPanel>
      </InspectorControls>
    </>
  );
}

function CustomClassComponent(props) {
  const { setAttributes, attributes } = props;

  const { getStyles } = useStyles(props);

  let hasTransform = false;

  const styles = getStyles();
  allProps.forEach((transformProp) => {
    hasTransform = hasTransform || keyExists(styles, transformProp);
  });

  function onUpdate() {
    let { className } = attributes;

    const allowTransformClassName = applyFilters(
      'ghostkit.extension.transform.allowClassName',
      hasTransform,
      props
    );
    const hasTransformClassName = hasClass(className, 'ghostkit-has-transform');

    if (allowTransformClassName && !hasTransformClassName) {
      className = addClass(className, 'ghostkit-has-transform');

      setAttributes({ className });
    } else if (!allowTransformClassName && hasTransformClassName) {
      className = removeClass(className, 'ghostkit-has-transform');

      setAttributes({ className });
    }
  }

  const onUpdateThrottle = throttle(60, onUpdate);

  const didMountRef = useRef(false);

  useEffect(() => {
    // Did update.
    if (didMountRef.current) {
      onUpdateThrottle();

      // Did mount.
    } else {
      didMountRef.current = true;

      onUpdate(true);
    }
  }, [attributes]);

  return null;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent(
  (BlockEdit) =>
    function (props) {
      return (
        <>
          <BlockEdit {...props} />
          <CustomClassComponent {...props} />
        </>
      );
    },
  'withNewAttrs'
);

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/transform/inspector',
  GhostKitExtensionTransformInspector
);
addFilter('editor.BlockEdit', 'ghostkit/extension/transform/classname', withNewAttrs);
