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
const {
  useBlockProps,
  __experimentalGetBorderClassesAndStyles: getBorderClassesAndStyles,
  __experimentalGetColorClassesAndStyles: getColorClassesAndStyles,
  __experimentalGetSpacingClassesAndStyles: getSpacingClassesAndStyles,
} = wp.blockEditor;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  let className = 'ghostkit-icon';
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
  const borderProps = getBorderClassesAndStyles(attributes);
  const colorProps = getColorClassesAndStyles(attributes);
  const spacingProps = getSpacingClassesAndStyles(attributes);

  const tag = url ? 'a' : 'div';

  const attrs = {};

  if (tag === 'a') {
    attrs.href = url;
    attrs.target = target || null;
    attrs.rel = rel || null;
    attrs.ariaLabel = ariaLabel || null;
  }

  const className = classnames(
    'ghostkit-icon-inner',
    borderProps.className,
    colorProps.className,
    spacingProps.className
  );

  return <IconPicker.Render {...attrs} name={icon} tag={tag} className={className} />;
}
