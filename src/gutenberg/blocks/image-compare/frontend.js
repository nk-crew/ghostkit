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

    let move = 0;

    if (orientation === 'vertical') {
      move = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    } else {
      move = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    }

    const result = Math.round(10000 * move) / 100;

    $currentImageCompare.style.setProperty('--gkt-image-compare__position', `${result}%`);

    GHOSTKIT.triggerEvent('movedImageCompare', GHOSTKIT.classObject, $currentImageCompare, e);
  }
}

window.addEventListener('mousedown', (e) => {
  const $imageCompareBlock = e?.target?.closest('.ghostkit-image-compare');

  if (!$imageCompareBlock) {
    return;
  }

  e.preventDefault();

  $currentImageCompare = $imageCompareBlock;
  orientation = $imageCompareBlock.classList.contains('ghostkit-image-compare-vertical')
    ? 'vertical'
    : 'horizontal';
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
