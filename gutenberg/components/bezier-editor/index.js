import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const KEYBOARD_STEP = 0.01;
const KEYBOARD_STEP_LARGE = 0.1;

/**
 * Cubic bezier curve editor with draggable and keyboard controlled handles.
 * Props follow the `bezier-easing-editor` package this component replaces.
 *
 * @param {Object}   props               props.
 * @param {number[]} props.value         cubic bezier `[x1, y1, x2, y2]`.
 * @param {Function} props.onChange      receives the new value array.
 * @param {number}   props.width         svg width.
 * @param {number}   props.height        svg height.
 * @param {number[]} props.padding       `[top, right, bottom, left]`.
 * @param {string}   props.background    svg background.
 * @param {string}   props.curveColor    curve color.
 * @param {number}   props.curveWidth    curve width.
 * @param {string}   props.handleColor   handle color.
 * @param {number}   props.handleRadius  handle radius.
 * @param {number}   props.handleStroke  handle stroke width.
 * @param {boolean}  props.readOnly      hide handles.
 */
export default function BezierEditor({
	value = [0.25, 0.25, 0.75, 0.75],
	onChange,
	width = 300,
	height = 300,
	padding = [25, 5, 25, 18],
	background = '#fff',
	curveColor = '#333',
	curveWidth = 2,
	handleColor = '#f00',
	handleRadius = 5,
	handleStroke = 2,
	readOnly = false,
}) {
	const svgRef = useRef();
	const [down, setDown] = useState(null);
	const [hover, setHover] = useState(null);
	const [focus, setFocus] = useState(null);

	const innerWidth = width - padding[1] - padding[3];
	const innerHeight = height - padding[0] - padding[2];

	const x = (val) => Math.round(padding[3] + val * innerWidth);
	const y = (val) => Math.round(padding[0] + (1 - val) * innerHeight);

	// Handles stay inside the svg, so y may go a bit outside 0..1.
	const clampMargin = 2 * handleRadius;
	const minY = 1 - (height - clampMargin - padding[0]) / innerHeight;
	const maxY = 1 - (clampMargin - padding[0]) / innerHeight;

	const clampX = (val) => Math.max(0, Math.min(val, 1));
	const clampY = (val) => Math.max(minY, Math.min(val, maxY));

	function updateHandle(index, newX, newY) {
		if (!onChange) {
			return;
		}

		const newValue = [...value];

		newValue[2 * index] = clampX(newX);
		newValue[2 * index + 1] = clampY(newY);

		onChange(newValue);
	}

	function moveToPointer(index, e) {
		const rect = svgRef.current.getBoundingClientRect();

		updateHandle(
			index,
			(e.clientX - rect.left - padding[3]) / innerWidth,
			1 - (e.clientY - rect.top - padding[0]) / innerHeight
		);
	}

	function onHandleKeyDown(index, e) {
		const step = e.shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP;
		const delta = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, step],
			ArrowDown: [0, -step],
		}[e.key];

		if (!delta) {
			return;
		}

		e.preventDefault();

		if (!onChange) {
			return;
		}

		// Clamp only the axis the key moves, so a value outside the range
		// on the other axis (y of Ease Out Back is 1.56) stays as it is.
		const newValue = [...value];

		if (delta[0]) {
			newValue[2 * index] = clampX(value[2 * index] + delta[0]);
		} else {
			newValue[2 * index + 1] = clampY(value[2 * index + 1] + delta[1]);
		}

		onChange(newValue);
	}

	const xFrom = x(0);
	const yFrom = y(0);
	const xTo = x(1);
	const yTo = y(1);

	const curve = `M${xFrom},${yFrom} C${x(value[0])},${y(value[1])} ${x(
		value[2]
	)},${y(value[3])} ${xTo},${yTo}`;

	let cursor = 'default';
	if (down !== null) {
		cursor = 'none';
	} else if (hover !== null) {
		cursor = 'pointer';
	}

	const containerEvents =
		readOnly || down === null
			? {}
			: {
					onPointerMove: (e) => moveToPointer(down, e),
					onPointerUp: () => setDown(null),
					onPointerCancel: () => setDown(null),
				};

	function renderHandle(index) {
		const sx = index ? xTo : xFrom;
		const sy = index ? yTo : yFrom;
		const cx = x(value[2 * index]);
		const cy = y(value[2 * index + 1]);
		const angle = Math.atan2(cy - sy, cx - sx);
		const active = hover === index || down === index || focus === index;

		return (
			<g key={index}>
				<line
					stroke={handleColor}
					strokeWidth={active ? 1 + handleStroke : handleStroke}
					x1={cx - handleRadius * Math.cos(angle)}
					y1={cy - handleRadius * Math.sin(angle)}
					x2={sx}
					y2={sy}
				/>
				<circle
					cx={cx}
					cy={cy}
					r={handleRadius}
					stroke={handleColor}
					strokeWidth={active ? 2 * handleStroke : handleStroke}
					fill={down === index ? background : handleColor}
					tabIndex={0}
					role="slider"
					aria-label={
						index
							? __('End point handle', 'ghostkit')
							: __('Start point handle', 'ghostkit')
					}
					aria-valuenow={value[2 * index]}
					aria-valuemin={0}
					aria-valuemax={1}
					aria-valuetext={`${value[2 * index]}, ${value[2 * index + 1]}`}
					style={{ outline: 'none' }}
					onPointerDown={(e) => {
						e.preventDefault();
						svgRef.current.setPointerCapture(e.pointerId);
						setHover(null);
						setDown(index);
					}}
					onPointerEnter={() => down === null && setHover(index)}
					onPointerLeave={() => down === null && setHover(null)}
					onFocus={() => setFocus(index)}
					onBlur={() => setFocus(null)}
					onKeyDown={(e) => onHandleKeyDown(index, e)}
				/>
			</g>
		);
	}

	return (
		<svg
			ref={svgRef}
			width={width}
			height={height}
			style={{
				background,
				cursor,
				userSelect: 'none',
				WebkitUserSelect: 'none',
				touchAction: 'none',
			}}
			{...containerEvents}
		>
			<path
				fill="none"
				stroke={curveColor}
				strokeWidth={curveWidth}
				d={curve}
			/>
			{readOnly ? null : (
				<g>
					{renderHandle(0)}
					{renderHandle(1)}
				</g>
			)}
		</svg>
	);
}
