import classnames from 'classnames/dedupe';

import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Dropdown,
	PanelBody,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ColorPicker from '../../components/color-picker';
import ImagePicker from '../../components/image-picker';
import ProNote from '../../components/pro-note';
import RangeControl from '../../components/range-control';
import ResponsiveToggle from '../../components/responsive-toggle';
import useResponsive from '../../hooks/use-responsive';
import { maybeDecode, maybeEncode } from '../../utils/encode-decode';
import getIcon from '../../utils/get-icon';

const { GHOSTKIT } = window;

const { version } = window.ghostkitVariables;

const { shapes } = GHOSTKIT;

function getShapeData(svg) {
	let result = {
		allow_flip_vertical: true,
		allow_flip_horizontal: true,
	};
	let ready = false;

	Object.keys(shapes).forEach((k) => {
		const data = shapes[k];

		Object.keys(data.shapes).forEach((i) => {
			const shape = data.shapes[i];

			if (shape.svg && shape.svg === maybeDecode(svg) && !ready) {
				result = shape;
				ready = true;
			}
		});
	});

	return result;
}

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes } = props;
	const { svg, flipVertical, flipHorizontal, color } = attributes;

	let { className = '' } = props;

	const { device } = useResponsive();

	// Mounted.
	useEffect(() => {
		// Block inserted on the page.
		if (!svg) {
			const newAttrs = {};

			// Set default svg.
			Object.keys(shapes).forEach((k) => {
				const data = shapes[k];

				Object.keys(data.shapes).forEach((i) => {
					const shape = data.shapes[i];

					if (shape.svg && !newAttrs.svg) {
						newAttrs.svg = shape.svg;
					}
				});
			});

			// Remove top and bottom margins.
			newAttrs.ghostkitSpacings = {
				marginTop: '0',
				marginBottom: '0',
				'!important': true,
			};

			setAttributes(newAttrs);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function getShapesPicker() {
		return (
			<div className="ghostkit-shape-divider-control-styles">
				{Object.keys(shapes).map((k) => {
					const data = shapes[k];
					const shapesOptions = [];

					Object.keys(data.shapes).forEach((i) => {
						const shape = data.shapes[i];

						shapesOptions.push({
							label: shape.label,
							value: shape.svg,
							image: (
								<div
									className="ghostkit-shape-divider"
									style={{
										'--gkt-shape-divider__color': color,
									}}
									dangerouslySetInnerHTML={{
										__html: shape.svg,
									}}
								/>
							),
							className: `ghostkit-shape-divider-control-styles-item-${k}-${shape.name}`,
						});
					});

					return (
						<div key={k}>
							<h3>{data.name}</h3>
							<ImagePicker
								value={maybeDecode(svg)}
								options={shapesOptions}
								onChange={(value) => {
									const shapeData = getShapeData(value);

									setAttributes({
										svg: maybeEncode(value),
										flipVertical:
											shapeData.allow_flip_vertical
												? flipVertical
												: false,
										flipHorizontal:
											shapeData.allow_flip_horizontal
												? flipHorizontal
												: false,
									});
								}}
							/>
							<ProNote title={__('Pro Shapes', 'ghostkit')}>
								<p>
									{__(
										'Additional 30 shapes available in the Ghost Kit Pro plugin only',
										'ghostkit'
									)}
								</p>
								<ProNote.Button
									target="_blank"
									rel="noopener noreferrer"
									href={`https://www.ghostkit.io/docs/blocks/shape-divider/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_shapes&utm_content=${version}`}
								>
									{__('Read More', 'ghostkit')}
								</ProNote.Button>
							</ProNote>
						</div>
					);
				})}
			</div>
		);
	}

	const shapeData = getShapeData(svg);

	className = classnames(
		'ghostkit-shape-divider',
		{
			'ghostkit-shape-divider-flip-vertical':
				shapeData.allow_flip_vertical && flipVertical,
			'ghostkit-shape-divider-flip-horizontal':
				shapeData.allow_flip_horizontal && flipHorizontal,
		},
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({
		className,
		dangerouslySetInnerHTML: { __html: maybeDecode(svg) },
	});

	let heightName = 'height';
	let widthName = 'width';

	if (device) {
		heightName = `${device}_${heightName}`;
		widthName = `${device}_${widthName}`;
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{shapeData.allow_flip_vertical ? (
						<ToolbarButton
							icon={getIcon('icon-flip-vertical')}
							title={__('Vertical Flip', 'ghostkit')}
							onClick={() =>
								setAttributes({ flipVertical: !flipVertical })
							}
							isActive={flipVertical}
						/>
					) : null}

					{shapeData.allow_flip_horizontal ? (
						<ToolbarButton
							icon={getIcon('icon-flip-horizontal')}
							title={__('Horizontal Flip', 'ghostkit')}
							onClick={() =>
								setAttributes({
									flipHorizontal: !flipHorizontal,
								})
							}
							isActive={flipHorizontal}
						/>
					) : null}

					<Dropdown
						renderToggle={({ onToggle }) => (
							<ToolbarButton
								label={__('Shapes', 'ghostkit')}
								icon="edit"
								className="components-toolbar__control"
								onClick={onToggle}
							/>
						)}
						renderContent={() => (
							<div
								style={{
									minWidth: 260,
								}}
							>
								{getShapesPicker()}
							</div>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Style', 'ghostkit')}>
					{getShapesPicker()}
				</PanelBody>
				<PanelBody title={__('Size', 'ghostkit')}>
					<RangeControl
						label={
							<>
								{__('Height', 'ghostkit')}
								<ResponsiveToggle
									checkActive={(checkMedia) => {
										return !!attributes[
											`${checkMedia}_height`
										];
									}}
								/>
							</>
						}
						value={
							attributes[heightName]
								? parseInt(attributes[heightName], 10)
								: ''
						}
						onChange={(value) => {
							setAttributes({
								[heightName]: `${
									typeof value === 'number' ? value : ''
								}`,
							});
						}}
						min={1}
						max={700}
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={
							<>
								{__('Width', 'ghostkit')}
								<ResponsiveToggle
									checkActive={(checkMedia) => {
										return !!attributes[
											`${checkMedia}_width`
										];
									}}
								/>
							</>
						}
						value={
							attributes[widthName]
								? parseInt(attributes[widthName], 10)
								: ''
						}
						onChange={(value) => {
							setAttributes({
								[widthName]: `${
									typeof value === 'number' ? value : ''
								}`,
							});
						}}
						min={100}
						max={400}
						allowCustomMin
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody>
					<ColorPicker
						label={__('Color', 'ghostkit')}
						value={color}
						onChange={(val) => setAttributes({ color: val })}
						alpha
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps} />
		</>
	);
}
