/**
 * Block Image Compare
 */
import rafSchd from 'raf-schd';

const { GHOSTKIT } = window;

let $currentImageCompare = false;
let orientation = '';
let disabledTransition = false;

function movePosition(e) {
  if ($currentImageCompare) {
    const rect = $currentImageCompare.getBoundingClientRect();
    let move = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (orientation === 'vertical') {
      move = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    }

    const result = Math.round(10000 * move) / 100;

    $currentImageCompare.style.setProperty('--gkt-image-compare__position', `${result}%`);

    GHOSTKIT.triggerEvent('movedImageCompare', GHOSTKIT.classObject, $currentImageCompare, e);
  }
}

document.querySelectorAll('.ghostkit-image-compare').forEach(($this) => {
  orientation = $this.classList.contains('ghostkit-image-compare-vertical')
    ? 'vertical'
    : 'horizontal';

  $this.addEventListener('mousedown', (e) => {
    e.preventDefault();

    $currentImageCompare = $this;
  });
});

window.addEventListener('mouseup', (e) => {
  if ($currentImageCompare) {
    movePosition(e);

    $currentImageCompare.style.removeProperty('--gkt-image-compare__transition-duration');
    $currentImageCompare.style.removeProperty('--gkt-image-compare--overlay__opacity');

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
        $currentImageCompare.style.setProperty('--gkt-image-compare--overlay__opacity', '0');

        disabledTransition = true;
      }

      movePosition(e);
    }
  })
);
