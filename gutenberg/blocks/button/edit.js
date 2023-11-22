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
import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';

import { useEffect } from '@wordpress/element';

import { PanelBody, BaseControl, Tooltip, Button } from '@wordpress/components';

import {
  InspectorControls,
  BlockControls,
  BlockAlignmentToolbar,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';

import { createBlock } from '@wordpress/blocks';

import { useSelect, useDispatch } from '@wordpress/data';

const buttonBlockName = 'ghostkit/button-single';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, clientId } = props;

  let { className = '' } = props;

  const { align, gap, gapCustom, gapVerticalCustom, count } = attributes;

  const { block, isSelectedBlockInRoot } = useSelect((select) => {
    const { getBlock, isBlockSelected, hasSelectedInnerBlock } = select('core/block-editor');

    return {
      block: getBlock(clientId),
      isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
    };
  }, []);

  const { insertBlock } = useDispatch('core/block-editor');

  useEffect(() => {
    if (block && block.innerBlocks && count !== block.innerBlocks.length) {
      setAttributes({
        count: block.innerBlocks.length,
      });
    }
  }, [block?.innerBlocks?.length]);

  /**
   * Insert a single button.
   */
  function insertButtonSingle() {
    insertBlock(createBlock(buttonBlockName), undefined, clientId);
  }

  className = classnames(
    'ghostkit-button-wrapper',
    gap ? `ghostkit-button-wrapper-gap-${gap}` : false,
    align && align !== 'none' ? `ghostkit-button-wrapper-align-${align}` : false,
    className
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({
    className,
  });

  const { children, ...innerBlocksProps } = useInnerBlocksProps(
    {
      className: 'ghostkit-button-wrapper-inner',
    },
    {
      allowedBlocks: [buttonBlockName],
      __experimentalDirectInsert: true,
      template: [[buttonBlockName]],
      orientation: 'horizontal',
      templateInsertUpdatesSelection: true,
      renderAppender: isSelectedBlockInRoot
        ? () => (
            <Tooltip text={__('Add Button', '@@text_domain')}>
              <Button
                className="block-list-appender__toggle block-editor-button-block-appender"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    aria-hidden="true"
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
          )
        : undefined,
    }
  );

  return (
    <div {...blockProps}>
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
            gapVerticalCustom={gapVerticalCustom}
            onChange={(data) => {
              setAttributes(data);
            }}
            allowVerticalGap
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
      <div {...innerBlocksProps}>{children}</div>
    </div>
  );
}
