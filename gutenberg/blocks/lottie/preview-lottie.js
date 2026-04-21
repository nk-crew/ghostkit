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

	return (
		<lottie-player
			key={`lottie-${trigger}-${speed}-${loop}-${direction}`}
			ref={lottieRef}
			src={url}
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
