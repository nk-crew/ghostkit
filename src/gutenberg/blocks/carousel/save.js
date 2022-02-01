/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

import metadata from './block.json';

const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const {
      effect,
      speed,
      autoplay,
      autoplayHoverPause,
      slidesPerView,
      centeredSlides,
      loop,
      freeScroll,
      showArrows,
      arrowPrevIcon,
      arrowNextIcon,
      showBullets,
      dynamicBullets,
      gap,
    } = this.props.attributes;

    let className = 'ghostkit-carousel';

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      <div
        className={className}
        data-effect={effect}
        data-speed={speed}
        data-autoplay={autoplay}
        data-autoplay-hover-pause={autoplay && autoplayHoverPause ? 'true' : null}
        data-slides-per-view={slidesPerView}
        data-centered-slides={centeredSlides ? 'true' : 'false'}
        data-loop={loop ? 'true' : 'false'}
        data-free-scroll={freeScroll ? 'true' : 'false'}
        data-show-arrows={showArrows ? 'true' : 'false'}
        data-show-bullets={showBullets ? 'true' : 'false'}
        data-dynamic-bullets={dynamicBullets ? 'true' : 'false'}
        data-gap={gap}
      >
        <div className="ghostkit-carousel-items">
          <InnerBlocks.Content />
        </div>
        {arrowPrevIcon ? (
          <IconPicker.Render
            name={arrowPrevIcon}
            tag="div"
            className="ghostkit-carousel-arrow-prev-icon"
          />
        ) : (
          ''
        )}
        {arrowNextIcon ? (
          <IconPicker.Render
            name={arrowNextIcon}
            tag="div"
            className="ghostkit-carousel-arrow-next-icon"
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default BlockSave;
