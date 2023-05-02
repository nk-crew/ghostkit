/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getColClass from './get-col-class';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const {
  useBlockProps,
  useInnerBlocksProps: __stableUseInnerBlocksProps,
  __experimentalUseInnerBlocksProps,
} = wp.blockEditor;

const { name } = metadata;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  let className = getColClass(props);

  // background
  const background = applyFilters('ghostkit.blocks.grid-column.background', '', {
    ...{
      name,
    },
    ...props,
  });

  if (background) {
    className = classnames(className, 'ghostkit-col-with-bg');
  }

  const blockProps = useBlockProps.save({
    className,
  });
  const innerBlocksProps = useInnerBlocksProps.save({ className: 'ghostkit-col-content' });

  return (
    <div {...blockProps}>
      {background}
      <div {...innerBlocksProps} />
    </div>
  );
}
