import { merge } from 'lodash';

import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockStyle } from '@wordpress/blocks';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ColorPicker from '../../components/color-picker';
import EditorStyles from '../../components/editor-styles';
import IconPicker from '../../components/icon-picker';
import RangeControl from '../../components/range-control';
import ResponsiveToggle from '../../components/responsive-toggle';
import useResponsive from '../../hooks/use-responsive';
import {
	addClass,
	getActiveClass,
	hasClass,
	removeClass,
	replaceClass,
} from '../../utils/classes-replacer';

/**
 * Register additional list styles.
 */
registerBlockStyle('core/list', {
	name: 'styled',
	label: __('Styled', 'ghostkit'),
});
registerBlockStyle('core/list', {
	name: 'icon',
	label: __('Icon', 'ghostkit'),
});
registerBlockStyle('core/list', {
	name: 'none',
	label: __('None', 'ghostkit'),
});

/**
 * Icon Lists Extension.
 */

/**
 * Extend block attributes with unique id.
 *
 * @param {Object} blockSettings Original block settings.
 * @param {string} name          Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(blockSettings, name) {
	if (name === 'core/list') {
		if (!blockSettings.attributes.ghostkitListIcon) {
			blockSettings.attributes.ghostkitListIcon = {
				type: 'string',
			};
		}
		if (!blockSettings.attributes.ghostkitListIconColor) {
			blockSettings.attributes.ghostkitListIconColor = {
				type: 'string',
			};
		}
	}

	return blockSettings;
}

const COLUMNS_COUNT_MAX = 6;

/**
 * Get current columns count for selected screen size.
 *
 * @param {string} className - block className.
 * @param {string} screen    - name of screen size.
 *
 * @return {string} columns value.
 */
function getCurrentColumns(className, screen) {
	if (!screen) {
		for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
			if (hasClass(className, `ghostkit-list-columns-${k}`)) {
				return `${k}`;
			}
		}
	}

	return getActiveClass(className, `ghostkit-list-columns-${screen}`, true);
}

/**
 * List Columns
 *
 * @param props
 */
function GhostKitListColumns(props) {
	const { attributes, setAttributes } = props;
	const { className } = attributes;

	const { device } = useResponsive();

	/**
	 * Update columns count class.
	 *
	 * @param {string} val - value for columns count.
	 */
	function updateColumns(val) {
		let newClassName = className;

		if (device) {
			newClassName = replaceClass(
				newClassName,
				`ghostkit-list-columns-${device}`,
				val
			);
		} else {
			for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
				newClassName = removeClass(
					newClassName,
					`ghostkit-list-columns-${k}`
				);
			}

			if (val) {
				newClassName = addClass(
					newClassName,
					`ghostkit-list-columns-${val}`
				);
			}
		}

		setAttributes({
			className: newClassName,
		});
	}

	// add new display controls.
	return (
		<InspectorControls>
			<PanelBody>
				<RangeControl
					label={
						<>
							{__('Columns Count', 'ghostkit')}
							<ResponsiveToggle
								checkActive={(checkMedia) => {
									return !!getCurrentColumns(
										className,
										checkMedia
									);
								}}
							/>
						</>
					}
					value={
						parseInt(getCurrentColumns(className, device), 10) ||
						null
					}
					onChange={(value) => {
						updateColumns(value);
					}}
					min={1}
					max={COLUMNS_COUNT_MAX}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * Custom Styles for Start and Reversed attributes of lists.
 *
 * @param props
 */
function GhostKitListStartAndReversedCustomStyles(props) {
	const { attributes, clientId } = props;
	const { start, reversed: isReversed } = attributes;

	const { itemsCount } = useSelect(
		(select) => {
			const { getBlockCount } = select('core/block-editor');

			return {
				itemsCount: getBlockCount(clientId),
			};
		},
		[clientId]
	);

	let styles = '';

	if (isReversed) {
		styles += `counter-reset: li ${(start || itemsCount) + 1}`;
	} else if (start) {
		styles += `counter-reset: li ${start - 1}`;
	}

	if (!styles) {
		return null;
	}

	return (
		<EditorStyles
			styles={`[data-block="${clientId}"].wp-block { ${styles} }`}
		/>
	);
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom display if needed.
 *
 * @param {Function | Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent((OriginalComponent) => {
	function GhostKitIconListWrapper(props) {
		const { setAttributes, attributes } = props;

		const { ghostkitListIcon, ghostkitListIconColor, className } =
			attributes;

		if (props.name !== 'core/list') {
			return <OriginalComponent {...props} />;
		}

		if (!hasClass(className, 'is-style-icon')) {
			return (
				<>
					<OriginalComponent {...props} />
					<GhostKitListColumns {...props} />
					<GhostKitListStartAndReversedCustomStyles {...props} />
				</>
			);
		}

		// add new display controls.
		return (
			<>
				<OriginalComponent {...props} />
				<GhostKitListColumns {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Icon Settings', 'ghostkit')}
						initialOpen
					>
						<IconPicker
							label={__('Icon', 'ghostkit')}
							value={ghostkitListIcon}
							onChange={(value) =>
								setAttributes({ ghostkitListIcon: value })
							}
							insideInspector
						/>
						<ColorPicker
							label={__('Color', 'ghostkit')}
							value={ghostkitListIconColor}
							onChange={(val) =>
								setAttributes({ ghostkitListIconColor: val })
							}
							alpha
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}

	return GhostKitIconListWrapper;
}, 'withInspectorControl');

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props        Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles(customStyles, props) {
	const result = {};

	if (
		props.name !== 'core/list' ||
		!hasClass(props.attributes.className, 'is-style-icon')
	) {
		return customStyles;
	}

	if (props.attributes.ghostkitListIcon) {
		result['--gkt-icon-lists--decoration'] =
			`url('data:image/svg+xml;utf8,${props.attributes.ghostkitListIcon}')`;
	}
	if (props.attributes.ghostkitListIconColor) {
		result['--gkt-icon-lists--decoration__color'] =
			props.attributes.ghostkitListIconColor;
	}

	if (
		props.attributes.ghostkitListIcon ||
		props.attributes.ghostkitListIconColor
	) {
		customStyles = merge(customStyles, result);
	}

	return customStyles;
}

// Init filters.
addFilter(
	'blocks.registerBlockType',
	'ghostkit/core-list/additional-attributes',
	addAttribute
);
addFilter(
	'editor.BlockEdit',
	'ghostkit/core-list/additional-attributes',
	withInspectorControl,
	9
);
addFilter(
	'ghostkit.blocks.customStyles',
	'ghostkit/core-list/editor-custom-styles',
	addEditorCustomStyles
);
