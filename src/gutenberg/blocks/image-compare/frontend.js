/**
 * Block Image Compare
 */
import rafSchd from 'raf-schd';

const { GHOSTKIT } = window;

let $currentImageCompare = false;
let disabledTransition = false;

function movePosition(e) {
  if ($currentImageCompare) {
    const rect = $currentImageCompare.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const result = Math.round(10000 * x) / 100;

    $currentImageCompare.style.setProperty('--gkt-image-compare__position', `${result}%`);

    GHOSTKIT.triggerEvent('movedImageCompare', GHOSTKIT.classObject, $currentImageCompare, e);
  }
}

document.querySelectorAll('.ghostkit-image-compare').forEach(($this) => {
  const handler = (e) => {
    e.preventDefault();

    $currentImageCompare = $this;
  };

  $this.addEventListener('mousedown', handler);
});

window.addEventListener('mouseup', (e) => {
  if ($currentImageCompare) {
    movePosition(e);

    $currentImageCompare.style.removeProperty('--gkt-image-compare__transition-duration');

    $currentImageCompare = false;
    disabledTransition = false;
  }
});

window.addEventListener(
  'mousemove',
  rafSchd((e) => {
    if ($currentImageCompare) {
      e.preventDefault();

      if (!disabledTransition) {
        $currentImageCompare.style.setProperty('--gkt-image-compare__transition-duration', '0s');

        disabledTransition = true;
      }

      movePosition(e);
    }
  })
);
