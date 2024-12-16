import classnames from 'classnames/dedupe';

import ColorPicker from '../../components/color-picker';
import DateTimePicker from '../../components/date-time-picker';
import RangeControl from '../../components/range-control';
import countDownApi from './api';
import { TIMEZONELESS_FORMAT } from './constants';

const { GHOSTKIT, luxon } = window;

import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Block Edit function.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;
	const {
		date,
		units,
		unitsAlign,
		numberFontSize,
		labelFontSize,
		numberColor,
		labelColor,
	} = attributes;

	let { className = '' } = props;

	function parseData(newDate, newUnits) {
		const formattedDate =
			luxon.DateTime.fromISO(newDate).toFormat(TIMEZONELESS_FORMAT);
		const currentDate = new Date(
			luxon.DateTime.now()
				.setZone(GHOSTKIT.timezone)
				.toFormat(TIMEZONELESS_FORMAT)
		);

		const apiData = countDownApi(
			new Date(formattedDate),
			currentDate,
			newUnits,
			0
		);

		return {
			formattedDate,
			delay: countDownApi.getDelay(newUnits),
			...apiData,
		};
	}

	const [dateData, setDateData] = useState(
		date ? parseData(date, units) : false
	);
	const interval = useRef(false);

	const { isSelectedBlockInRoot } = useSelect(
		(select) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select('core/block-editor');

			return {
				isSelectedBlockInRoot:
					isBlockSelected(clientId) ||
					hasSelectedInnerBlock(clientId, true),
			};
		},
		[clientId]
	);

	function updateDate(newDate, newUnits) {
		const data = parseData(newDate, newUnits);

		setDateData(data);

		if (data.formattedDate !== date) {
			setAttributes({
				date: data.formattedDate,
			});
		}
	}

	// Mount.
	useEffect(() => {
		// generate date.
		if (!date) {
			const today = new Date();
			const newDate = new Date();
			newDate.setDate(today.getDate() + 1);

			const formattedDate =
				luxon.DateTime.fromJSDate(newDate).toFormat(
					TIMEZONELESS_FORMAT
				);

			updateDate(formattedDate, units);
		} else {
			updateDate(date, units);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Changed date data and run interval.
	useEffect(() => {
		clearInterval(interval.current);

		if (!dateData) {
			return;
		}

		interval.current = setInterval(() => {
			if (!date || !units || !units.length) {
				return;
			}

			const data = parseData(date, units);

			setDateData(data);
		}, dateData.delay);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateData]);

	className = classnames(
		'ghostkit-countdown',
		unitsAlign && `ghostkit-countdown-units-align-${unitsAlign}`,
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(
		{ className: 'ghostkit-countdown-expire-action-content' },
		{
			template: [
				[
					'core/paragraph',
					{
						content: __(
							'This countdown has been ended already!',
							'ghostkit'
						),
					},
				],
			],
			templateLock: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<DateTimePicker
						label={__('End Date', 'ghostkit')}
						value={date}
						onChange={(value) => updateDate(value, units)}
					/>
					<SelectControl
						label={__('Display Units', 'ghostkit')}
						value={units}
						onChange={(value) => {
							setAttributes({ units: value });
							updateDate(date, value);
						}}
						multiple
						options={[
							{
								label: __('Years', 'ghostkit'),
								value: 'years',
							},
							{
								label: __('Months', 'ghostkit'),
								value: 'months',
							},
							{
								label: __('Weeks', 'ghostkit'),
								value: 'weeks',
							},
							{
								label: __('Days', 'ghostkit'),
								value: 'days',
							},
							{
								label: __('Hours', 'ghostkit'),
								value: 'hours',
							},
							{
								label: __('Minutes', 'ghostkit'),
								value: 'minutes',
							},
							{
								label: __('Seconds', 'ghostkit'),
								value: 'seconds',
							},
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody>
					<RangeControl
						label={__('Number Font Size', 'ghostkit')}
						value={numberFontSize}
						onChange={(value) =>
							setAttributes({ numberFontSize: value })
						}
						beforeIcon="editor-textcolor"
						afterIcon="editor-textcolor"
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Label Font Size', 'ghostkit')}
						value={labelFontSize}
						onChange={(value) =>
							setAttributes({ labelFontSize: value })
						}
						beforeIcon="editor-textcolor"
						afterIcon="editor-textcolor"
						allowCustomMax
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<ColorPicker
						label={__('Number Color', 'ghostkit')}
						value={numberColor}
						onChange={(val) => setAttributes({ numberColor: val })}
						alpha
					/>
					<ColorPicker
						label={__('Label Color', 'ghostkit')}
						value={labelColor}
						onChange={(val) => setAttributes({ labelColor: val })}
						alpha
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="align-left"
						title={__('Units Align Left', 'ghostkit')}
						onClick={() => setAttributes({ unitsAlign: 'left' })}
						isActive={unitsAlign === 'left'}
					/>
					<ToolbarButton
						icon="align-center"
						title={__('Units Align Center', 'ghostkit')}
						onClick={() => setAttributes({ unitsAlign: 'center' })}
						isActive={unitsAlign === 'center'}
					/>
					<ToolbarButton
						icon="align-right"
						title={__('Units Align Right', 'ghostkit')}
						onClick={() => setAttributes({ unitsAlign: 'right' })}
						isActive={unitsAlign === 'right'}
					/>
				</ToolbarGroup>
			</BlockControls>
			<div {...blockProps}>
				{units.map((unitName) => {
					let formattedUnit = false;

					if (dateData && typeof dateData[unitName] !== 'undefined') {
						const isEnd = dateData.value >= 0;

						formattedUnit = countDownApi.formatUnit(
							isEnd ? 0 : dateData[unitName],
							unitName
						);
					}

					return (
						<div
							key={unitName}
							className={classnames(
								'ghostkit-countdown-unit',
								`ghostkit-countdown-unit-${unitName}`
							)}
						>
							<span className="ghostkit-countdown-unit-number">
								{formattedUnit ? formattedUnit.number : '00'}
							</span>
							<span className="ghostkit-countdown-unit-label">
								{formattedUnit ? formattedUnit.label : unitName}
							</span>
						</div>
					);
				})}
			</div>
			{isSelectedBlockInRoot ? (
				<div className="ghostkit-countdown-expire-action">
					<div className="ghostkit-countdown-expire-action-label">
						{__('Display content after expiration:', 'ghostkit')}
					</div>

					<div {...innerBlockProps} />
				</div>
			) : null}
		</>
	);
}
