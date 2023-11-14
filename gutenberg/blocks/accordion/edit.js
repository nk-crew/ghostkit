/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { useEffect } = wp.element;
const { PanelBody, ToggleControl, SelectControl, Button } = wp.components;
const { InspectorControls, useBlockProps, useInnerBlocksProps } = wp.blockEditor;
const { createBlock } = wp.blocks;
const { useSelect, useDispatch } = wp.data;

const accordionItemBlockName = 'ghostkit/accordion-item';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, clientId } = props;

  let { className = '' } = props;

  const { itemsCount, collapseOne, collapseTitleTag } = attributes;

  const { isSelectedBlockInRoot, count } = useSelect(
    (select) => {
      const { isBlockSelected, hasSelectedInnerBlock, getBlockCount } = select('core/block-editor');

      return {
        isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
        count: getBlockCount(clientId),
      };
    },
    [clientId]
  );

  useEffect(() => {
    if (count !== itemsCount) {
      setAttributes({
        itemsCount: count,
      });
    }
  }, [count, itemsCount]);

  const { insertBlock } = useDispatch('core/block-editor');

  function insertAccordionItem() {
    insertBlock(createBlock(accordionItemBlockName), undefined, clientId);
  }

  className = classnames(className, 'ghostkit-accordion');

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({
    className,
  });

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks: [accordionItemBlockName],
    template: [[accordionItemBlockName], [accordionItemBlockName]],
  });

  return (
    <>
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
      <div {...innerBlocksProps} />
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
    </>
  );
}
