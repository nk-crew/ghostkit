/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, ToggleControl, SelectControl, Button } = wp.components;

const { InspectorControls, InnerBlocks } = wp.blockEditor;

const { createBlock } = wp.blocks;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

const accordionItemBlockName = 'ghostkit/accordion-item';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.maybeUpdateItemsCount = this.maybeUpdateItemsCount.bind(this);
  }

  componentDidMount() {
    this.maybeUpdateItemsCount();
  }

  componentDidUpdate() {
    this.maybeUpdateItemsCount();
  }

  /**
   * Update current items number.
   */
  maybeUpdateItemsCount() {
    const { itemsCount } = this.props.attributes;

    const { block, setAttributes } = this.props;

    if (block && block.innerBlocks && itemsCount !== block.innerBlocks.length) {
      setAttributes({
        itemsCount: block.innerBlocks.length,
      });
    }
  }

  render() {
    const { attributes, setAttributes, isSelectedBlockInRoot, insertAccordionItem } = this.props;

    let { className = '' } = this.props;

    const { collapseOne, collapseTitleTag } = attributes;

    className = classnames(className, 'ghostkit-accordion');

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <ToggleControl
              label={__('Collapse one item only', '@@text_domain')}
              checked={!!collapseOne}
              onChange={(val) => setAttributes({ collapseOne: val })}
            />
            <SelectControl
              label={__('Collapse Title HTML Element', '@@text_domain')}
              value={collapseTitleTag}
              options={[
                {
                  value: 'div',
                  label: __('Default (<div>)', '@@text_domain'),
                },
                {
                  value: 'h2',
                  label: __('<h2>', '@@text_domain'),
                },
                {
                  value: 'h3',
                  label: __('<h3>', '@@text_domain'),
                },
                {
                  value: 'h4',
                  label: __('<h4>', '@@text_domain'),
                },
                {
                  value: 'h5',
                  label: __('<h5>', '@@text_domain'),
                },
                {
                  value: 'h6',
                  label: __('<h6>', '@@text_domain'),
                },
              ]}
              onChange={(value) => setAttributes({ collapseTitleTag: value })}
            />
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          <InnerBlocks
            template={[[accordionItemBlockName], [accordionItemBlockName]]}
            allowedBlocks={[accordionItemBlockName]}
          />
        </div>
        {isSelectedBlockInRoot ? (
          <div className="ghostkit-accordion-add-item">
            <Button
              isSecondary
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  role="img"
                  focusable="false"
                >
                  <path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" />
                </svg>
              }
              onClick={() => {
                insertAccordionItem();
              }}
            >
              {__('Add Accordion Item', '@@text_domain')}
            </Button>
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default compose([
  withSelect((select, ownProps) => {
    const { getBlock, isBlockSelected, hasSelectedInnerBlock } = select('core/block-editor');

    const { clientId } = ownProps;

    return {
      block: getBlock(clientId),
      isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
    };
  }),
  withDispatch((dispatch, ownProps) => {
    const { insertBlock } = dispatch('core/block-editor');

    const { clientId } = ownProps;

    return {
      insertAccordionItem() {
        insertBlock(createBlock(accordionItemBlockName), undefined, clientId);
      },
    };
  }),
])(BlockEdit);
