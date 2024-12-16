import classnames from 'classnames/dedupe';

import {
	__experimentalUnitControl as ExperimentalUnitControl,
	Button,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	UnitControl as StableUnitControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import RangeControl from '../../components/range-control';
import PreviewLottie from './preview-lottie';

const UnitControl = StableUnitControl || ExperimentalUnitControl;

import {
	InspectorControls,
	MediaPlaceholder,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Block Edit Class.
 *
 * @param {Object} props - component props.
 *
 * @return {JSX} component.
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected } = props;

	let { className = '' } = props;

	const {
		fileUrl,
		fileWidth,
		fileHeight,
		trigger,
		loop,
		direction,
		speed,
		width,
	} = attributes;

	const [isWidthPercent, setIsWidthPercent] = useState(width.endsWith('%'));

	className = classnames('ghostkit-lottie', className);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({
		className,
		'data-trigger': trigger,
		style:
			fileWidth && fileHeight
				? {
						'--gkt-lottie__ar': `${fileWidth} / ${fileHeight}`,
						'--gkt-lottie__width': width,
					}
				: {},
	});

	return (
		<>
			{fileUrl ? (
				<InspectorControls>
					<PanelBody>
						<SelectControl
							label={__('Play Animation On', 'ghostkit')}
							value={trigger}
							options={[
								{
									label: __('Page Load', 'ghostkit'),
									value: '',
								},
								{
									label: __('Viewport', 'ghostkit'),
									value: 'viewport',
								},
								{
									label: __('Hover', 'ghostkit'),
									value: 'hover',
								},
								{
									label: __('Click', 'ghostkit'),
									value: 'click',
								},
								{
									label: __('Scroll', 'ghostkit'),
									value: 'scroll',
								},
							]}
							onChange={(value) =>
								setAttributes({ trigger: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						{trigger !== 'scroll' ? (
							<>
								<RangeControl
									label={__('Speed', 'otter-blocks')}
									value={speed}
									onChange={(val) =>
										setAttributes({ speed: val })
									}
									step={0.1}
									min={0}
									max={10}
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
								<ToggleControl
									label={__('Loop', 'ghostkit')}
									checked={!!loop}
									onChange={() =>
										setAttributes({ loop: !loop })
									}
									__nextHasNoMarginBottom
								/>
							</>
						) : null}
						<ToggleControl
							label={__('Reverse', 'ghostkit')}
							checked={direction === -1}
							onChange={() => {
								setAttributes({
									direction: direction === 1 ? -1 : 1,
								});
							}}
							__nextHasNoMarginBottom
						/>
						<UnitControl
							label={__('Width', 'ghostkit')}
							value={width}
							onChange={(val) => setAttributes({ width: val })}
							onUnitChange={(unit) =>
								setIsWidthPercent(unit === '%')
							}
							labelPosition="edge"
							units={[
								{ value: 'px', label: 'px' },
								{ value: '%', label: '%' },
							]}
							min={0}
							max={isWidthPercent ? 100 : Infinity}
							__unstableInputWidth="70px"
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</PanelBody>
					<PanelBody>
						<TextControl
							label={__('Lottie File', 'ghostkit')}
							value={fileUrl}
							disabled
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<Button
							variant="secondary"
							onClick={() => {
								setAttributes({
									fileId: undefined,
									fileUrl: undefined,
									fileWidth: undefined,
									fileHeight: undefined,
								});
							}}
						>
							{__('Clear', 'ghostkit')}
						</Button>
					</PanelBody>
				</InspectorControls>
			) : null}
			<div {...blockProps}>
				{fileUrl ? (
					<PreviewLottie
						url={fileUrl}
						trigger={trigger}
						speed={speed}
						loop={loop}
						direction={direction}
						isSelected={isSelected}
						onLoad={(e) => {
							const newWidth =
								e?.target?._lottie?.animationData?.w;
							const newHeight =
								e?.target?._lottie?.animationData?.h;

							if (
								newWidth &&
								newHeight &&
								(newWidth !== fileWidth ||
									newHeight !== fileHeight)
							) {
								setAttributes({
									fileWidth: newWidth,
									fileHeight: newHeight,
								});
							}
						}}
					/>
				) : (
					<MediaPlaceholder
						icon="format-image"
						labels={{
							title: __('Lottie JSON', 'ghostkit'),
							name: __('lottie', 'ghostkit'),
							instructions: __(
								'Upload a JSON file or pick one from your media library.'
							),
						}}
						onSelect={(file) => {
							setAttributes({
								fileId: file.id,
								fileUrl: file.url,
							});
						}}
						onSelectURL={(url) => {
							setAttributes({ fileId: undefined, fileUrl: url });
						}}
						accept={['application/json']}
						allowedTypes={['application/json']}
						disableMaxUploadErrorMessages
						onError={() => {
							setAttributes({
								fileId: undefined,
								fileUrl: undefined,
							});
						}}
					/>
				)}
			</div>
		</>
	);
}
