/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import metadata from './block.json';

const { applyFilters } = wp.hooks;

const {
  RichText,
  useBlockProps,
  useInnerBlocksProps: __stableUseInnerBlocksProps,
  __experimentalUseInnerBlocksProps,
} = wp.blockEditor;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { version, date } = props.attributes;

  let className = 'ghostkit-changelog';

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });
  const innerBlockProps = useInnerBlocksProps.save({ className: 'ghostkit-changelog-more' });

  return (
    <div {...blockProps}>
      {!RichText.isEmpty(version) ? (
        <RichText.Content tagName="span" className="ghostkit-changelog-version" value={version} />
      ) : (
        ''
      )}
      {!RichText.isEmpty(date) ? (
        <RichText.Content tagName="h2" className="ghostkit-changelog-date" value={date} />
      ) : (
        ''
      )}
      <div {...innerBlockProps} />
    </div>
  );
}
