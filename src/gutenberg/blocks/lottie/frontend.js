/* eslint-disable no-underscore-dangle */
/**
 * Block Lottie
 */
const {
  jQuery: $,
  Motion: { inView, scroll },
} = window;

const $doc = $(document);

// Click trigger.
document
  .querySelectorAll('.ghostkit-lottie[data-trigger="click"] > lottie-player')
  .forEach(($this) => {
    const handler = () => {
      if ($this?.play) {
        $this.play();
      }
    };

    $this.addEventListener('click', handler);
  });

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
$doc.on('initBlocks.ghostkit', () => {
  document
    .querySelectorAll('.ghostkit-lottie[data-trigger="scroll"]:not(.ghostkit-lottie-ready)')
    .forEach(($this) => {
      const lottieEl = $this.querySelector('lottie-player');
      const reverse = lottieEl.getAttribute('direction') === '-1';

      $this.classList.add('ghostkit-lottie-ready');

      scroll(
        ({ y }) => {
          if (lottieEl?._lottie) {
            const { progress } = y;
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
