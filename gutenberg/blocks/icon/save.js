/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

import metadata from './block.json';

const { name } = metadata;

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { useBlockProps } = wp.blockEditor;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { attributes } = props;
  const { flipV, flipH } = attributes;

  let className = classnames('ghostkit-icon', {
    'ghostkit-icon-flip-vertical': flipV,
    'ghostkit-icon-flip-horizontal': flipH,
  });

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{ name },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });

  return (
    <div {...blockProps}>
      <Icon attributes={props.attributes} />
    </div>
  );
}

function Icon({ attributes }) {
  const { icon, url, target, ariaLabel, rel } = attributes;

  const tag = url ? 'a' : 'div';
  const attrs = {};

  if (tag === 'a') {
    attrs.href = url;
    attrs.target = target || null;
    attrs.rel = rel || null;
    attrs.ariaLabel = ariaLabel || null;
  }

  return <IconPicker.Render {...attrs} name={icon} tag={tag} className="ghostkit-icon-inner" />;
}
