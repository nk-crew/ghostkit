/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

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
  const { icon, type } = props.attributes;

  let className = `ghostkit-divider ghostkit-divider-type-${type}`;

  if (icon) {
    className = classnames(className, 'ghostkit-divider-with-icon');
  }

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });

  return (
    <div {...blockProps}>
      {icon ? <IconPicker.Render name={icon} tag="div" className="ghostkit-divider-icon" /> : ''}
    </div>
  );
}
