/**
 * Block Lottie
 */
const {
  jQuery: $,
  Motion: { inView },
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
