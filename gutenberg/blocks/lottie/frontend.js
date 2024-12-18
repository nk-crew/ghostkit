/**
 * Block Lottie
 */
const {
	GHOSTKIT: { events },
	Motion: { inView, scroll },
} = window;

// Click trigger.
events.on(
	document,
	'click',
	'.ghostkit-lottie[data-trigger="click"] > lottie-player',
	(e) => {
		if (e.delegateTarget?.play) {
			e.delegateTarget.play();
		}
	}
);

// In Viewport trigger.
inView('.ghostkit-lottie[data-trigger="viewport"] > lottie-player', (info) => {
	if (info?.target?.play) {
		info.target.play();
	}

	return (leaveInfo) => {
		if (leaveInfo?.target?.pause) {
			leaveInfo.target.pause();
		}
	};
});

// Scroll trigger.
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll(
			'.ghostkit-lottie[data-trigger="scroll"]:not(.ghostkit-lottie-ready)'
		)
		.forEach(($this) => {
			const lottieEl = $this.querySelector('lottie-player');
			const reverse = lottieEl.getAttribute('direction') === '-1';

			$this.classList.add('ghostkit-lottie-ready');

			scroll(
				(progress) => {
					if (lottieEl?._lottie) {
						const { totalFrames, goToAndStop } = lottieEl._lottie;
						let newFrame = Math.round(progress * totalFrames);

						if (reverse) {
							newFrame = totalFrames - newFrame;
						}

						// Check if the current frame is the last frame. If it's the last frame, do nothing. This prevents showing the empty frame at the end. Thanks Pauline for pointing out.
						if (newFrame < totalFrames) {
							goToAndStop.call(lottieEl._lottie, newFrame, true);
						}
					}
				},
				{
					target: lottieEl,
					offset: ['start end', 'end start'],
				}
			);
		});
});
