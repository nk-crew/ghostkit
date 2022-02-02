/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import ToggleGroup from '../../components/toggle-group';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, RangeControl, ToggleControl } = wp.components;

const { InspectorControls, InnerBlocks } = wp.blockEditor;

const { compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

const { createBlock } = wp.blocks;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.updateSlidesCount = this.updateSlidesCount.bind(this);
  }

  /**
   * Updates the slides count
   *
   * @param {number} newSlidesCount New slides count.
   */
  updateSlidesCount(newSlidesCount) {
    const { block, getBlocks, replaceInnerBlocks, slidesCount, removeBlock } = this.props;

    // Remove slider block.
    if (newSlidesCount < 1) {
      removeBlock(block.clientId);

      // Add new slides.
    } else if (newSlidesCount > slidesCount) {
      const newCount = newSlidesCount - slidesCount;
      const newInnerBlocks = [...getBlocks(block.clientId)];

      for (let i = 1; i <= newCount; i += 1) {
        newInnerBlocks.push(createBlock('ghostkit/carousel-slide', { size: 3 }));
      }

      replaceInnerBlocks(block.clientId, newInnerBlocks, false);

      // Remove slides.
    } else if (newSlidesCount < slidesCount) {
      const newInnerBlocks = [...getBlocks(block.clientId)];
      newInnerBlocks.splice(newSlidesCount, slidesCount - newSlidesCount);

      replaceInnerBlocks(block.clientId, newInnerBlocks, false);
    }
  }

  render() {
    const { attributes, setAttributes, slidesCount } = this.props;

    let { className = '' } = this.props;

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
    } = attributes;

    className = classnames(className, 'ghostkit-carousel');

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <RangeControl
              label={__('Slides', '@@text_domain')}
              value={slidesCount}
              onChange={(value) => this.updateSlidesCount(value)}
              min={2}
              max={20}
            />
          </PanelBody>
          <PanelBody>
            <ToggleGroup
              label={__('Effect', '@@text_domain')}
              value={effect}
              options={[
                {
                  value: 'slide',
                  label: __('Slide', '@@text_domain'),
                },
                {
                  value: 'coverflow',
                  label: __('Coverflow', '@@text_domain'),
                },
                {
                  value: 'fade',
                  label: __('Fade', '@@text_domain'),
                },
              ]}
              onChange={(value) => {
                setAttributes({ effect: value });
              }}
              isAdaptiveWidth
            />
          </PanelBody>
          <PanelBody>
            <RangeControl
              label={__('Speed (seconds)', '@@text_domain')}
              suffix={__('sec', '@@text_domain')}
              value={speed}
              onChange={(value) => setAttributes({ speed: value })}
              min={0}
              max={10}
              step={0.1}
            />
            <RangeControl
              label={__('Autoplay (seconds)', '@@text_domain')}
              value={autoplay}
              onChange={(value) => setAttributes({ autoplay: value })}
              min={0}
              max={20}
              step={0.3}
            />
            {autoplay ? (
              <ToggleControl
                label={__('Pause autoplay on mouse over', '@@text_domain')}
                checked={!!autoplayHoverPause}
                onChange={(val) => setAttributes({ autoplayHoverPause: val })}
              />
            ) : null}
            {effect !== 'fade' ? (
              <Fragment>
                <RangeControl
                  label={__('Slides per view', '@@text_domain')}
                  value={slidesPerView}
                  onChange={(value) => setAttributes({ slidesPerView: value })}
                  min={1}
                  max={8}
                />
                <RangeControl
                  label={__('Gap', '@@text_domain')}
                  value={gap}
                  onChange={(value) => setAttributes({ gap: value })}
                  min={0}
                  max={60}
                />
              </Fragment>
            ) : (
              ''
            )}
          </PanelBody>
          <PanelBody>
            <ToggleControl
              label={__('Centered slides', '@@text_domain')}
              checked={!!centeredSlides}
              onChange={(val) => setAttributes({ centeredSlides: val })}
            />
            <ToggleControl
              label={__('Loop', '@@text_domain')}
              checked={!!loop}
              onChange={(val) => setAttributes({ loop: val })}
            />
            <ToggleControl
              label={__('Free scroll', '@@text_domain')}
              checked={!!freeScroll}
              onChange={(val) => setAttributes({ freeScroll: val })}
            />
            <ToggleControl
              label={__('Show arrows', '@@text_domain')}
              checked={!!showArrows}
              onChange={(val) => setAttributes({ showArrows: val })}
            />
            {showArrows ? (
              <Fragment>
                <IconPicker
                  label={__('Prev arrow icon', '@@text_domain')}
                  value={arrowPrevIcon}
                  onChange={(value) => setAttributes({ arrowPrevIcon: value })}
                />
                <IconPicker
                  label={__('Next arrow icon', '@@text_domain')}
                  value={arrowNextIcon}
                  onChange={(value) => setAttributes({ arrowNextIcon: value })}
                />
              </Fragment>
            ) : (
              ''
            )}
            <ToggleControl
              label={__('Show bullets', '@@text_domain')}
              checked={!!showBullets}
              onChange={(val) => setAttributes({ showBullets: val })}
            />
            {showBullets ? (
              <ToggleControl
                label={__('Dynamic bullets', '@@text_domain')}
                checked={!!dynamicBullets}
                onChange={(val) => setAttributes({ dynamicBullets: val })}
              />
            ) : (
              ''
            )}
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          <InnerBlocks
            template={[['ghostkit/carousel-slide'], ['ghostkit/carousel-slide']]}
            allowedBlocks={['ghostkit/carousel-slide']}
            orientation="horizontal"
            renderAppender={false}
          />
        </div>
      </Fragment>
    );
  }
}

export default compose([
  withSelect((select, ownProps) => {
    const { getBlock, getBlocks, getBlockCount } = select('core/block-editor');

    const { clientId } = ownProps;

    return {
      getBlocks,
      slidesCount: getBlockCount(clientId),
      block: getBlock(clientId),
    };
  }),
  withDispatch((dispatch) => {
    const { removeBlock, replaceInnerBlocks } = dispatch('core/block-editor');

    return {
      removeBlock,
      replaceInnerBlocks,
    };
  }),
])(BlockEdit);
