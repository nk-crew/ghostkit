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

const { Component } = wp.element;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { svg, flipVertical, flipHorizontal } = this.props.attributes;

    let className = classnames('ghostkit-shape-divider', {
      'ghostkit-shape-divider-flip-vertical': flipVertical,
      'ghostkit-shape-divider-flip-horizontal': flipHorizontal,
    });

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      // eslint-disable-next-line react/no-danger
      <div className={className} dangerouslySetInnerHTML={{ __html: maybeDecode(svg) }} />
    );
  }
}

export default BlockSave;
