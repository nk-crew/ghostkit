/* eslint-disable max-classes-per-file */
/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../components/responsive-toggle';
import RangeControl from '../../components/range-control';
import {
  getActiveClass,
  replaceClass,
  addClass,
  removeClass,
  hasClass,
} from '../../utils/classes-replacer';
import useResponsive from '../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import { Fragment } from '@wordpress/element';

import { createHigherOrderComponent } from '@wordpress/compose';

import { InspectorControls } from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';

const COLUMNS_COUNT_MAX = 6;

/**
 * Get current columns count for selected screen size.
 *
 * @param {String} className - block className.
 * @param {String} screen - name of screen size.
 *
 * @returns {String} columns value.
 */
function getCurrentColumns(className, screen) {
  if (!screen) {
    for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
      if (hasClass(className, `ghostkit-paragraph-columns-${k}`)) {
        return `${k}`;
      }
    }
  }

  return getActiveClass(className, `ghostkit-paragraph-columns-${screen}`, true);
}

/**
 * Paragraph Columns
 */
function GhostKitParagraphColumns(props) {
  const { attributes, setAttributes } = props;
  const { className } = attributes;

  const { device } = useResponsive();

  /**
   * Update columns count class.
   *
   * @param {String} screen - name of screen size.
   * @param {String} val - value for columns count.
   */
  function updateColumns(screen, val) {
    let newClassName = className;

    if (screen) {
      newClassName = replaceClass(newClassName, `ghostkit-paragraph-columns-${screen}`, val);
    } else {
      for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
        newClassName = removeClass(newClassName, `ghostkit-paragraph-columns-${k}`);
      }

      if (val) {
        newClassName = addClass(newClassName, `ghostkit-paragraph-columns-${val}`);
      }
    }

    setAttributes({
      className: newClassName,
    });
  }

  // add new display controls.
  return (
    <InspectorControls>
      <PanelBody>
        <RangeControl
          label={
            <>
              {__('Columns Count', 'ghostkit')}
              <ResponsiveToggle
                checkActive={(checkMedia) => {
                  return !!getCurrentColumns(className, checkMedia);
                }}
              />
            </>
          }
          value={parseInt(getCurrentColumns(className, device), 10)}
          onChange={(value) => updateColumns(device, value)}
          min={1}
          max={COLUMNS_COUNT_MAX}
        />
      </PanelBody>
    </InspectorControls>
  );
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom display if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent((OriginalComponent) => {
  function GhostKitParagraphWrapper(props) {
    const { name } = props;

    if (name !== 'core/paragraph') {
      return <OriginalComponent {...props} />;
    }

    // add new display controls.
    return (
      <Fragment>
        <OriginalComponent {...props} />
        <GhostKitParagraphColumns {...props} />
      </Fragment>
    );
  }

  return GhostKitParagraphWrapper;
}, 'withInspectorControl');

// Init filters.
addFilter(
  'editor.BlockEdit',
  'ghostkit/core-paragraph/additional-attributes',
  withInspectorControl,
  9
);
