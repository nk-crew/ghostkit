import { useEffect, useRef } from '@wordpress/element';

import { loadBlockEditorAssets } from '../../utils/block-editor-asset-loader';

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

		function loadCallback(e) {
			onLoad(e);
		}

		element.addEventListener('load', loadCallback);

		loadBlockEditorAssets('js', 'lottie-player-js', element);

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
