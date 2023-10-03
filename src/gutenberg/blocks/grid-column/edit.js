/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import ToggleGroup from '../../components/toggle-group';
import RangeControl from '../../components/range-control';

import getColClass from './get-col-class';

const { __, sprintf } = wp.i18n;

const { Fragment } = wp.element;

const { PanelBody, SelectControl } = wp.components;

const { applyFilters } = wp.hooks;

const { InspectorControls, InnerBlocks, useBlockProps, useInnerBlocksProps } = wp.blockEditor;

const { useSelect } = wp.data;

const { ghostkitVariables } = window;

/**
 * Get array for Select element.
 *
 * @returns {Array} array for Select.
 */
const getDefaultColumnSizes = function () {
  const result = [
    {
      label: __('Inherit from larger', '@@text_domain'),
      value: '',
    },
    {
      label: __('Auto', '@@text_domain'),
      value: 'auto',
    },
    {
      label: __('Grow', '@@text_domain'),
      value: 'grow',
    },
  ];

  for (let k = 1; k <= 12; k += 1) {
    result.push({
      label: sprintf(
        k === 1 ? __('%d Column (%s)', '@@text_domain') : __('%d Columns (%s)', '@@text_domain'),
        k,
        `${Math.round(((100 * k) / 12) * 100) / 100}%`
      ),
      value: k,
    });
  }
  return result;
};

/**
 * Get array for Select element.
 *
 * @param {Number} columns - number of available columns.
 *
 * @returns {Array} array for Select.
 */
const getDefaultColumnOrders = function (columns = 12) {
  const result = [
    {
      label: __('Inherit from larger', '@@text_domain'),
      value: '',
    },
    {
      label: __('Auto', '@@text_domain'),
      value: 'auto',
    },
    {
      label: __('First', '@@text_domain'),
      value: 'first',
    },
  ];

  for (let k = 1; k <= columns; k += 1) {
    result.push({
      label: k,
      value: k,
    });
  }

  result.push({
    label: __('Last', '@@text_domain'),
    value: 'last',
  });

  return result;
};

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { clientId, attributes, setAttributes } = props;

  const { stickyContent, stickyContentOffset } = attributes;

  const filledTabs = {};
  if (
    ghostkitVariables &&
    ghostkitVariables.media_sizes &&
    Object.keys(ghostkitVariables.media_sizes).length
  ) {
    Object.keys(ghostkitVariables.media_sizes).forEach((media) => {
      let sizeName = 'size';
      let orderName = 'order';
      let verticalAlignName = 'verticalAlign';

      if (media !== 'all') {
        sizeName = `${media}_${sizeName}`;
        orderName = `${media}_${orderName}`;
        verticalAlignName = `${media}_${verticalAlignName}`;
      }

      filledTabs[media] =
        attributes[sizeName] || attributes[orderName] || attributes[verticalAlignName];
    });
  }

  const { hasChildBlocks } = useSelect(
    (select) => {
      const blockEditor = select('core/block-editor');

      return {
        hasChildBlocks: blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false,
      };
    },
    [clientId]
  );

  // background
  const background = applyFilters('ghostkit.editor.grid-column.background', '', props);

  const blockProps = useBlockProps({
    className: classnames(props.attributes.className, getColClass(props)),
  });

  const innerBlocksProps = useInnerBlocksProps(
    { className: 'ghostkit-col-content' },
    {
      templateLock: false,
      renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
    }
  );

  return (
    <div {...blockProps}>
      <InspectorControls>
        <ApplyFilters name="ghostkit.editor.controls" attribute="columnSettings" props={props}>
          <PanelBody>
            <ResponsiveTabPanel filledTabs={filledTabs}>
              {(tabData) => {
                let sizeName = 'size';
                let orderName = 'order';
                let verticalAlignName = 'verticalAlign';

                if (tabData.name !== 'all') {
                  sizeName = `${tabData.name}_${sizeName}`;
                  orderName = `${tabData.name}_${orderName}`;
                  verticalAlignName = `${tabData.name}_${verticalAlignName}`;
                }

                return (
                  <Fragment>
                    <SelectControl
                      label={__('Size', '@@text_domain')}
                      value={attributes[sizeName]}
                      onChange={(value) => {
                        setAttributes({
                          [sizeName]: value,
                        });
                      }}
                      options={getDefaultColumnSizes()}
                    />
                    <SelectControl
                      label={__('Order', '@@text_domain')}
                      value={attributes[orderName]}
                      onChange={(value) => {
                        setAttributes({
                          [orderName]: value,
                        });
                      }}
                      options={getDefaultColumnOrders()}
                    />
                    <ToggleGroup
                      label={__('Vertical Alignment', '@@text_domain')}
                      value={attributes[verticalAlignName]}
                      options={[
                        {
                          icon: getIcon('icon-vertical-top'),
                          label: __('Top', '@@text_domain'),
                          value: '',
                        },
                        {
                          icon: getIcon('icon-vertical-center'),
                          label: __('Center', '@@text_domain'),
                          value: 'center',
                        },
                        {
                          icon: getIcon('icon-vertical-bottom'),
                          label: __('Bottom', '@@text_domain'),
                          value: 'end',
                        },
                      ]}
                      onChange={(value) => {
                        setAttributes({ [verticalAlignName]: value });
                      }}
                      isDeselectable
                    />
                  </Fragment>
                );
              }}
            </ResponsiveTabPanel>
          </PanelBody>
        </ApplyFilters>
        <PanelBody>
          <ToggleGroup
            label={__('Sticky Content', '@@text_domain')}
            value={stickyContent}
            options={[
              {
                label: __('Top', '@@text_domain'),
                value: 'top',
              },
              {
                label: __('Bottom', '@@text_domain'),
                value: 'bottom',
              },
            ]}
            onChange={(value) => {
              setAttributes({ stickyContent: value });
            }}
            isDeselectable
          />
          {stickyContent ? (
            <RangeControl
              label={__('Sticky Offset', '@@text_domain')}
              value={stickyContentOffset}
              onChange={(value) => setAttributes({ stickyContentOffset: value })}
              allowCustomMax
            />
          ) : null}
        </PanelBody>
        <div className="ghostkit-background-controls">
          <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={props} />
        </div>
      </InspectorControls>
      {background}
      <div {...innerBlocksProps} />
    </div>
  );
}
