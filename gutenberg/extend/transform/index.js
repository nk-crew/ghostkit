/**
 * External dependencies
 */
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import './pro-transforms';

import { EXTENSIONS } from '../constants';
import { hasClass, addClass, removeClass } from '../../utils/classes-replacer';
import useStyles from '../../hooks/use-styles';
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { applyFilters, addFilter } from '@wordpress/hooks';

import { useEffect, useRef } from '@wordpress/element';

import { hasBlockSupport } from '@wordpress/blocks';

import { InspectorControls } from '@wordpress/block-editor';

import {
  __stableToolsPanel as StableToolsPanel,
  __experimentalToolsPanel as ExperimentalToolsPanel,
} from '@wordpress/components';

import { createHigherOrderComponent } from '@wordpress/compose';

const ToolsPanel = StableToolsPanel || ExperimentalToolsPanel;

const allProps = EXTENSIONS.transform.styles;

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

  const { resetStyles } = useStyles(props);

  return (
    <>
      {original}
      <InspectorControls group="styles">
        <ToolsPanel
          label={
            <>
              <span className="ghostkit-ext-icon">{getIcon('extension-transform')}</span>
              <span>{__('Transform', 'ghostkit')}</span>
            </>
          }
          resetAll={() => {
            resetStyles(allProps, true, ['', '&:hover']);
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
  GhostKitExtensionTransformInspector,
  15
);
addFilter('editor.BlockEdit', 'ghostkit/extension/transform/classname', withNewAttrs);
