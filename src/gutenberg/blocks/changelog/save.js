/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import metadata from './block.json';

const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { InnerBlocks, RichText } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { version, date } = this.props.attributes;

    let className = 'ghostkit-changelog';

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      <div className={className}>
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
        <div className="ghostkit-changelog-more">
          <InnerBlocks.Content />
        </div>
      </div>
    );
  }
}

export default BlockSave;
