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
const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

const { applyFilters } = wp.hooks;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { attributes } = this.props;

    const { date, units, unitsAlign } = attributes;

    let className = classnames(
      'ghostkit-countdown',
      unitsAlign ? `ghostkit-countdown-units-align-${unitsAlign}` : ''
    );

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      <div className={className} data-date={date}>
        {units.map((unitName) => (
          <div
            key={unitName}
            className={classnames('ghostkit-countdown-unit', `ghostkit-countdown-unit-${unitName}`)}
          >
            <span className="ghostkit-countdown-unit-number">00</span>
            <span className="ghostkit-countdown-unit-label">{unitName}</span>
          </div>
        ))}
        <div className="ghostkit-countdown-expire-action">
          <InnerBlocks.Content />
        </div>
      </div>
    );
  }
}

export default BlockSave;
