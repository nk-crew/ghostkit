import { useEffect, useRef } from '@wordpress/element';

/**
 * Lottie animation preview.
 *
 * @param props
 */
export default function PreviewLottie(props) {
	const {
		url,
		trigger,
		speed,
		loop,
		direction,
		isSelected,
		onLoad = () => {},
	} = props;

	const lottieRef = useRef(null);

	// Load assets.
	useEffect(() => {
		const element = lottieRef.current;

		if (!element) {
			return undefined;
		}

		function loadCallback(e) {
			onLoad(e);
		}

		element.addEventListener('load', loadCallback);

		return () => {
			element.removeEventListener('load', loadCallback);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lottieRef]);

	// lottie-player resolves `src` against `window.location.href`, which is a blob: URL in the
	// iframed editor canvas, so a relative URL fails to load. Pass it already absolute.
	let src = url;
	try {
		src = new URL(url, document.baseURI).href;
	} catch {
		// A typed URL that cannot be parsed goes to the player as is and shows its error state.
	}

	return (
		<lottie-player
			key={`lottie-${trigger}-${speed}-${loop}-${direction}`}
			ref={lottieRef}
			src={src}
			direction={direction}
			background="transparent"
			mode="normal"
			{...(trigger !== 'scroll' ? { speed } : {})}
			{...(trigger !== 'scroll' && loop ? { loop: 'loop' } : {})}
			{...(!trigger || isSelected ? { autoplay: 'autoplay' } : {})}
			{...(trigger === 'hover' ? { hover: 'hover' } : {})}
			style={{
				width: '100%',
				height: 'auto',
			}}
		/>
	);
}
