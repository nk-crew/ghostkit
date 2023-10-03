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
const { PanelBody, BaseControl, ToggleControl, SelectControl, Button, Tooltip } = wp.components;
const { useSelect, useDispatch } = wp.data;
const { createBlock } = wp.blocks;
const {
  RichText,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
  useBlockProps,
  useInnerBlocksProps,
} = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, clientId } = props;
  let { className = '' } = props;

  const { tabActive, trigger, buttonsVerticalAlign, buttonsAlign, tabsData = [] } = attributes;

  const { getBlocks, block, isSelectedBlockInRoot } = useSelect((select) => {
    const {
      getBlock,
      getBlocks: selectGetBlocks,
      isBlockSelected,
      hasSelectedInnerBlock,
    } = select('core/block-editor');

    return {
      getBlocks: selectGetBlocks,
      block: getBlock(clientId),
      isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
    };
  });

  const { updateBlockAttributes, removeBlock, replaceInnerBlocks } =
    useDispatch('core/block-editor');

  /**
   * Returns the layouts configuration for a given number of tabs.
   *
   * @param {number} attributes tabs attributes.
   *
   * @return {Object[]} Tabs layout configuration.
   */
  const getTabsTemplate = () => {
    return tabsData.map((tabData) => ['ghostkit/tabs-tab-v2', tabData]);
  };

  const getTabs = () => {
    return block.innerBlocks;
  };

  const changeLabel = (value, i) => {
    const tabs = getTabs();

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
  };

  const removeTab = (i) => {
    if (block.innerBlocks.length <= 1) {
      removeBlock(block.clientId);
    } else if (block.innerBlocks[i]) {
      removeBlock(block.innerBlocks[i].clientId);

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
  };

  className = classnames(
    className,
    'ghostkit-tabs',
    buttonsVerticalAlign ? 'ghostkit-tabs-buttons-vertical' : ''
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  let buttonsAlignValForControl = buttonsAlign;
  if (buttonsAlignValForControl === 'start') {
    buttonsAlignValForControl = 'left';
  } else if (buttonsAlignValForControl === 'end') {
    buttonsAlignValForControl = 'right';
  }

  const blockProps = useBlockProps({ className, 'data-tab-active': tabActive });
  const innerBlockProps = useInnerBlocksProps(
    { className: 'ghostkit-tabs-content' },
    {
      template: getTabsTemplate(),
      templateLock: 'all',
      allowedBlocks: ['ghostkit/tabs-tab-v2'],
    }
  );

  return (
    <>
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
          <SelectControl
            label={__('Select Tab Trigger', '@@text_domain')}
            value={trigger}
            options={[
              {
                value: '',
                label: __('Click', '@@text_domain'),
              },
              {
                value: 'hover',
                label: __('Hover', '@@text_domain'),
              },
            ]}
            onChange={(val) => {
              setAttributes({ trigger: val });
            }}
          />
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
      <div {...blockProps}>
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
                  onFocus={() => setAttributes({ tabActive: slug })}
                  onChange={(value) => {
                    changeLabel(value, i);
                  }}
                  withoutInteractiveFormatting
                />
                <RemoveButton
                  show={isSelectedBlockInRoot}
                  tooltipText={__('Remove tab?', '@@text_domain')}
                  onRemove={() => {
                    removeTab(i);
                  }}
                />
              </div>
            );
          })}
          {isSelectedBlockInRoot ? (
            <Tooltip text={__('Add Tab', '@@text_domain')}>
              <Button
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
                  const newTabsData = [...tabsData];
                  const newDataLength = tabsData.length + 1;

                  newTabsData.push({
                    slug: `tab-${newDataLength}`,
                    title: `Tab ${newDataLength}`,
                  });

                  const newBlock = createBlock('ghostkit/tabs-tab-v2', {
                    slug: `tab-${newDataLength}`,
                    title: `Tab ${newDataLength}`,
                  });

                  let innerBlocks = getBlocks(clientId);
                  innerBlocks = [...innerBlocks, newBlock];

                  replaceInnerBlocks(clientId, innerBlocks, false);

                  setAttributes({ tabsData: newTabsData });
                }}
              />
            </Tooltip>
          ) : (
            ''
          )}
        </div>
        <div {...innerBlockProps} />
      </div>

      <EditorStyles
        styles={
          // We need to add styles for `> .wp-block` because this wrapper added by Gutenberg when used Wide or Full alignment.
          // Thanks to https://github.com/nk-crew/ghostkit/issues/123.
          `
          [data-block="${clientId}"] > .ghostkit-tabs-content > [data-tab="${tabActive}"] {
              display: block;
          }
        `
        }
      />
    </>
  );
}
