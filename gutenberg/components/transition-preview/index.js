/**
 * WordPress dependencies
 */
const { BaseControl, Button } = wp.components;
const { useCallback, useEffect, useRef } = wp.element;
const { useDebounce } = wp.compose;

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
      animationRef.current = animate(buttonSquareRef.current, { x: 0 }, { duration: 0 });
    }
  }

  // Run animation.
  function runAnimation(opts) {
    resetAnimation();

    setTimeout(() => {
      if (buttonRef.current && buttonSquareRef.current) {
        const animationOptions = {};

        if (opts?.type === 'easing') {
          animationOptions.easing = opts.easing;
          animationOptions.duration = opts.duration;
        } else if (opts?.type === 'spring') {
          animationOptions.easing = spring({
            stiffness: opts.stiffness,
            damping: opts.damping,
            mass: opts.mass,
          });
        }

        const computedStyle = getComputedStyle(buttonRef.current);
        let translateX = buttonRef.current.clientWidth;
        translateX -= buttonSquareRef.current.clientWidth;
        translateX -=
          parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

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

  const runAnimationDebounce = useCallback(useDebounce(runAnimation, 1000), []);

  useEffect(() => {
    // Reset animation.
    resetAnimation();

    runAnimationDebounce(options);
  }, [buttonRef, buttonSquareRef, options, runAnimationDebounce]);

  return (
    <BaseControl label={label} className="ghostkit-component-transition-preview-wrapper">
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
