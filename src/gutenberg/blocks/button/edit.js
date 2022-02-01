/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import GapSettings from '../../components/gap-settings';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, BaseControl, Button, Tooltip } = wp.components;

const { InspectorControls, InnerBlocks, BlockControls, BlockAlignmentToolbar } = wp.blockEditor;

const { createBlock } = wp.blocks;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

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
   * Returns the layouts configuration for a given number of items.
   *
   * @return {Object[]} Items layout configuration.
   */
  getInnerBlocksTemplate() {
    const { attributes } = this.props;

    const { count } = attributes;

    const result = [];

    if (count > 0) {
      for (let k = 1; k <= count; k += 1) {
        result.push(['ghostkit/button-single']);
      }
    }

    return result;
  }

  /**
   * Update current items number.
   */
  maybeUpdateItemsCount() {
    const { count } = this.props.attributes;

    const { block, setAttributes } = this.props;

    if (block && block.innerBlocks && count !== block.innerBlocks.length) {
      setAttributes({
        count: block.innerBlocks.length,
      });
    }
  }

  render() {
    const { attributes, setAttributes, isSelectedBlockInRoot, insertButtonSingle } = this.props;

    let { className = '' } = this.props;

    const { align, gap, gapCustom } = attributes;

    className = classnames(
      'ghostkit-button-wrapper',
      gap ? `ghostkit-button-wrapper-gap-${gap}` : false,
      align && align !== 'none' ? `ghostkit-button-wrapper-align-${align}` : false,
      className
    );

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <BlockControls>
          <BlockAlignmentToolbar
            value={align}
            onChange={(value) => setAttributes({ align: value })}
            controls={['left', 'center', 'right']}
          />
        </BlockControls>
        <InspectorControls>
          <PanelBody>
            <GapSettings
              gap={gap}
              gapCustom={gapCustom}
              onChange={(data) => {
                setAttributes(data);
              }}
            />
            <BaseControl label={__('Align', '@@text_domain')}>
              <div>
                <BlockAlignmentToolbar
                  value={align}
                  onChange={(value) => setAttributes({ align: value })}
                  controls={['left', 'center', 'right']}
                  isCollapsed={false}
                />
              </div>
            </BaseControl>
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          <InnerBlocks
            template={this.getInnerBlocksTemplate()}
            allowedBlocks={['ghostkit/button-single']}
            renderAppender={
              isSelectedBlockInRoot
                ? () => (
                    // eslint-disable-next-line react/jsx-indent
                    <Tooltip text={__('Add Button', '@@text_domain')}>
                      <Button
                        icon={
                          // eslint-disable-next-line react/jsx-wrap-multilines
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            role="img"
                            ariaHidden="true"
                            focusable="false"
                          >
                            <path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" />
                          </svg>
                        }
                        onClick={() => {
                          insertButtonSingle();
                        }}
                      />
                    </Tooltip>
                    // eslint-disable-next-line indent
                  )
                : undefined
            }
            orientation="horizontal"
          />
        </div>
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
      insertButtonSingle() {
        insertBlock(createBlock('ghostkit/button-single'), undefined, clientId);
      },
    };
  }),
])(BlockEdit);
