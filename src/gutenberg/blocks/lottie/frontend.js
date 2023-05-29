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
$doc.on('click', '.ghostkit-lottie[data-trigger="click"] > lottie-player', function () {
  if (this?.play) {
    this.play();
  }
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
  $('.ghostkit-lottie[data-trigger="scroll"]:not(.ghostkit-lottie-ready)').each(function () {
    const $this = $(this);
    const lottieEl = $this.children('lottie-player')[0];

    $this.addClass('ghostkit-lottie-ready');

    scroll(
      ({ y }) => {
        if (lottieEl?._lottie) {
          const { progress } = y;
          const { totalFrames, goToAndStop } = lottieEl._lottie;
          const newFrame = Math.round(progress * totalFrames);

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
