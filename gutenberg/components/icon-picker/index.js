import classnames from 'classnames/dedupe';

import dashCaseToTitle from '../../utils/dash-case-to-title';
import { maybeDecode, maybeEncode } from '../../utils/encode-decode';
import IconGrid from './icon-grid';
import { useIcons } from './icons-store';
import { useRecentIcons } from './recent-icons';

const { GHOSTKIT } = window;

import {
	BaseControl,
	Button,
	Dropdown,
	__experimentalToggleGroupControl as ExperimentalToggleGroupControl,
	__experimentalToggleGroupControlOption as ExperimentalToggleGroupControlOption,
	Path,
	SearchControl,
	SelectControl,
	Spinner,
	ToggleGroupControl as StableToggleGroupControl,
	ToggleGroupControlOption as StableToggleGroupControlOption,
	SVG,
	TextareaControl,
} from '@wordpress/components';
import { useMemo, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ToggleGroupControl =
	StableToggleGroupControl || ExperimentalToggleGroupControl;
const ToggleGroupControlOption =
	StableToggleGroupControlOption || ExperimentalToggleGroupControlOption;

// More packs than this do not fit a toggle group in the popover, so they get a select.
const MAX_TOGGLE_PACKS = 2;

const codeIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M20.8 10.7l-4.3-4.3-1.1 1.1 4.3 4.3c.1.1.1.3 0 .4l-4.3 4.3 1.1 1.1 4.3-4.3c.7-.8.7-1.9 0-2.6zM4.2 11.8l4.3-4.3-1-1-4.3 4.3c-.7.7-.7 1.8 0 2.5l4.3 4.3 1.1-1.1-4.3-4.3c-.2-.1-.2-.3-.1-.4z" />
	</SVG>
);

/**
 * Go over each icon.
 *
 * @param {Object}   icons    icons list.
 * @param {Function} callback callback.
 */
function eachIcons(icons, callback) {
	const { settings } = GHOSTKIT;

	Object.keys(icons).forEach((key) => {
		const allow =
			typeof settings[`icon_pack_${key}`] === 'undefined' ||
			settings[`icon_pack_${key}`];

		if (allow) {
			callback(icons[key], key);
		}
	});
}

/**
 * Get Icon Tip.
 *
 * @param {Object} iconData icon data.
 *
 * @return {string} tip
 */
function getIconTip(iconData) {
	let result = '';

	if (iconData.keys) {
		result = dashCaseToTitle(iconData.keys.split(',')[0]);
	}

	return result;
}

/**
 * Enabled icon packs with their icons prepared for the picker.
 *
 * @param {Object} icons icons list from the REST route.
 *
 * @return {Array} packs, `{ key, title, items }`.
 */
function preparePacks(icons) {
	const packs = [];

	eachIcons(icons, (iconsData, key) => {
		packs.push({
			key,
			title: iconsData.name || key,
			items: (iconsData.icons || []).map((iconData) => ({
				// FontAwesome regular and solid icons share keys, the fallback class tells them apart.
				id: `${key}:${iconData.fallback || iconData.keys}`,
				name: getIconTip(iconData) || iconsData.name || key,
				keys: (iconData.keys || '').toLowerCase(),
				svg: iconData.svg,
				class: iconData.class,
				value: maybeDecode(iconData.svg),
				fallback: iconData.fallback,
			})),
		});
	});

	return packs;
}

/**
 * Popover content: search, pack filter, icons grid and footer.
 *
 * @param {Object}   props          props.
 * @param {string}   props.value    current icon.
 * @param {Function} props.onChange change callback.
 */
function IconPickerContent({ value, onChange }) {
	const { icons, error } = useIcons();
	const { recent, addRecent } = useRecentIcons();

	const [search, setSearch] = useState('');
	const [pack, setPack] = useState('all');
	const [customizeIcon, setCustomizeIcon] = useState(false);
	const [hover, setHover] = useState(null);
	// Recent icons stay in place while the popover is open, so a pick does not move the grid.
	const [recentOnOpen] = useState(recent);

	const searchRef = useRef();
	const gridRef = useRef();

	const decodedValue = maybeDecode(value);

	// The packs list is printed with the page, so the filter shows before the icons load.
	const packOptions = useMemo(() => {
		const result = [];

		eachIcons(GHOSTKIT.icons || icons || {}, (data, key) => {
			result.push({ value: key, label: data.name || key });
		});

		return result;
	}, [icons]);

	const packs = useMemo(() => (icons ? preparePacks(icons) : []), [icons]);

	const groups = useMemo(() => {
		const query = search.trim().toLowerCase();
		const result = [];

		if (!query && pack === 'all' && recentOnOpen.length) {
			const items = [];

			recentOnOpen.forEach((id) => {
				packs.forEach((data) => {
					const item = data.items.find((i) => i.id === id);

					if (item) {
						items.push(item);
					}
				});
			});

			if (items.length) {
				result.push({
					key: 'recent',
					title: __('Recent', 'ghostkit'),
					items,
				});
			}
		}

		packs.forEach((data) => {
			if (pack !== 'all' && pack !== data.key) {
				return;
			}

			const items = query
				? data.items.filter((item) => item.keys.indexOf(query) > -1)
				: data.items;

			if (items.length) {
				result.push({ key: data.key, title: data.title, items });
			}
		});

		return result;
	}, [packs, search, pack, recentOnOpen]);

	function isSelected(item) {
		return (
			!!decodedValue &&
			(item.value === decodedValue || item.fallback === decodedValue)
		);
	}

	let selectedItem = null;

	packs.some((data) => {
		selectedItem = data.items.find(isSelected) || null;

		return !!selectedItem;
	});

	function pick(item) {
		onChange(maybeDecode(item.svg));
		addRecent(item.id);
	}

	let currentName = __('No icon', 'ghostkit');

	if (hover) {
		currentName = hover.name;
	} else if (selectedItem) {
		currentName = selectedItem.name;
	} else if (decodedValue) {
		currentName = __('Custom SVG', 'ghostkit');
	}

	let grid;

	if (!icons) {
		grid = error ? (
			<p className="ghostkit-component-icon-picker-empty">
				{__('Icons failed to load.', 'ghostkit')}
			</p>
		) : (
			<div className="ghostkit-component-icon-picker-empty">
				<Spinner />
			</div>
		);
	} else if (!groups.length) {
		grid = (
			<p className="ghostkit-component-icon-picker-empty">
				{__('No icons found.', 'ghostkit')}
			</p>
		);
	} else {
		grid = (
			<IconGrid
				ref={gridRef}
				label={__('Icons', 'ghostkit')}
				groups={groups}
				isSelected={isSelected}
				onPick={pick}
				onHover={setHover}
				onType={(key) => {
					setSearch(search + key);
					searchRef.current?.focus();
				}}
				onExitTop={() => searchRef.current?.focus()}
			/>
		);
	}

	let packControl = null;

	if (packOptions.length > MAX_TOGGLE_PACKS) {
		packControl = (
			<SelectControl
				label={__('Icon pack', 'ghostkit')}
				hideLabelFromVision
				value={pack}
				options={[
					{ value: 'all', label: __('All', 'ghostkit') },
					...packOptions,
				]}
				onChange={setPack}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		);
	} else if (packOptions.length > 1) {
		packControl = (
			<ToggleGroupControl
				label={__('Icon pack', 'ghostkit')}
				hideLabelFromVision
				value={pack}
				onChange={(val) => setPack(val || 'all')}
				className="ghostkit-component-icon-picker-packs"
				isBlock
				isAdaptiveWidth
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			>
				<ToggleGroupControlOption
					value="all"
					label={__('All', 'ghostkit')}
				/>
				{packOptions.map((option) => (
					<ToggleGroupControlOption
						key={option.value}
						value={option.value}
						label={option.label}
					/>
				))}
			</ToggleGroupControl>
		);
	}

	return (
		<div className="ghostkit-component-icon-picker">
			<SearchControl
				ref={searchRef}
				label={__('Search icons', 'ghostkit')}
				placeholder={__('Search icons', 'ghostkit')}
				value={search}
				onChange={setSearch}
				onKeyDown={(event) => {
					if (event.key === 'ArrowDown') {
						event.preventDefault();
						gridRef.current?.focusFirst();
					} else if (event.key === 'Enter') {
						const first = groups.find(
							(group) => group.key !== 'recent'
						);

						if (first) {
							event.preventDefault();
							pick(first.items[0]);
						}
					} else if (event.key === 'Escape' && search) {
						// Clear the search first; the next Escape closes the popover.
						event.preventDefault();
						setSearch('');
					}
				}}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
			{packControl}
			{grid}
			<div className="ghostkit-component-icon-picker-footer">
				<span
					className={classnames(
						'ghostkit-component-icon-picker-current',
						hover && hover !== selectedItem ? 'is-preview' : ''
					)}
				>
					{currentName}
				</span>
				<Button
					icon={codeIcon}
					label={__('Custom SVG', 'ghostkit')}
					isPressed={customizeIcon}
					onClick={() => setCustomizeIcon(!customizeIcon)}
					size="compact"
				/>
				<Button
					variant="tertiary"
					disabled={!value}
					accessibleWhenDisabled
					onClick={() => onChange('')}
					size="compact"
				>
					{__('Reset', 'ghostkit')}
				</Button>
			</div>
			{customizeIcon ? (
				<TextareaControl
					label={__('Icon Output', 'ghostkit')}
					value={value}
					onChange={onChange}
					autoComplete="off"
					__nextHasNoMarginBottom
				/>
			) : null}
		</div>
	);
}

/**
 * Dropdown
 *
 * @param props
 */
function IconPickerDropdown(props) {
	const { onChange, value, label, className, renderToggle, insideInspector } =
		props;

	const dropdown = (
		<Dropdown
			className={className}
			contentClassName="ghostkit-component-icon-picker-content"
			renderToggle={renderToggle}
			renderContent={() => (
				<IconPickerContent value={value} onChange={onChange} />
			)}
			{...(insideInspector
				? {
						popoverProps: {
							placement: 'left-start',
							offset: 36,
							shift: true,
						},
					}
				: {})}
		/>
	);

	return label ? (
		<BaseControl id={label} label={label} className={className}>
			{dropdown}
		</BaseControl>
	) : (
		dropdown
	);
}

export default function IconPicker(props) {
	const { value, label, onChange, insideInspector } = props;

	return (
		<BaseControl className="ghostkit-component-icon-picker-wrapper">
			<IconPicker.Dropdown
				onChange={(val) => onChange(maybeEncode(val))}
				value={maybeDecode(value)}
				insideInspector={insideInspector}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className={classnames(
							'ghostkit-component-icon-picker-toggle',
							isOpen
								? 'ghostkit-component-icon-picker-toggle-active'
								: ''
						)}
						onClick={onToggle}
					>
						<IconPicker.Preview
							className="ghostkit-component-icon-picker-toggle-indicator"
							name={maybeDecode(value)}
							alwaysRender
						/>
						<span className="ghostkit-component-icon-picker-toggle-label">
							{label}
						</span>
					</Button>
				)}
			/>
		</BaseControl>
	);
}

// dropdown
IconPicker.Dropdown = IconPickerDropdown;

// preview icon.
IconPicker.Preview = (props) => {
	const { onClick, className, alwaysRender = false } = props;

	let { data, name } = props;

	// The list lookup changes the output only for class name values
	// (legacy icons with an SVG fallback), so SVG values need no list.
	const needsList = !data && !!name && !/^</.test(maybeDecode(name));
	const { icons } = useIcons(needsList);

	if (needsList && icons) {
		eachIcons(icons, (iconsData) => {
			iconsData.icons.forEach((iconData) => {
				if (
					!data &&
					iconData.svg &&
					(iconData.svg === name ||
						(iconData.fallback &&
							iconData.fallback === name &&
							iconData.svg))
				) {
					if (iconData.svg) {
						data = iconData;
					} else {
						name = iconData.class;
					}
				}
			});
		});
	}

	let result = '';

	if (data && data.svg) {
		result = data.svg;
	} else if (name || (data && data.class)) {
		result = name || data.class;
	}

	return result || alwaysRender ? (
		<IconPicker.Render
			name={maybeDecode(result)}
			tag="span"
			className={classnames(
				className,
				'ghostkit-component-icon-picker-preview',
				onClick
					? 'ghostkit-component-icon-picker-preview-clickable'
					: ''
			)}
			onClick={onClick}
			onKeyPress={() => {}}
			role="button"
			tabIndex={0}
			alwaysRender={alwaysRender}
		/>
	) : null;
};

// render icon.
IconPicker.Render = (props) => {
	const { tag = 'span', name, alwaysRender = false, ...restProps } = props;

	const Tag = tag;
	let result = '';

	const decodedName = maybeDecode(name);

	if (decodedName && /^</g.test(decodedName)) {
		result = decodedName;
	} else if (decodedName) {
		result = `<span class="${decodedName}"></span>`;
	}

	if (!result && !alwaysRender) {
		return null;
	}

	return <Tag dangerouslySetInnerHTML={{ __html: result }} {...restProps} />;
};
