import {
	useLayoutEffect,
	useReducer,
	useRef,
	useState,
} from '@wordpress/element';

const DEFAULT_ROW_HEIGHT = 65;
const OVERSCAN = 300;

/**
 * Scrollable list that mounts only the rows near the visible area.
 * Row heights are measured after render and cached by row key.
 *
 * @param {Object} props           props.
 * @param {Array}  props.rows      rows, `{ key, render }`.
 * @param {string} props.className scroll container class name.
 */
export default function VirtualList({ rows, className }) {
	const ref = useRef();
	const heights = useRef({});
	const [scrollTop, setScrollTop] = useState(0);
	const [viewHeight, setViewHeight] = useState(0);
	const [, rerender] = useReducer((count) => count + 1, 0);

	useLayoutEffect(() => {
		const node = ref.current;
		const update = () => setViewHeight(node.clientHeight);
		const observer = new node.ownerDocument.defaultView.ResizeObserver(
			update
		);

		update();
		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	// Measure mounted rows; render again when a cached height changed.
	useLayoutEffect(() => {
		let changed = false;

		ref.current
			.querySelectorAll(':scope > div > [data-row-key]')
			.forEach((node) => {
				const key = node.getAttribute('data-row-key');

				if (heights.current[key] !== node.offsetHeight) {
					heights.current[key] = node.offsetHeight;
					changed = true;
				}
			});

		if (changed) {
			rerender();
		}
	});

	const visibleRows = [];
	let top = 0;

	rows.forEach((row) => {
		const height = heights.current[row.key] ?? DEFAULT_ROW_HEIGHT;

		if (
			top + height >= scrollTop - OVERSCAN &&
			top <= scrollTop + viewHeight + OVERSCAN
		) {
			visibleRows.push(
				<div
					key={row.key}
					data-row-key={row.key}
					className="ghostkit-component-icon-picker-list-row"
					style={{
						position: 'absolute',
						top,
						left: 0,
						width: '100%',
					}}
				>
					{row.render || ''}
				</div>
			);
		}

		top += height;
	});

	return (
		<div
			ref={ref}
			className={className}
			style={{ height: '100%', overflowY: 'auto' }}
			onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
		>
			<div style={{ position: 'relative', height: top }}>
				{visibleRows}
			</div>
		</div>
	);
}
