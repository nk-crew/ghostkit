/* eslint-disable no-param-reassign */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import RemoveButton from '../../components/remove-button';
import EditorStyles from '../../components/editor-styles';
import getUniqueSlug from '../../utils/get-unique-slug';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, BaseControl, ToggleControl, Button, Tooltip } = wp.components;

const { RichText, InspectorControls, InnerBlocks, BlockControls, AlignmentToolbar } =
  wp.blockEditor;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

const { createBlock } = wp.blocks;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.getTabsTemplate = this.getTabsTemplate.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.changeLabel = this.changeLabel.bind(this);
    this.removeTab = this.removeTab.bind(this);
  }

  /**
   * Returns the layouts configuration for a given number of tabs.
   *
   * @param {number} attributes tabs attributes.
   *
   * @return {Object[]} Tabs layout configuration.
   */
  getTabsTemplate() {
    const { tabsData = [] } = this.props.attributes;

    const result = tabsData.map((tabData) => ['ghostkit/tabs-tab-v2', tabData]);

    return result;
  }

  getTabs() {
    return this.props.block.innerBlocks;
  }

  changeLabel(value, i) {
    const { setAttributes, attributes, updateBlockAttributes } = this.props;

    const { tabsData = [] } = attributes;

    const tabs = this.getTabs();

    if (tabs[i]) {
      const newSlug = getUniqueSlug(`tab ${value}`, tabs[i].clientId);

      const newTabsData = tabsData.map((oldTabData, newIndex) => {
        if (i === newIndex) {
          return {
            ...oldTabData,
            ...{
              title: value,
              slug: newSlug,
            },
          };
        }

        return oldTabData;
      });

      setAttributes({
        tabActive: newSlug,
        tabsData: newTabsData,
      });
      updateBlockAttributes(tabs[i].clientId, {
        slug: newSlug,
      });
    }
  }

  removeTab(i) {
    const { setAttributes, attributes, block, getBlocks, replaceInnerBlocks } = this.props;

    const { tabsData = [] } = attributes;

    if (block.innerBlocks.length <= 1) {
      this.props.removeBlock(block.clientId);
    } else if (block.innerBlocks[i]) {
      this.props.removeBlock(block.innerBlocks[i].clientId);

      if (tabsData[i]) {
        const newTabsData = [...tabsData];
        newTabsData.splice(i, 1);

        const innerBlocks = [...getBlocks(block.clientId)];
        innerBlocks.splice(i, 1);

        replaceInnerBlocks(block.clientId, innerBlocks, false);

        setAttributes({
          tabsData: newTabsData,
        });
      }
    }
  }

  render() {
    const {
      attributes,
      setAttributes,
      isSelectedBlockInRoot,
      clientId,
      getBlocks,
      replaceInnerBlocks,
    } = this.props;

    let { className = '' } = this.props;

    const { tabActive, buttonsVerticalAlign, buttonsAlign, tabsData = [] } = attributes;

    className = classnames(
      className,
      'ghostkit-tabs',
      buttonsVerticalAlign ? 'ghostkit-tabs-buttons-vertical' : ''
    );

    className = applyFilters('ghostkit.editor.className', className, this.props);

    let buttonsAlignValForControl = buttonsAlign;
    if (buttonsAlignValForControl === 'start') {
      buttonsAlignValForControl = 'left';
    } else if (buttonsAlignValForControl === 'end') {
      buttonsAlignValForControl = 'right';
    }

    return (
      <Fragment>
        <BlockControls>
          <AlignmentToolbar
            value={buttonsAlignValForControl}
            onChange={(value) => {
              if (value === 'left') {
                value = 'start';
              } else if (value === 'right') {
                value = 'end';
              }
              setAttributes({ buttonsAlign: value });
            }}
            controls={['left', 'center', 'right']}
          />
        </BlockControls>
        <InspectorControls>
          <PanelBody>
            <ToggleControl
              label={__('Vertical Tabs', '@@text_domain')}
              checked={!!buttonsVerticalAlign}
              onChange={(val) => setAttributes({ buttonsVerticalAlign: val })}
            />
            <BaseControl label={__('Tabs Align', '@@text_domain')}>
              <div>
                <AlignmentToolbar
                  value={buttonsAlignValForControl}
                  onChange={(value) => {
                    if (value === 'left') {
                      value = 'start';
                    } else if (value === 'right') {
                      value = 'end';
                    }
                    setAttributes({ buttonsAlign: value });
                  }}
                  controls={['left', 'center', 'right']}
                  isCollapsed={false}
                />
              </div>
            </BaseControl>
          </PanelBody>
        </InspectorControls>
        <div className={className} data-tab-active={tabActive}>
          <div
            className={classnames(
              'ghostkit-tabs-buttons',
              `ghostkit-tabs-buttons-align-${buttonsAlign}`
            )}
          >
            {tabsData.map((tabData, i) => {
              const { slug, title } = tabData;
              const selected = tabActive === slug;
              const tabName = `tab_button_${i}`;

              return (
                <div
                  className={classnames(
                    'ghostkit-tabs-buttons-item',
                    selected ? 'ghostkit-tabs-buttons-item-active' : ''
                  )}
                  key={tabName}
                >
                  <RichText
                    tagName="span"
                    placeholder={__('Tab label', '@@text_domain')}
                    value={title}
                    unstableOnFocus={() => setAttributes({ tabActive: slug })}
                    onChange={(value) => {
                      this.changeLabel(value, i);
                    }}
                    withoutInteractiveFormatting
                    keepPlaceholderOnFocus
                  />
                  <RemoveButton
                    show={isSelectedBlockInRoot}
                    tooltipText={__('Remove tab?', '@@text_domain')}
                    onRemove={() => {
                      this.removeTab(i);
                    }}
                  />
                </div>
              );
            })}
            {isSelectedBlockInRoot ? (
              <Tooltip text={__('Add Tab', '@@text_domain')}>
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
                    const newTabsData = [...tabsData];
                    const newDataLength = tabsData.length + 1;

                    newTabsData.push({
                      slug: `tab-${newDataLength}`,
                      title: `Tab ${newDataLength}`,
                    });

                    const block = createBlock('ghostkit/tabs-tab-v2', {
                      slug: `tab-${newDataLength}`,
                      title: `Tab ${newDataLength}`,
                    });

                    let innerBlocks = getBlocks(clientId);
                    innerBlocks = [...innerBlocks, block];

                    replaceInnerBlocks(clientId, innerBlocks, false);

                    setAttributes({ tabsData: newTabsData });
                  }}
                />
              </Tooltip>
            ) : (
              ''
            )}
          </div>
          <div className="ghostkit-tabs-content">
            <InnerBlocks
              template={this.getTabsTemplate()}
              templateLock="all"
              allowedBlocks={['ghostkit/tabs-tab-v2']}
            />
          </div>
        </div>

        <EditorStyles
          styles={[
            {
              // We need to add styles for `> .wp-block` because this wrapper added by Gutenberg when used Wide or Full alignment.
              // Thanks to https://github.com/nk-crew/ghostkit/issues/123.
              css: `
                        [data-block="${this.props.clientId}"] > .ghostkit-tabs > .ghostkit-tabs-content > .block-editor-inner-blocks > .block-editor-block-list__layout [data-tab="${tabActive}"],
                        [data-block="${this.props.clientId}"] > .wp-block > .ghostkit-tabs > .ghostkit-tabs-content > .block-editor-inner-blocks > .block-editor-block-list__layout [data-tab="${tabActive}"] {
                            display: block;
                        }
                        `,
            },
          ]}
        />
      </Fragment>
    );
  }
}

export default compose([
  withSelect((select, ownProps) => {
    const { getBlock, getBlocks, isBlockSelected, hasSelectedInnerBlock } =
      select('core/block-editor');

    const { clientId } = ownProps;

    return {
      getBlocks,
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
