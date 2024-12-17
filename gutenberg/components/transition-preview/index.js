import { BaseControl, Button } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { useCallback, useEffect, useRef } from '@wordpress/element';

const {
	Motion: { animate, spring },
} = window;

export default function TransitionPreview(props) {
	const { label, options } = props;
	const buttonRef = useRef();
	const buttonSquareRef = useRef();
	const animationRef = useRef();

	// Reset animation.
	function resetAnimation() {
		if (animationRef?.current) {
			animationRef.current.stop();
		}

		if (buttonSquareRef.current) {
			animationRef.current = animate(
				buttonSquareRef.current,
				{ x: 0 },
				{ duration: 0 }
			);
		}
	}

	// Run animation.
	function runAnimation(opts) {
		resetAnimation();

		setTimeout(() => {
			if (buttonRef.current && buttonSquareRef.current) {
				const animationOptions = {};

				if (opts?.type === 'easing') {
					animationOptions.type = 'tween';
					animationOptions.ease = opts.easing;
					animationOptions.duration = opts.duration;
				} else if (opts?.type === 'spring') {
					animationOptions.type = spring;
					animationOptions.stiffness = opts.stiffness;
					animationOptions.damping = opts.damping;
					animationOptions.mass = opts.mass;
				}

				const computedStyle = window.getComputedStyle(
					buttonRef.current
				);
				let translateX = buttonRef.current.clientWidth;
				translateX -= buttonSquareRef.current.clientWidth;
				translateX -=
					parseFloat(computedStyle.paddingLeft) +
					parseFloat(computedStyle.paddingRight);

				animationRef.current = animate(
					buttonSquareRef.current,
					{
						x: `${translateX}px`,
					},
					animationOptions
				);
			}
		}, 1);
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const runAnimationDebounce = useCallback(
		useDebounce(runAnimation, 1000),
		[]
	);

	useEffect(() => {
		// Reset animation.
		resetAnimation();

		runAnimationDebounce(options);
	}, [buttonRef, buttonSquareRef, options, runAnimationDebounce]);

	return (
		<BaseControl
			id={label}
			label={label}
			className="ghostkit-component-transition-preview-wrapper"
			__nextHasNoMarginBottom
		>
			<Button
				className="ghostkit-component-transition-preview"
				ref={buttonRef}
				onClick={(e) => {
					e.preventDefault();
					runAnimation(options);
				}}
			>
				<span ref={buttonSquareRef} />
			</Button>
		</BaseControl>
	);
}
