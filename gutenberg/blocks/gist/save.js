/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

const { name } = metadata;

import { useBlockProps } from '@wordpress/block-editor';

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
