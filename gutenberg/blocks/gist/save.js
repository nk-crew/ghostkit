/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { name } = metadata;

const { useBlockProps } = wp.blockEditor;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { url, file, caption, showFooter, showLineNumbers } = props.attributes;

  let className = 'ghostkit-gist';
  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({
    className,
    'data-url': url,
    'data-file': file,
    'data-caption': caption,
    'data-show-footer': showFooter ? 'true' : 'false',
    'data-show-line-numbers': showLineNumbers ? 'true' : 'false',
  });

  return <div {...blockProps} />;
}
