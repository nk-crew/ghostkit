import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ResponsiveToggle from '../../../components/responsive-toggle';
import ToggleGroup from '../../../components/toggle-group';
import useResponsive from '../../../hooks/use-responsive';
import {
	addClass,
	getActiveClass,
	hasClass,
	removeClass,
	replaceClass,
} from '../../../utils/classes-replacer';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

/**
 * Get array for Select element.
 *
 * @param {string} screen - screen size
 *
 * @return {Array} array for Select.
 */
const getDefaultDisplay = function (screen = '') {
	return [
		{
			label: !screen
				? __('Default', 'ghostkit')
				: __('Inherit', 'ghostkit'),
			value: '',
		},
		{
			label: __('Show', 'ghostkit'),
			value: 'block',
		},
		{
			label: __('Hide', 'ghostkit'),
			value: 'none',
		},
	];
};

/**
 * Get current display for selected screen size.
 *
 * @param {string} className - block className.
 * @param {string} screen    - name of screen size.
 *
 * @return {string} display value.
 */
function getCurrentDisplay(className, screen) {
	if (!screen) {
		if (hasClass(className, 'ghostkit-d-none')) {
			return 'none';
		}
		if (hasClass(className, 'ghostkit-d-block')) {
			return 'block';
		}
	}

	return getActiveClass(className, `ghostkit-d-${screen}`, true);
}

function DisplayScreenSizeTools(props) {
	const { attributes, setAttributes } = props;
	const { className } = attributes;

	const { device, allDevices } = useResponsive();

	let hasDisplayScreenSize = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasDisplayScreenSize =
			hasDisplayScreenSize || getCurrentDisplay(className, thisDevice);
	});

	/**
	 * Update display object.
	 *
	 * @param {string} screen - name of screen size.
	 * @param {string} val    - value for new display.
	 */
	function updateDisplay(screen, val) {
		let newClassName = className;

		if (screen) {
			newClassName = replaceClass(
				newClassName,
				`ghostkit-d-${screen}`,
				val
			);
		} else {
			newClassName = removeClass(newClassName, 'ghostkit-d-none');
			newClassName = removeClass(newClassName, 'ghostkit-d-block');

			if (val) {
				newClassName = addClass(newClassName, `ghostkit-d-${val}`);
			}
		}

		setAttributes({
			className: newClassName,
		});
	}

	return (
		<ToolsPanelItem
			label={__('Screen Size', 'ghostkit')}
			hasValue={() => !!hasDisplayScreenSize}
			onDeselect={() => {
				let newClassName = className;

				['', ...Object.keys(allDevices)].forEach((thisDevice) => {
					if (thisDevice) {
						newClassName = removeClass(
							newClassName,
							`ghostkit-d-${thisDevice}-none`
						);
						newClassName = removeClass(
							newClassName,
							`ghostkit-d-${thisDevice}-block`
						);
					} else {
						newClassName = removeClass(
							newClassName,
							'ghostkit-d-none'
						);
						newClassName = removeClass(
							newClassName,
							'ghostkit-d-block'
						);
					}
				});

				setAttributes({
					className: newClassName,
				});
			}}
			isShownByDefault={false}
		>
			<ToggleGroup
				label={
					<>
						{__('Screen Size', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return (
									hasClass(
										className,
										`ghostkit-d-${checkMedia}-none`
									) ||
									hasClass(
										className,
										`ghostkit-d-${checkMedia}-block`
									)
								);
							}}
						/>
					</>
				}
				value={getCurrentDisplay(className, device)}
				options={getDefaultDisplay(device).map((val) => ({
					value: val.value,
					label: val.label,
				}))}
				onChange={(value) => {
					updateDisplay(device, value);
				}}
				isBlock
			/>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.display.tools',
	'ghostkit/extension/display/tools/screenSize',
	(children, { props }) => {
		const hasDisplayScreenSizeSupport =
			hasBlockSupport(props.name, [
				'ghostkit',
				'display',
				'screenSize',
			]) || getBlockSupport(props.name, ['ghostkit', 'display']) === true;
		const hasCustomClassNameSupport = hasBlockSupport(
			props.name,
			'customClassName',
			true
		);

		if (!hasDisplayScreenSizeSupport || !hasCustomClassNameSupport) {
			return children;
		}

		return (
			<>
				{children}
				<DisplayScreenSizeTools {...props} />
			</>
		);
	}
);
