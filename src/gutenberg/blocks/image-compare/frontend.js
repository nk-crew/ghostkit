/**
 * Block Image Compare
 */
import rafSchd from 'raf-schd';

const { GHOSTKIT } = window;

let $currentImageCompare = false;
let $currentImageCompareWrapper = false;
let orientation = '';
let disabledTransition = false;

function movePosition(e) {
  if ($currentImageCompare && $currentImageCompareWrapper) {
    const rect = $currentImageCompareWrapper.getBoundingClientRect();

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

function init($block) {
  $currentImageCompare = $block;
  $currentImageCompareWrapper = $block.querySelector('.ghostkit-image-compare-images');

  orientation = $block.classList.contains('ghostkit-image-compare-vertical')
    ? 'vertical'
    : 'horizontal';
}

function destroy(e) {
  movePosition(e);

  $currentImageCompare.style.removeProperty('--gkt-image-compare__transition-duration');

  $currentImageCompare = false;
  $currentImageCompareWrapper = false;
  disabledTransition = false;
}

// Trigger - Click.
window.addEventListener('mousedown', (e) => {
  const $imageCompareBlock = e?.target?.closest(
    '.ghostkit-image-compare:not(.ghostkit-image-compare-trigger-hover)'
  );

  if (!$imageCompareBlock) {
    return;
  }

  e.preventDefault();

  init($imageCompareBlock);
});

// Trigger - Hover.
window.addEventListener('mouseover', (e) => {
  if ($currentImageCompare) {
    return;
  }

  const $imageCompareBlock = e?.target?.closest('.ghostkit-image-compare-trigger-hover');

  if (!$imageCompareBlock) {
    return;
  }

  e.preventDefault();

  init($imageCompareBlock);
});
document.addEventListener('mouseout', (e) => {
  if (!$currentImageCompare) {
    return;
  }

  const $imageCompareBlock = e?.target?.closest('.ghostkit-image-compare-trigger-hover');

  if (!$imageCompareBlock) {
    return;
  }

  destroy(e);
});

window.addEventListener('mouseup', (e) => {
  if (!$currentImageCompare) {
    return;
  }

  destroy(e);
});

window.addEventListener(
  'mousemove',
  rafSchd((e) => {
    if (!$currentImageCompare) {
      return;
    }

    e.preventDefault();

    if (!disabledTransition) {
      $currentImageCompare.style.setProperty('--gkt-image-compare__transition-duration', '0s');

      disabledTransition = true;
    }

    movePosition(e);
  })
);
