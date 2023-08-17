/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import ToggleGroup from '../../components/toggle-group';
import RangeControl from '../../components/range-control';
import EditorStyles from '../../components/editor-styles';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Fragment } = wp.element;

const { PanelBody, ToggleControl } = wp.components;

const { InspectorControls, InnerBlocks } = wp.blockEditor;

const { useSelect, useDispatch } = wp.data;

const { createBlock } = wp.blocks;

const slideBlockName = 'ghostkit/carousel-slide';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;

  let { className = '' } = props;

  const {
    effect,
    speed,
    autoplay,
    autoplayHoverPause,
    slidesPerView,
    centeredSlides,
    loop,
    freeScroll,
    fadeEdges,
    showArrows,
    arrowPrevIcon,
    arrowNextIcon,
    showBullets,
    dynamicBullets,
    gap,
  } = attributes;

  const { getBlocks, slidesCount, block } = useSelect((select, ownProps) => {
    const { clientId } = ownProps;

    return {
      getBlocks: select('core/block-editor').getBlocks,
      slidesCount: select('core/block-editor').getBlockCount(clientId),
      block: select('core/block-editor').getBlock(clientId),
    };
  });

  const { removeBlock, replaceInnerBlocks } = useDispatch('core/block-editor');

  /**
   * Updates the slides count
   *
   * @param {number} newSlidesCount New slides count.
   */
  function updateSlidesCount(newSlidesCount) {
    // Remove slider block.
    if (newSlidesCount < 1) {
      removeBlock(block.clientId);

      // Add new slides.
    } else if (newSlidesCount > slidesCount) {
      const newCount = newSlidesCount - slidesCount;
      const newInnerBlocks = [...getBlocks(block.clientId)];

      for (let i = 1; i <= newCount; i += 1) {
        newInnerBlocks.push(createBlock(slideBlockName, { size: 3 }));
      }

      replaceInnerBlocks(block.clientId, newInnerBlocks, false);

      // Remove slides.
    } else if (newSlidesCount < slidesCount) {
      const newInnerBlocks = [...getBlocks(block.clientId)];
      newInnerBlocks.splice(newSlidesCount, slidesCount - newSlidesCount);

      replaceInnerBlocks(block.clientId, newInnerBlocks, false);
    }
  }

  className = classnames(
    className,
    'ghostkit-carousel',
    fadeEdges && 'ghostkit-carousel-fade-edges'
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <RangeControl
            label={__('Slides', '@@text_domain')}
            value={slidesCount}
            onChange={(value) => updateSlidesCount(value)}
            min={2}
            max={20}
            allowCustomMax
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
            allowCustomMax
          />
          <RangeControl
            label={__('Autoplay (seconds)', '@@text_domain')}
            value={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
            min={0}
            max={20}
            step={0.3}
            allowCustomMax
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
                allowCustomMax
              />
              <RangeControl
                label={__('Gap', '@@text_domain')}
                value={gap}
                onChange={(value) => setAttributes({ gap: value })}
                min={0}
                max={60}
                allowCustomMax
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
            label={__('Fade edges', '@@text_domain')}
            checked={!!fadeEdges}
            onChange={(val) => setAttributes({ fadeEdges: val })}
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
          template={[[slideBlockName], [slideBlockName], [slideBlockName]]}
          allowedBlocks={[slideBlockName]}
          orientation="horizontal"
          renderAppender={false}
        />
      </div>
      <EditorStyles
        styles={`
            [data-block="${props.clientId}"] > .ghostkit-carousel {
              --gkt-carousel-gap: ${gap}px;
              --gkt-carousel-slides-per-view: ${effect === 'fade' ? 1 : slidesPerView};
            }
          `}
      />
    </Fragment>
  );
}
