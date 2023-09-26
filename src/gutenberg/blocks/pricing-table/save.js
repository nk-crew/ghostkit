/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { useBlockProps, useInnerBlocksProps } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { count, gap, verticalAlign, horizontalAlign } = props.attributes;

  let className = classnames(
    'ghostkit-pricing-table',
    `ghostkit-pricing-table-gap-${gap}`,
    count ? `ghostkit-pricing-table-items-${count}` : false,
    verticalAlign ? `ghostkit-pricing-table-align-vertical-${verticalAlign}` : false,
    horizontalAlign ? `ghostkit-pricing-table-align-horizontal-${horizontalAlign}` : false
  );

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });
  const innerBlocksProps = useInnerBlocksProps.save({ className: 'ghostkit-pricing-table-inner' });

  return (
    <div {...blockProps}>
      <div {...innerBlocksProps} />
    </div>
  );
}
