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
  const { attributes } = props;
  const { url, target, ariaLabel, rel, icon } = attributes;

  const Tag = url ? 'a' : 'div';

  let className = 'ghostkit-icon';
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

  return (
    <Tag {...blockProps}>
      <Icon icon={icon} attributes={attributes} />
    </Tag>
  );
}

function Icon({ icon, attributes }) {
  const borderProps = getBorderClassesAndStyles(attributes);
  const colorProps = getColorClassesAndStyles(attributes);
  const spacingProps = getSpacingClassesAndStyles(attributes);

  const className = classnames(
    'ghostkit-icon-inner',
    borderProps.className,
    colorProps.className,
    spacingProps.className
  );

  return <IconPicker.Render name={icon} tag="div" className={className} />;
}
