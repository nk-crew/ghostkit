import {
	__experimentalUnitControl,
	SelectControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
const UnitControl = __experimentalUnitControl;

export default function MediaSizeSelector(props) {
	const {
		attributes,
		hasAspectRatio = true,
		hasSizeSelectors = true,
		hasOriginalOption = true,
		onChangeAspectRatio,
		onChangeWidth,
		onChangeHeight,
		onChangeResolution,
	} = props;
	const { aspectRatio, width, height, resolution } = attributes;

	const options = [];

	if (hasOriginalOption) {
		options.push({ label: 'Original', value: '' });
	}

	options.push(
		{ label: 'Square - 1:1', value: '1:1' },
		{ label: 'Standard - 4:3', value: '4:3' },
		{ label: 'Portrait - 3:4', value: '3:4' },
		{ label: 'Classic - 3:2', value: '3:2' },
		{ label: 'Classic Portrait - 2:3', value: '2:3' },
		{ label: 'Wide - 16:9', value: '16:9' },
		{ label: 'Ultra Wide - 21:9', value: '21:9' },
		{ label: 'Tall - 9:16', value: '9:16' }
	);

	if (width && height) {
		options.push({ label: 'Custom', value: 'custom', hidden: true });
	}

	const editorSettings = useSelect((select) => {
		return select('core/block-editor').getSettings();
	});

	const [customAspectRatio, setCustomAspectRatio] = useState(false);

	useEffect(() => {
		setCustomAspectRatio(width && height ? 'custom' : false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAspectRatioChange = (val) => {
		setCustomAspectRatio(false);

		const { label } = options.find((opt) => opt.value === val);
		onChangeAspectRatio(val, label);

		if (width && height) {
			onChangeHeight('');
		}
	};

	const handleWidthChange = (val) => {
		onChangeWidth(parseFloat(val) ? val : '');
		setCustomAspectRatio(val && height ? 'custom' : false);
	};

	const handleHeightChange = (val) => {
		onChangeHeight(parseFloat(val) ? val : '');
		setCustomAspectRatio(width && val ? 'custom' : false);
	};

	return (
		<>
			{/* Aspect ratio. */}
			{hasAspectRatio && (
				<SelectControl
					label={__('Aspect Ratio', 'ghostkit')}
					value={customAspectRatio || aspectRatio}
					onChange={handleAspectRatioChange}
					options={options}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
			{/* Width and height. */}
			{hasSizeSelectors && (
				<>
					<div style={{ display: 'flex', gap: 10 }}>
						<UnitControl
							value={width}
							placeholder={__('Auto', 'ghostkit')}
							label={__('Width', 'ghostkit')}
							onChange={handleWidthChange}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<UnitControl
							value={height}
							placeholder={__('Auto', 'ghostkit')}
							label={__('Height', 'ghostkit')}
							onChange={handleHeightChange}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</div>
					{!resolution && <div style={{ marginTop: '-22px' }} />}
				</>
			)}
			{/* Resolution. */}
			{resolution && editorSettings?.imageSizes ? (
				<SelectControl
					label={__('Resolution', 'ghostkit')}
					help={__(
						'Select the size of the source image.',
						'ghostkit'
					)}
					value={resolution}
					onChange={onChangeResolution}
					options={editorSettings.imageSizes.map((imgSize) => ({
						value: imgSize.slug,
						label: imgSize.name,
					}))}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			) : null}
		</>
	);
}
