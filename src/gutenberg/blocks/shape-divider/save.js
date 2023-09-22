/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';

import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { useBlockProps } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { svg, flipVertical, flipHorizontal } = props.attributes;

  let className = classnames('ghostkit-shape-divider', {
    'ghostkit-shape-divider-flip-vertical': flipVertical,
    'ghostkit-shape-divider-flip-horizontal': flipHorizontal,
  });

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({
    className,
    dangerouslySetInnerHTML: { __html: maybeDecode(svg) },
  });

  return <div {...blockProps} />;
}
