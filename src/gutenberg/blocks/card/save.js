/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const {
  useBlockProps,
  useInnerBlocksProps,
  __experimentalGetBorderClassesAndStyles: getBorderClassesAndStyles,
} = wp.blockEditor;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { attributes } = props;
  const { url, target, ariaLabel, rel } = attributes;

  const Tag = url ? 'a' : 'div';

  const borderProps = getBorderClassesAndStyles(attributes);

  let className = classnames('ghostkit-card', borderProps.className);
  className = applyFilters('ghostkit.blocks.className', className, {
    ...{ name },
    ...props,
  });

  const attrs = {};

  if (Tag === 'a') {
    attrs.href = url;
    attrs.target = target || null;
    attrs.rel = rel || null;
    attrs.ariaLabel = ariaLabel || null;
  }

  const blockProps = useBlockProps.save({ className, ...attrs });
  const innerBlockProps = useInnerBlocksProps.save(blockProps);

  return <Tag {...innerBlockProps} />;
}
