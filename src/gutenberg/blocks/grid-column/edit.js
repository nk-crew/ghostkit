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

const { PanelBody, SelectControl, Tooltip } = wp.components;

const { applyFilters } = wp.hooks;

const {
  InspectorControls,
  InnerBlocks,
  useBlockProps,
  useInnerBlocksProps: __stableUseInnerBlocksProps,
  __experimentalUseInnerBlocksProps,
} = wp.blockEditor;

const { useSelect } = wp.data;

const { ghostkitVariables } = window;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

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

  for (let k = 1; 12 >= k; k += 1) {
    result.push({
      label: sprintf(
        1 === k ? __('%d Column (%s)', '@@text_domain') : __('%d Columns (%s)', '@@text_domain'),
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
  const { clientId, attributes, setAttributes, isSelected } = props;

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

      if ('all' !== media) {
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
        hasChildBlocks: blockEditor ? 0 < blockEditor.getBlockOrder(clientId).length : false,
      };
    },
    [clientId]
  );

  // background
  const background = applyFilters('ghostkit.editor.grid-column.background', '', props);

  const blockProps = useBlockProps({
    className: classnames(props.attributes.className, getColClass(props)),
  });

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    templateLock: false,
    renderAppender: hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender />,
  });

  return (
    <div {...innerBlocksProps}>
      <InspectorControls>
        <ApplyFilters name="ghostkit.editor.controls" attribute="columnSettings" props={props}>
          <PanelBody>
            <ResponsiveTabPanel filledTabs={filledTabs}>
              {(tabData) => {
                let sizeName = 'size';
                let orderName = 'order';
                let verticalAlignName = 'verticalAlign';

                if ('all' !== tabData.name) {
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
                      label={__('Vertical alignment', '@@text_domain')}
                      value={attributes[verticalAlignName]}
                      options={[
                        {
                          label: getIcon('icon-vertical-top'),
                          value: '',
                        },
                        {
                          label: getIcon('icon-vertical-center'),
                          value: 'center',
                        },
                        {
                          label: getIcon('icon-vertical-bottom'),
                          value: 'end',
                        },
                      ]}
                      onChange={(value) => {
                        setAttributes({ [verticalAlignName]: value });
                      }}
                      allowReset
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
            allowReset
          />
          {stickyContent ? (
            <RangeControl
              label={__('Sticky Offset', '@@text_domain')}
              value={stickyContentOffset}
              onChange={(value) => setAttributes({ stickyContentOffset: value })}
              allowCustomMax
            />
          ) : (
            ''
          )}
        </PanelBody>
        <div className="ghostkit-background-controls">
          <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={props} />
        </div>
      </InspectorControls>
      {background}
      <div className="ghostkit-col-content">
        {!isSelected && hasChildBlocks ? (
          <div className="ghostkit-column-button-select">
            <Tooltip text={__('Select Column', '@@text_domain')}>
              {getIcon('block-grid-column')}
            </Tooltip>
          </div>
        ) : (
          ''
        )}
        {children}
      </div>
    </div>
  );
}
