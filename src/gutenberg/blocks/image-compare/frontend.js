/**
 * Block Image Compare
 */
const {
  GHOSTKIT: { events },
} = window;

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

    events.trigger($currentImageCompare, 'move.imageCompare.gkt', { originalEvent: e });
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
events.on(
  document,
  'mousedown',
  '.ghostkit-image-compare:not(.ghostkit-image-compare-trigger-hover)',
  (e) => {
    e.preventDefault();

    init(e.delegateTarget);
  }
);

// Trigger - Hover.
events.on(document, 'mouseover', '.ghostkit-image-compare-trigger-hover', (e) => {
  if ($currentImageCompare) {
    return;
  }

  e.preventDefault();

  init(e.delegateTarget);
});
events.on(document, 'mouseout', '.ghostkit-image-compare-trigger-hover', (e) => {
  if (!$currentImageCompare) {
    return;
  }

  destroy(e);
});

events.on(document, 'mouseup', (e) => {
  if (!$currentImageCompare) {
    return;
  }

  destroy(e);
});

events.on(document, 'mousemove', (e) => {
  if (!$currentImageCompare) {
    return;
  }

  e.preventDefault();

  if (!disabledTransition) {
    $currentImageCompare.style.setProperty('--gkt-image-compare__transition-duration', '0s');

    disabledTransition = true;
  }

  movePosition(e);
});
