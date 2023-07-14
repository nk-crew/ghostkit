/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';
import addEventListener from '../../utils/add-event-listener';
import getSiblings from '../../utils/get-siblings';

/**
 * Block Accordion
 */
const {
  location,
  GHOSTKIT,
  jQuery: $,
  Motion: { animate },
  requestAnimationFrame,
} = window;

const $doc = $(document);

let pageHash = location.hash;

const ANIMATION_SPEED = 300;

function expand($item, animationSpeed, cb) {
  const $content = $item.querySelector('.ghostkit-accordion-item-content');

  $item.classList.add('ghostkit-accordion-item-active');

  const contentStyles = getComputedStyle($content);

  const endHeight = contentStyles.height;
  const endPaddingTop = contentStyles.paddingTop;
  const endPaddingBottom = contentStyles.paddingBottom;

  $content.style.display = 'block';
  $content.style.overflow = 'hidden';

  const animation = animate(
    $content,
    {
      height: ['0px', endHeight],
      paddingTop: ['0px', endPaddingTop],
      paddingBottom: ['0px', endPaddingBottom],
    },
    {
      duration: animationSpeed / 1000,
      easing: 'ease-out',
    }
  );

  animation.finished.then(() => {
    // Reset styles.
    $content.style.display = '';
    $content.style.overflow = '';
    $content.style.height = '';
    $content.style.paddingTop = '';
    $content.style.paddingBottom = '';
    $item.gktAccordion.animation = null;

    cb();
  });

  $item.gktAccordion.animation = animation;
}

function shrink($item, animationSpeed, cb) {
  const $content = $item.querySelector('.ghostkit-accordion-item-content');

  const contentStyles = getComputedStyle($content);

  const startPaddingTop = contentStyles.paddingTop;
  const startPaddingBottom = contentStyles.paddingBottom;
  const startHeight = contentStyles.height;

  $content.style.display = 'block';
  $content.style.overflow = 'hidden';

  const animation = animate(
    $content,
    {
      height: [startHeight, '0px'],
      paddingTop: [startPaddingTop, '0px'],
      paddingBottom: [startPaddingBottom, '0px'],
    },
    {
      duration: animationSpeed / 1000,
      easing: 'ease-out',
    }
  );

  animation.finished.then(() => {
    // Reset styles.
    $content.style.display = '';
    $content.style.overflow = '';
    $content.style.height = '';
    $content.style.paddingTop = '';
    $content.style.paddingBottom = '';
    $item.gktAccordion.animation = null;

    cb();
  });

  $item.gktAccordion.animation = animation;

  $item.classList.remove('ghostkit-accordion-item-active');
}

/**
 * Toggle accordion item
 *
 * @param {Element} $heading - heading element
 * @param {Int} animationSpeed - animation speed
 * @param {Object} self - ghostkit class object
 * @param {Boolean} skipCollapse - skip collapse other items
 */
function toggleAccordionItem(
  $heading,
  animationSpeed = ANIMATION_SPEED,
  self = {},
  skipCollapse = false
) {
  const $accordion = $heading.closest('.ghostkit-accordion');
  const $item = $heading.closest('.ghostkit-accordion-item');
  const isActive = $item.classList.contains('ghostkit-accordion-item-active');
  const collapseOne =
    !skipCollapse && $accordion.classList.contains('ghostkit-accordion-collapse-one');

  if (!$item?.gktAccordion) {
    $item.gktAccordion = {
      animation: null,
    };
  }

  if ($item.gktAccordion.animation) {
    $item.gktAccordion.animation.stop();
  }

  // Wait for the next frame to call this code after animation stopped.
  requestAnimationFrame(() => {
    if (isActive) {
      shrink($item, animationSpeed, () => {
        GHOSTKIT.triggerEvent('afterActivateAccordionItem', self, $heading);
      });
    } else {
      expand($item, animationSpeed, () => {
        GHOSTKIT.triggerEvent('afterActivateAccordionItem', self, $heading);
      });
    }

    // Shrink all other elements
    if (collapseOne && !isActive) {
      getSiblings($item).forEach(($this) => {
        if ($this.classList.contains('ghostkit-accordion-item-active')) {
          toggleAccordionItem($this, animationSpeed, self, true);
        }
      });
    }

    GHOSTKIT.triggerEvent('toggleAccordionItem', self, $heading);

    // Deprecated event.
    GHOSTKIT.triggerEvent('activateAccordionItem', self, $heading);
  });
}

/**
 * Prepare Accordions.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  GHOSTKIT.triggerEvent('beforePrepareAccordions', self);

  document
    .querySelectorAll('.ghostkit-accordion:not(.ghostkit-accordion-ready)')
    .forEach(($this) => {
      $this.classList.add('ghostkit-accordion-ready');

      // activate by page hash
      if (pageHash) {
        const pageHashEncoded = maybeDecode(pageHash);
        const $activeAccordion = $this.querySelector(
          `:scope > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="${pageHashEncoded}"]`
        );

        if ($activeAccordion) {
          toggleAccordionItem($activeAccordion, 0, self);
        }
      }
    });

  GHOSTKIT.triggerEvent('afterPrepareAccordions', self);
});

/**
 * Click Accordions.
 */
addEventListener(
  document,
  'click',
  function (evt) {
    evt.preventDefault();
    toggleAccordionItem(this, ANIMATION_SPEED, GHOSTKIT.classObject);
  },
  '.ghostkit-accordion-item .ghostkit-accordion-item-heading'
);

/*
 * Activate item on hash change.
 */
const handlerActivateItem = () => {
  if (window.location.hash === pageHash) {
    return;
  }

  pageHash = window.location.hash;

  if (!pageHash) {
    return;
  }

  const pageHashEncoded = maybeDecode(pageHash);

  // Activate accordion item.
  document
    .querySelectorAll(
      `.ghostkit-accordion-ready > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="${pageHashEncoded}"]`
    )
    .forEach(($this) => {
      toggleAccordionItem($this, ANIMATION_SPEED, GHOSTKIT.classObject);
    });
};

window.addEventListener('hashchange', handlerActivateItem);
