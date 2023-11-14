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
const { useBlockProps, useInnerBlocksProps } = wp.blockEditor;

const { applyFilters } = wp.hooks;

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { attributes } = props;

  const { date, units, unitsAlign } = attributes;

  let className = classnames(
    'ghostkit-countdown',
    unitsAlign ? `ghostkit-countdown-units-align-${unitsAlign}` : ''
  );

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className, 'data-date': date });
  const innerBlockProps = useInnerBlocksProps.save({
    className: 'ghostkit-countdown-expire-action',
  });

  return (
    <div {...blockProps}>
      {units.map((unitName) => (
        <div
          key={unitName}
          className={classnames('ghostkit-countdown-unit', `ghostkit-countdown-unit-${unitName}`)}
        >
          <span className="ghostkit-countdown-unit-number">00</span>
          <span className="ghostkit-countdown-unit-label">{unitName}</span>
        </div>
      ))}
      <div {...innerBlockProps} />
    </div>
  );
}
