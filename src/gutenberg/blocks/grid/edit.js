/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import GapSettings from '../../components/gap-settings';
import ToggleGroup from '../../components/toggle-group';
import RangeControl from '../../components/range-control';
import { TemplatesModal } from '../../plugins/templates';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Fragment, useState } = wp.element;

const { Button, PanelBody, Placeholder, ToolbarGroup, ToolbarButton, Tooltip } = wp.components;

const {
  InspectorControls,
  BlockControls,
  useBlockProps,
  useInnerBlocksProps: __stableUseInnerBlocksProps,
  __experimentalUseInnerBlocksProps,
} = wp.blockEditor;

const { useSelect, useDispatch } = wp.data;

const { createBlock } = wp.blocks;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { clientId, attributes, setAttributes, isSelected } = props;

  const { gap, gapCustom, gapVerticalCustom, verticalAlign, horizontalAlign } = attributes;

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const { removeBlock, replaceInnerBlocks } = useDispatch('core/block-editor');

  const { getBlocks, columnsCount } = useSelect((select) => {
    const { getBlockCount } = select('core/block-editor');

    return {
      getBlocks: select('core/block-editor').getBlocks,
      columnsCount: getBlockCount(clientId),
    };
  }, []);

  /**
   * Get columns sizes array from layout string
   *
   * @param {string} layout - layout data. Example: `3-6-3`
   *
   * @return {array}.
   */
  function getColumnsFromLayout(layout) {
    const result = [];
    const columnsData = layout.split('-');

    columnsData.forEach((col) => {
      const colAttrs = {
        size: col,
      };

      if (col === 'a') {
        colAttrs.size = 'auto';
      } else if (col === 'g') {
        colAttrs.size = 'grow';
      }

      // responsive.
      if (columnsData.length === 2) {
        colAttrs.md_size = '12';
      }
      if (columnsData.length === 3) {
        colAttrs.lg_size = '12';
      }
      if (columnsData.length === 4) {
        colAttrs.md_size = '12';
        colAttrs.lg_size = '6';
      }
      if (columnsData.length === 5) {
        colAttrs.sm_size = '12';
        colAttrs.md_size = '5';
        colAttrs.lg_size = '4';
      }
      if (columnsData.length === 6) {
        colAttrs.sm_size = '6';
        colAttrs.md_size = '4';
        colAttrs.lg_size = '3';
      }

      result.push(colAttrs);
    });

    return result;
  }

  /**
   * Select predefined layout.
   *
   * @param {String} layout layout string.
   */
  function onLayoutSelect(layout) {
    const columnsData = getColumnsFromLayout(layout);
    const newInnerBlocks = [];

    columnsData.forEach((colAttrs) => {
      newInnerBlocks.push(createBlock('ghostkit/grid-column', colAttrs));
    });

    replaceInnerBlocks(clientId, newInnerBlocks, false);
  }

  /**
   * Layouts selector when no columns selected.
   *
   * @return {jsx}.
   */
  function getLayoutsSelector() {
    let layouts = [
      '12',
      '6-6',
      '4-4-4',
      '3-3-3-3',

      '5-7',
      '7-5',
      '3-3-6',
      '3-6-3',

      '6-3-3',
      '2-8-2',
      'g-g-g-g-g',
      '2-2-2-2-2-2',
    ];
    layouts = applyFilters('ghostkit.editor.grid.layouts', layouts, props);

    return (
      <Placeholder
        icon={getIcon('block-grid')}
        label={__('Grid', '@@text_domain')}
        instructions={__('Select one layout to get started.', '@@text_domain')}
        className="ghostkit-select-layout"
      >
        <div className="ghostkit-grid-layout-preview">
          {layouts.map((layout) => {
            const columnsData = getColumnsFromLayout(layout);

            return (
              <Button
                key={`layout-${layout}`}
                className="ghostkit-grid-layout-preview-btn ghostkit-grid"
                onClick={() => onLayoutSelect(layout)}
              >
                {columnsData.map((colAttrs, i) => {
                  const colName = `layout-${layout}-col-${i}`;

                  return (
                    <div
                      key={colName}
                      className={classnames('ghostkit-col', `ghostkit-col-${colAttrs.size}`)}
                    />
                  );
                })}
              </Button>
            );
          })}
        </div>
        <Button
          isPrimary
          onClick={() => {
            setIsTemplatesModalOpen(true);
          }}
        >
          {__('Select Template', '@@text_domain')}
        </Button>
        {isTemplatesModalOpen || props.attributes.isTemplatesModalOnly ? (
          <TemplatesModal
            replaceBlockId={clientId}
            onRequestClose={() => {
              setIsTemplatesModalOpen(false);

              if (props.attributes.isTemplatesModalOnly) {
                removeBlock(clientId);
              }
            }}
          />
        ) : (
          ''
        )}
      </Placeholder>
    );
  }

  /**
   * Updates the column count
   *
   * @param {number} newColumns New column count.
   */
  function updateColumns(newColumns) {
    // Remove Grid block.
    if (newColumns < 1) {
      removeBlock(clientId);

      // Add new columns.
    } else if (newColumns > columnsCount) {
      const newCount = newColumns - columnsCount;
      const newInnerBlocks = [...getBlocks(clientId)];

      for (let i = 1; i <= newCount; i += 1) {
        newInnerBlocks.push(createBlock('ghostkit/grid-column', { size: 3 }));
      }

      replaceInnerBlocks(clientId, newInnerBlocks, false);

      // Remove columns.
    } else if (newColumns < columnsCount) {
      const newInnerBlocks = [...getBlocks(clientId)];
      newInnerBlocks.splice(newColumns, columnsCount - newColumns);

      replaceInnerBlocks(clientId, newInnerBlocks, false);
    }
  }

  let className = classnames(
    'ghostkit-grid',
    `ghostkit-grid-gap-${gap}`,
    verticalAlign ? `ghostkit-grid-align-items-${verticalAlign}` : false,
    horizontalAlign ? `ghostkit-grid-justify-content-${horizontalAlign}` : false
  );

  // background
  const background = applyFilters('ghostkit.editor.grid.background', '', props);

  if (background) {
    className = classnames(className, 'ghostkit-grid-with-bg');
  }

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({
    className,
  });

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks: ['ghostkit/grid-column'],
    orientation: 'horizontal',
    renderAppender: false,
  });

  return (
    <div {...innerBlocksProps}>
      {columnsCount > 0 ? (
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon={getIcon('icon-vertical-top')}
              title={__('Content Vertical Start', '@@text_domain')}
              onClick={() => setAttributes({ verticalAlign: '' })}
              isActive={verticalAlign === ''}
            />
            <ToolbarButton
              icon={getIcon('icon-vertical-center')}
              title={__('Content Vertical Center', '@@text_domain')}
              onClick={() => setAttributes({ verticalAlign: 'center' })}
              isActive={verticalAlign === 'center'}
            />
            <ToolbarButton
              icon={getIcon('icon-vertical-bottom')}
              title={__('Content Vertical End', '@@text_domain')}
              onClick={() => setAttributes({ verticalAlign: 'end' })}
              isActive={verticalAlign === 'end'}
            />
          </ToolbarGroup>
        </BlockControls>
      ) : (
        ''
      )}
      <InspectorControls>
        <ApplyFilters name="ghostkit.editor.controls" attribute="columns" props={props}>
          <PanelBody>
            <RangeControl
              label={__('Columns', '@@text_domain')}
              value={columnsCount}
              onChange={(value) => updateColumns(value)}
              min={1}
              max={12}
              allowCustomMax
            />
          </PanelBody>
        </ApplyFilters>
      </InspectorControls>
      {columnsCount > 0 ? (
        <InspectorControls>
          <PanelBody>
            <ToggleGroup
              label={__('Vertical alignment', '@@text_domain')}
              value={verticalAlign}
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
                setAttributes({ verticalAlign: value });
              }}
            />
            <ToggleGroup
              label={__('Horizontal alignment', '@@text_domain')}
              value={horizontalAlign}
              options={[
                {
                  label: getIcon('icon-horizontal-start'),
                  value: '',
                },
                {
                  label: getIcon('icon-horizontal-center'),
                  value: 'center',
                },
                {
                  label: getIcon('icon-horizontal-end'),
                  value: 'end',
                },
                {
                  label: getIcon('icon-horizontal-around'),
                  value: 'around',
                },
                {
                  label: getIcon('icon-horizontal-between'),
                  value: 'between',
                },
              ]}
              onChange={(value) => {
                setAttributes({ horizontalAlign: value });
              }}
            />
          </PanelBody>
          <PanelBody>
            <GapSettings
              gap={gap}
              gapCustom={gapCustom}
              gapVerticalCustom={gapVerticalCustom}
              onChange={(data) => {
                setAttributes(data);
              }}
              allowVerticalGap
            />
          </PanelBody>
        </InspectorControls>
      ) : (
        ''
      )}
      <InspectorControls>
        <div className="ghostkit-background-controls">
          <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={props} />
        </div>
      </InspectorControls>
      {columnsCount > 0 ? (
        <Fragment>
          {background}
          {!isSelected ? (
            <div className="ghostkit-grid-button-select">
              <Tooltip text={__('Select Grid', '@@text_domain')}>{getIcon('block-grid')}</Tooltip>
            </div>
          ) : (
            ''
          )}
          <div className="ghostkit-grid-inner">{children}</div>
        </Fragment>
      ) : (
        getLayoutsSelector()
      )}
    </div>
  );
}
