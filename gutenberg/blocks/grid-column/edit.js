import classnames from 'classnames/dedupe';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import RangeControl from '../../components/range-control';
import ResponsiveToggle from '../../components/responsive-toggle';
import ToggleGroup from '../../components/toggle-group';
import useResponsive from '../../hooks/use-responsive';
import getIcon from '../../utils/get-icon';
import getColClass from './get-col-class';

/**
 * Get array for Select element.
 *
 * @return {Array} array for Select.
 */
const getDefaultColumnSizes = function () {
	const result = [
		{
			label: __('Inherit from larger', 'ghostkit'),
			value: '',
		},
		{
			label: __('Auto', 'ghostkit'),
			value: 'auto',
		},
		{
			label: __('Grow', 'ghostkit'),
			value: 'grow',
		},
	];

	for (let k = 1; k <= 12; k += 1) {
		result.push({
			// eslint-disable-next-line @wordpress/valid-sprintf
			label: sprintf(
				k === 1
					? __('%d Column (%s)', 'ghostkit')
					: __('%d Columns (%s)', 'ghostkit'),
				k,
				`${Math.round(((100 * k) / 12) * 100) / 100}%`
			),
			value: k,
		});
	}
	return result;
};

/**
 * Get array for Select element.
 *
 * @param {number} columns - number of available columns.
 *
 * @return {Array} array for Select.
 */
const getDefaultColumnOrders = function (columns = 12) {
	const result = [
		{
			label: __('Inherit from larger', 'ghostkit'),
			value: '',
		},
		{
			label: __('Auto', 'ghostkit'),
			value: 'auto',
		},
		{
			label: __('First', 'ghostkit'),
			value: 'first',
		},
	];

	for (let k = 1; k <= columns; k += 1) {
		result.push({
			label: k,
			value: k,
		});
	}

	result.push({
		label: __('Last', 'ghostkit'),
		value: 'last',
	});

	return result;
};

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { clientId, attributes, setAttributes } = props;

	const { stickyContent, stickyContentOffset } = attributes;

	const { device } = useResponsive();

	const { hasChildBlocks } = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');

			return {
				hasChildBlocks: blockEditor
					? blockEditor.getBlockOrder(clientId).length > 0
					: false,
			};
		},
		[clientId]
	);

	// background
	const background = applyFilters(
		'ghostkit.editor.grid-column.background',
		'',
		props
	);

	const blockProps = useBlockProps({
		className: classnames(props.attributes.className, getColClass(props)),
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'ghostkit-col-content' },
		{
			templateLock: false,
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	let sizeName = 'size';
	let orderName = 'order';
	let verticalAlignName = 'verticalAlign';

	if (device) {
		sizeName = `${device}_${sizeName}`;
		orderName = `${device}_${orderName}`;
		verticalAlignName = `${device}_${verticalAlignName}`;
	}

	return (
		<div {...blockProps}>
			<InspectorControls>
				<ApplyFilters
					name="ghostkit.editor.controls"
					attribute="columnSettings"
					props={props}
				>
					<PanelBody>
						<SelectControl
							label={
								<>
									{__('Size', 'ghostkit')}
									<ResponsiveToggle
										checkActive={(checkMedia) => {
											return !!attributes[
												`${checkMedia}_size`
											];
										}}
									/>
								</>
							}
							value={attributes[sizeName]}
							onChange={(value) => {
								setAttributes({
									[sizeName]: value,
								});
							}}
							options={getDefaultColumnSizes()}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={
								<>
									{__('Order', 'ghostkit')}
									<ResponsiveToggle
										checkActive={(checkMedia) => {
											return !!attributes[
												`${checkMedia}_order`
											];
										}}
									/>
								</>
							}
							value={attributes[orderName]}
							onChange={(value) => {
								setAttributes({
									[orderName]: value,
								});
							}}
							options={getDefaultColumnOrders()}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<ToggleGroup
							label={
								<>
									{__('Vertical Alignment', 'ghostkit')}
									<ResponsiveToggle
										checkActive={(checkMedia) => {
											return !!attributes[
												`${checkMedia}_verticalAlign`
											];
										}}
									/>
								</>
							}
							value={attributes[verticalAlignName]}
							options={[
								{
									icon: getIcon('icon-vertical-top'),
									label: __('Top', 'ghostkit'),
									value: '',
								},
								{
									icon: getIcon('icon-vertical-center'),
									label: __('Center', 'ghostkit'),
									value: 'center',
								},
								{
									icon: getIcon('icon-vertical-bottom'),
									label: __('Bottom', 'ghostkit'),
									value: 'end',
								},
							]}
							onChange={(value) => {
								setAttributes({ [verticalAlignName]: value });
							}}
							isDeselectable
						/>
					</PanelBody>
				</ApplyFilters>
				<PanelBody>
					<ToggleGroup
						label={__('Sticky Content', 'ghostkit')}
						value={stickyContent}
						options={[
							{
								label: __('Top', 'ghostkit'),
								value: 'top',
							},
							{
								label: __('Bottom', 'ghostkit'),
								value: 'bottom',
							},
						]}
						onChange={(value) => {
							setAttributes({ stickyContent: value });
						}}
						isDeselectable
					/>
					{stickyContent ? (
						<RangeControl
							label={__('Sticky Offset', 'ghostkit')}
							value={stickyContentOffset}
							onChange={(value) =>
								setAttributes({ stickyContentOffset: value })
							}
							allowCustomMax
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) : null}
				</PanelBody>
				<div className="ghostkit-background-controls">
					<ApplyFilters
						name="ghostkit.editor.controls"
						attribute="background"
						props={props}
					/>
				</div>
			</InspectorControls>
			{background}
			<div {...innerBlocksProps} />
		</div>
	);
}
