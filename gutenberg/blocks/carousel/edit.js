import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	__experimentalNumberControl as ExperimentalNumberControl,
	NumberControl as StableNumberControl,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import EditorStyles from '../../components/editor-styles';
import IconPicker from '../../components/icon-picker';
import RangeControl from '../../components/range-control';
import ToggleGroup from '../../components/toggle-group';

const NumberControl = StableNumberControl || ExperimentalNumberControl;

const slideBlockName = 'ghostkit/carousel-slide';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;

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
		fadeEdgesSize,
		showArrows,
		arrowPrevIcon,
		arrowNextIcon,
		showBullets,
		dynamicBullets,
		gap,
	} = attributes;

	const { getBlocks, slidesCount, block } = useSelect((select) => {
		const blockEditorData = select('core/block-editor');

		return {
			getBlocks: blockEditorData.getBlocks,
			slidesCount: blockEditorData.getBlockCount(clientId),
			block: blockEditorData.getBlock(clientId),
		};
	});

	const { removeBlock, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	/**
	 * Updates the slides count
	 *
	 * @param {number} newSlidesCount New slides count.
	 */
	const updateSlidesCount = (newSlidesCount) => {
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
	};

	className = classnames(
		className,
		'ghostkit-carousel',
		fadeEdges && 'ghostkit-carousel-fade-edges'
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(
		{ className: 'ghostkit-carousel-items' },
		{
			template: [[slideBlockName], [slideBlockName], [slideBlockName]],
			allowedBlocks: [slideBlockName],
			templateLock: false,
			orientation: 'horizontal',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'ghostkit')}>
					<RangeControl
						label={__('Slides', 'ghostkit')}
						value={slidesCount}
						onChange={updateSlidesCount}
						min={2}
						max={20}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{effect !== 'fade' ? (
						<>
							<RangeControl
								label={__('Slides per view', 'ghostkit')}
								value={slidesPerView}
								onChange={(value) =>
									setAttributes({ slidesPerView: value })
								}
								min={1}
								max={8}
								allowCustomMax
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<RangeControl
								label={__('Gap', 'ghostkit')}
								value={gap}
								onChange={(value) =>
									setAttributes({ gap: value })
								}
								min={0}
								max={60}
								allowCustomMax
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					) : null}
					<ToggleGroup
						label={__('Effect', 'ghostkit')}
						value={effect}
						options={[
							{
								value: 'slide',
								label: __('Slide', 'ghostkit'),
							},
							{
								value: 'coverflow',
								label: __('Coverflow', 'ghostkit'),
							},
							{
								value: 'fade',
								label: __('Fade', 'ghostkit'),
							},
						]}
						onChange={(value) => {
							setAttributes({ effect: value });
						}}
						isBlock
					/>

					<div
						style={{
							borderTop: '1px solid #E0E0E0',
							marginBottom: '16px',
						}}
					/>

					<RangeControl
						label={__('Speed (seconds)', 'ghostkit')}
						suffix="s&nbsp;"
						value={speed}
						onChange={(value) => setAttributes({ speed: value })}
						min={0}
						max={10}
						step={0.1}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Autoplay (seconds)', 'ghostkit')}
						value={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
						min={0}
						max={20}
						step={0.3}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{autoplay ? (
						<ToggleControl
							label={__(
								'Pause autoplay on mouse over',
								'ghostkit'
							)}
							checked={!!autoplayHoverPause}
							onChange={(val) =>
								setAttributes({ autoplayHoverPause: val })
							}
							__nextHasNoMarginBottom
						/>
					) : null}

					<div
						style={{
							borderTop: '1px solid #E0E0E0',
							marginBottom: '16px',
						}}
					/>

					<ToggleControl
						label={__('Centered Slides', 'ghostkit')}
						checked={!!centeredSlides}
						onChange={(val) =>
							setAttributes({ centeredSlides: val })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Loop', 'ghostkit')}
						checked={!!loop}
						onChange={(val) => setAttributes({ loop: val })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Free Scroll', 'ghostkit')}
						checked={!!freeScroll}
						onChange={(val) => setAttributes({ freeScroll: val })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Fade Edges', 'ghostkit')}
						checked={!!fadeEdges}
						onChange={(val) => setAttributes({ fadeEdges: val })}
						__nextHasNoMarginBottom
					/>
					{fadeEdges && (
						<NumberControl
							label={__('Fade Edges Size', 'ghostkit')}
							suffix="%&nbsp;"
							value={fadeEdgesSize}
							onChange={(val) =>
								setAttributes({
									fadeEdgesSize: parseFloat(val),
								})
							}
							labelPosition="edge"
							__unstableInputWidth="100px"
							disableUnits
							min={0}
							max={50}
						/>
					)}
				</PanelBody>
				<PanelBody title={__('Arrow', 'ghostkit')}>
					<ToggleControl
						label={__('Show', 'ghostkit')}
						checked={!!showArrows}
						onChange={(val) => setAttributes({ showArrows: val })}
						__nextHasNoMarginBottom
					/>
					{showArrows ? (
						<>
							<IconPicker
								label={__('Prev icon', 'ghostkit')}
								value={arrowPrevIcon}
								onChange={(value) =>
									setAttributes({ arrowPrevIcon: value })
								}
								insideInspector
							/>
							<IconPicker
								label={__('Next icon', 'ghostkit')}
								value={arrowNextIcon}
								onChange={(value) =>
									setAttributes({ arrowNextIcon: value })
								}
								insideInspector
							/>
						</>
					) : null}
				</PanelBody>
				<PanelBody title={__('Bullets', 'ghostkit')}>
					<ToggleControl
						label={__('Show', 'ghostkit')}
						checked={!!showBullets}
						onChange={(val) => setAttributes({ showBullets: val })}
						__nextHasNoMarginBottom
					/>
					{showBullets ? (
						<ToggleControl
							label={__('Dynamic', 'ghostkit')}
							checked={!!dynamicBullets}
							onChange={(val) =>
								setAttributes({ dynamicBullets: val })
							}
							__nextHasNoMarginBottom
						/>
					) : null}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="block-editor-inner-blocks">
					<div {...innerBlockProps} />
				</div>
			</div>
			<EditorStyles
				styles={`
            [data-block="${props.clientId}"] > .ghostkit-carousel {
              --gkt-carousel-gap: ${gap}px;
              --gkt-carousel-slides-per-view: ${
					effect === 'fade' ? 1 : slidesPerView
				};
            }
          `}
			/>
		</>
	);
}
