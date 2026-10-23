import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import classnames from 'classnames/dedupe';

// Fixed sizes keep the windowing math exact, so rows are never measured.
const COLUMNS = 6;
const HEADING_HEIGHT = 32;
const ROW_HEIGHT = 44;
const OVERSCAN = 300;

/**
 * Lay out groups as rows: a heading row, then rows of COLUMNS icons.
 *
 * @param {Array} groups groups, `{ key, title, items }`.
 *
 * @return {Object} `{ rows, cells, height }`.
 */
function layout(groups) {
	const rows = [];
	const cells = [];
	let top = 0;

	groups.forEach((group) => {
		rows.push({
			key: `heading-${group.key}`,
			top,
			height: HEADING_HEIGHT,
			title: group.title,
		});
		top += HEADING_HEIGHT;

		for (let i = 0; i < group.items.length; i += COLUMNS) {
			const row = rows.length;

			rows.push({
				key: `icons-${group.key}-${i}`,
				top,
				height: ROW_HEIGHT,
				cells: group.items.slice(i, i + COLUMNS).map((item, col) => {
					cells.push({ item, row, col });

					return cells.length - 1;
				}),
			});
			top += ROW_HEIGHT;
		}
	});

	return { rows, cells, height: top };
}

function iconHtml(item) {
	return item.svg || `<span class="${item.class}"></span>`;
}

/**
 * Scrollable icons grid with sticky group headings. Mounts only the rows
 * near the visible area and moves focus between cells with the arrow keys.
 *
 * @param {Object}   props            props.
 * @param {string}   props.label      accessible name of the grid.
 * @param {Array}    props.groups     groups, `{ key, title, items }`.
 * @param {Function} props.isSelected tells whether an item is the current value.
 * @param {Function} props.onPick     called with the picked item.
 * @param {Function} props.onHover    called with the hovered or focused item, or null.
 * @param {Function} props.onType     called with a printable key typed in the grid.
 * @param {Function} props.onExitTop  called on ArrowUp from the first row.
 * @param {Object}   ref              `{ focusFirst }`.
 */
function IconGrid(
	{ label, groups, isSelected, onPick, onHover, onType, onExitTop },
	ref
) {
	const scrollRef = useRef();
	const pendingFocus = useRef(null);
	const opened = useRef(false);
	const [scrollTop, setScrollTop] = useState(0);
	const [viewHeight, setViewHeight] = useState(0);
	const [active, setActive] = useState(null);

	const { rows, cells, height } = useMemo(() => layout(groups), [groups]);

	const selectedIndex = cells.findIndex((cell) => isSelected(cell.item));
	const current = active ?? Math.max(selectedIndex, 0);

	useLayoutEffect(() => {
		const node = scrollRef.current;
		const update = () => setViewHeight(node.clientHeight);
		const observer = new node.ownerDocument.defaultView.ResizeObserver(
			update
		);

		update();
		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	// The picker opens at the selected icon, so its row is mounted and takes the tab stop.
	// A new search or pack filter starts from the top.
	useLayoutEffect(() => {
		if (!opened.current && selectedIndex > -1) {
			scrollToRow(rows[cells[selectedIndex].row]);
		} else {
			scrollRef.current.scrollTop = 0;
			setScrollTop(0);
		}

		opened.current = true;
		setActive(null);
		onHover(null);
	}, [groups]);

	// Focus the cell requested by the keyboard once its row is mounted.
	useEffect(() => {
		if (pendingFocus.current === null) {
			return;
		}

		const node = scrollRef.current.querySelector(
			`[data-index="${pendingFocus.current}"]`
		);

		if (node) {
			pendingFocus.current = null;
			node.focus({ preventScroll: true });
		}
	});

	function scrollToRow(row) {
		const node = scrollRef.current;
		let top = node.scrollTop;

		// The sticky heading covers the first HEADING_HEIGHT pixels.
		if (row.top - HEADING_HEIGHT < top) {
			top = Math.max(0, row.top - HEADING_HEIGHT);
		} else if (row.top + row.height > top + node.clientHeight) {
			top = row.top + row.height - node.clientHeight;
		}

		if (top !== node.scrollTop) {
			node.scrollTop = top;
			setScrollTop(top);
		}
	}

	function moveTo(index) {
		if (index < 0 || index >= cells.length) {
			return;
		}

		const node = scrollRef.current;

		scrollToRow(rows[cells[index].row]);

		pendingFocus.current = index;
		setActive(index);

		const cell = node.querySelector(`[data-index="${index}"]`);

		if (cell) {
			pendingFocus.current = null;
			cell.focus({ preventScroll: true });
		}
	}

	useImperativeHandle(ref, () => ({
		focusFirst() {
			moveTo(0);
		},
	}));

	function rowWithCells(from, step) {
		for (let i = from + step; i >= 0 && i < rows.length; i += step) {
			if (rows[i].cells) {
				return rows[i];
			}
		}

		return null;
	}

	function onKeyDown(event) {
		const node = event.target.closest('[data-index]');

		if (!node) {
			return;
		}

		const index = Number(node.getAttribute('data-index'));
		const { row, col } = cells[index];
		let target = null;

		switch (event.key) {
			case 'ArrowRight':
				target = index + 1;
				break;
			case 'ArrowLeft':
				target = index - 1;
				break;
			case 'ArrowDown': {
				const next = rowWithCells(row, 1);

				if (next) {
					target = next.cells[Math.min(col, next.cells.length - 1)];
				}
				break;
			}
			case 'ArrowUp': {
				const prev = rowWithCells(row, -1);

				if (prev) {
					target = prev.cells[Math.min(col, prev.cells.length - 1)];
				} else {
					event.preventDefault();
					onExitTop();
					return;
				}
				break;
			}
			case 'Home':
				target = 0;
				break;
			case 'End':
				target = cells.length - 1;
				break;
			default:
				if (
					event.key.length === 1 &&
					event.key !== ' ' &&
					!event.metaKey &&
					!event.ctrlKey &&
					!event.altKey
				) {
					event.preventDefault();
					onType(event.key);
				}
				return;
		}

		event.preventDefault();

		if (target !== null) {
			moveTo(target);
		}
	}

	// The heading of the group at the top of the view, pushed up by the next one.
	let sticky = null;
	let stickyOffset = 0;

	rows.forEach((row) => {
		if (!row.title) {
			return;
		}

		if (row.top <= scrollTop) {
			sticky = row;
		} else if (sticky && row.top - scrollTop < HEADING_HEIGHT) {
			stickyOffset = row.top - scrollTop - HEADING_HEIGHT;
		}
	});

	const visibleRows = rows.filter(
		(row) =>
			row.top + row.height >= scrollTop - OVERSCAN &&
			row.top <= scrollTop + viewHeight + OVERSCAN
	);

	// Keep one option tabbable when the current one is scrolled out and unmounted.
	const mountedCells = visibleRows.flatMap((row) => row.cells || []);
	const tabStop = mountedCells.includes(current) ? current : mountedCells[0];

	return (
		<div
			ref={scrollRef}
			className="ghostkit-component-icon-picker-grid"
			onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
		>
			{sticky ? (
				<div
					className="ghostkit-component-icon-picker-heading is-sticky"
					aria-hidden="true"
					style={{
						height: HEADING_HEIGHT,
						marginBottom: -HEADING_HEIGHT,
						transform: stickyOffset
							? `translateY(${stickyOffset}px)`
							: undefined,
					}}
				>
					{sticky.title}
				</div>
			) : null}
			<div
				role="listbox"
				aria-label={label}
				tabIndex={-1}
				onKeyDown={onKeyDown}
				onMouseLeave={() => onHover(null)}
				onBlur={(event) => {
					if (!event.currentTarget.contains(event.relatedTarget)) {
						onHover(null);
					}
				}}
				style={{ position: 'relative', height }}
			>
				{visibleRows.map((row) => (
					<div
						key={row.key}
						role="presentation"
						aria-hidden={row.title ? 'true' : undefined}
						className={
							row.title
								? 'ghostkit-component-icon-picker-heading'
								: 'ghostkit-component-icon-picker-row'
						}
						style={{
							position: 'absolute',
							top: row.top,
							left: 0,
							width: '100%',
							height: row.height,
						}}
					>
						{row.title ||
							row.cells.map((index) => {
								const { item } = cells[index];
								const selected = isSelected(item);

								return (
									<button
										key={index}
										type="button"
										role="option"
										aria-selected={selected}
										aria-label={item.name}
										data-index={index}
										tabIndex={index === tabStop ? 0 : -1}
										className={classnames(
											'ghostkit-component-icon-picker-button',
											selected ? 'is-selected' : ''
										)}
										onClick={() => onPick(item)}
										onMouseEnter={() => onHover(item)}
										onFocus={() => {
											setActive(index);
											onHover(item);
										}}
										dangerouslySetInnerHTML={{
											__html: iconHtml(item),
										}}
									/>
								);
							})}
					</div>
				))}
			</div>
		</div>
	);
}

export default forwardRef(IconGrid);
