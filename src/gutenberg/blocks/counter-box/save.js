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
const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { InnerBlocks, RichText } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const {
      number,
      animateInViewport,
      numberPosition,
      numberAlign,
      showContent,
      url,
      ariaLabel,
      target,
      rel,
    } = this.props.attributes;

    let { animateInViewportFrom } = this.props.attributes;

    animateInViewportFrom = parseFloat(animateInViewportFrom);

    let className = classnames('ghostkit-counter-box', url ? 'ghostkit-counter-box-with-link' : '');
    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    const classNameNumber = classnames(
      'ghostkit-counter-box-number',
      `ghostkit-counter-box-number-align-${numberPosition || 'left'}`,
      'top' === numberPosition
        ? `ghostkit-counter-box-number-top-align-${numberAlign || 'center'}`
        : ''
    );

    return (
      <div className={className}>
        {url ? (
          <a
            className="ghostkit-counter-box-link"
            href={url}
            target={target || null}
            rel={rel || null}
            aria-label={ariaLabel || null}
          >
            <span />
          </a>
        ) : null}
        <div className={classNameNumber}>
          <RichText.Content
            tagName="div"
            className={`ghostkit-counter-box-number-wrap${
              animateInViewport ? ' ghostkit-count-up' : ''
            }`}
            value={number}
            {...{
              'data-count-from':
                animateInViewport && animateInViewportFrom ? animateInViewportFrom : null,
            }}
          />
        </div>
        {showContent ? (
          <div className="ghostkit-counter-box-content">
            <InnerBlocks.Content />
          </div>
        ) : null}
      </div>
    );
  }
}

export default BlockSave;
