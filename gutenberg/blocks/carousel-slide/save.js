/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import metadata from './block.json';

import { applyFilters } from '@wordpress/hooks';

import {
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  let className = 'ghostkit-carousel-slide';

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });
  const innerBlockProps = useInnerBlocksProps.save(blockProps);

  return <div {...innerBlockProps} />;
}
