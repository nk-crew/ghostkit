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
import { TemplatesModal } from '../../plugins/templates';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { Button, PanelBody, RangeControl, Placeholder, ToolbarGroup, ToolbarButton, Tooltip } =
  wp.components;

const { InspectorControls, InnerBlocks, BlockControls } = wp.blockEditor;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

const { createBlock } = wp.blocks;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTemplatesModalOpen: false,
    };

    this.getColumnsFromLayout = this.getColumnsFromLayout.bind(this);
    this.onLayoutSelect = this.onLayoutSelect.bind(this);
    this.getLayoutsSelector = this.getLayoutsSelector.bind(this);
    this.updateColumns = this.updateColumns.bind(this);
  }

  /**
   * Select predefined layout.
   *
   * @param {String} layout layout string.
   */
  onLayoutSelect(layout) {
    const { block, replaceInnerBlocks } = this.props;

    const columnsData = this.getColumnsFromLayout(layout);
    const newInnerBlocks = [];

    columnsData.forEach((colAttrs) => {
      newInnerBlocks.push(createBlock('ghostkit/grid-column', colAttrs));
    });

    replaceInnerBlocks(block.clientId, newInnerBlocks, false);
  }

  /**
   * Get columns sizes array from layout string
   *
   * @param {string} layout - layout data. Example: `3-6-3`
   *
   * @return {array}.
   */
  // eslint-disable-next-line class-methods-use-this
  getColumnsFromLayout(layout) {
    const result = [];
    const columnsData = layout.split('-');

    columnsData.forEach((col) => {
      const colAttrs = {
        size: col === 'a' ? 'auto' : col,
      };

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
   * Layouts selector when no columns selected.
   *
   * @return {jsx}.
   */
  getLayoutsSelector() {
    const { removeBlock } = this.props;

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
      'a-a-a-a-a',
      '2-2-2-2-2-2',
    ];
    layouts = applyFilters('ghostkit.editor.grid.layouts', layouts, this.props);

    return (
      <Placeholder
        icon={getIcon('block-grid')}
        label={__('Grid', '@@text_domain')}
        instructions={__('Select one layout to get started.', '@@text_domain')}
        className="ghostkit-select-layout"
      >
        <div className="ghostkit-grid-layout-preview">
          {layouts.map((layout) => {
            const columnsData = this.getColumnsFromLayout(layout);

            return (
              <Button
                key={`layout-${layout}`}
                className="ghostkit-grid-layout-preview-btn ghostkit-grid"
                onClick={() => this.onLayoutSelect(layout)}
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
            this.setState({ isTemplatesModalOpen: true });
          }}
        >
          {__('Select Template', '@@text_domain')}
        </Button>
        {this.state.isTemplatesModalOpen || this.props.attributes.isTemplatesModalOnly ? (
          <TemplatesModal
            replaceBlockId={this.props.clientId}
            onRequestClose={() => {
              this.setState({ isTemplatesModalOpen: false });

              if (this.props.attributes.isTemplatesModalOnly) {
                removeBlock(this.props.clientId);
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
  updateColumns(newColumns) {
    const { block, getBlocks, replaceInnerBlocks, columnsCount, removeBlock } = this.props;

    // Remove Grid block.
    if (newColumns < 1) {
      removeBlock(block.clientId);

      // Add new columns.
    } else if (newColumns > columnsCount) {
      const newCount = newColumns - columnsCount;
      const newInnerBlocks = [...getBlocks(block.clientId)];

      for (let i = 1; i <= newCount; i += 1) {
        newInnerBlocks.push(createBlock('ghostkit/grid-column', { size: 3 }));
      }

      replaceInnerBlocks(block.clientId, newInnerBlocks, false);

      // Remove columns.
    } else if (newColumns < columnsCount) {
      const newInnerBlocks = [...getBlocks(block.clientId)];
      newInnerBlocks.splice(newColumns, columnsCount - newColumns);

      replaceInnerBlocks(block.clientId, newInnerBlocks, false);
    }
  }

  render() {
    const { attributes, setAttributes, isSelected, columnsCount } = this.props;

    let { className = '' } = this.props;

    const { gap, gapCustom, verticalAlign, horizontalAlign } = attributes;

    className = classnames(
      className,
      'ghostkit-grid',
      `ghostkit-grid-gap-${gap}`,
      verticalAlign ? `ghostkit-grid-align-items-${verticalAlign}` : false,
      horizontalAlign ? `ghostkit-grid-justify-content-${horizontalAlign}` : false
    );

    // background
    const background = applyFilters('ghostkit.editor.grid.background', '', this.props);

    if (background) {
      className = classnames(className, 'ghostkit-grid-with-bg');
    }

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
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
          <ApplyFilters name="ghostkit.editor.controls" attribute="columns" props={this.props}>
            <PanelBody>
              <RangeControl
                label={__('Columns', '@@text_domain')}
                value={columnsCount}
                onChange={(value) => this.updateColumns(value)}
                min={1}
                max={12}
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
                onChange={(data) => {
                  setAttributes(data);
                }}
              />
            </PanelBody>
          </InspectorControls>
        ) : (
          ''
        )}
        <InspectorControls>
          <div className="ghostkit-background-controls">
            <ApplyFilters
              name="ghostkit.editor.controls"
              attribute="background"
              props={this.props}
            />
          </div>
        </InspectorControls>
        <div className={className}>
          {columnsCount > 0 ? (
            <Fragment>
              {background}
              {!isSelected ? (
                <div className="ghostkit-grid-button-select">
                  <Tooltip text={__('Select Grid', '@@text_domain')}>
                    {getIcon('block-grid')}
                  </Tooltip>
                </div>
              ) : (
                ''
              )}
              <InnerBlocks
                allowedBlocks={['ghostkit/grid-column']}
                orientation="horizontal"
                renderAppender={false}
              />
            </Fragment>
          ) : (
            this.getLayoutsSelector()
          )}
        </div>
      </Fragment>
    );
  }
}

export default compose([
  withSelect((select, ownProps) => {
    const { getBlock, getBlocks, getBlockCount, isBlockSelected, hasSelectedInnerBlock } =
      select('core/block-editor');

    const { clientId } = ownProps;

    return {
      getBlocks,
      columnsCount: getBlockCount(clientId),
      block: getBlock(clientId),
      isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
    };
  }),
  withDispatch((dispatch) => {
    const { updateBlockAttributes, removeBlock, replaceInnerBlocks } =
      dispatch('core/block-editor');

    return {
      updateBlockAttributes,
      removeBlock,
      replaceInnerBlocks,
    };
  }),
])(BlockEdit);
