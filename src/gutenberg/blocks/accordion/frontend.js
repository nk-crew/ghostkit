/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';

/**
 * Block Accordion
 */
const { location, GHOSTKIT, jQuery: $, Motion, requestAnimationFrame } = window;

const { animate } = Motion;

const $doc = $(document);
const $wnd = $(window);

let pageHash = location.hash;

const ANIMATION_SPEED = 300;

function expand($item, animationSpeed, cb) {
  const $content = $item.find('.ghostkit-accordion-item-content');

  $item.addClass('ghostkit-accordion-item-active');

  const contentStyles = window.getComputedStyle($content[0]);

  const endHeight = contentStyles.height;
  const endPaddingTop = contentStyles.paddingTop;
  const endPaddingBottom = contentStyles.paddingBottom;

  $content[0].style.display = 'block';
  $content[0].style.overflow = 'hidden';

  const animation = animate(
    $content[0],
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
    $content[0].style.display = '';
    $content[0].style.overflow = '';
    $content[0].style.height = '';
    $content[0].style.paddingTop = '';
    $content[0].style.paddingBottom = '';
    $item[0].gktAccordion.animation = null;

    cb();
  });

  $item[0].gktAccordion.animation = animation;
}

function shrink($item, animationSpeed, cb) {
  const $content = $item.find('.ghostkit-accordion-item-content');

  const contentStyles = window.getComputedStyle($content[0]);

  const startPaddingTop = contentStyles.paddingTop;
  const startPaddingBottom = contentStyles.paddingBottom;
  const startHeight = contentStyles.height;

  $content[0].style.display = 'block';
  $content[0].style.overflow = 'hidden';

  const animation = animate(
    $content[0],
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
    $content[0].style.display = '';
    $content[0].style.overflow = '';
    $content[0].style.height = '';
    $content[0].style.paddingTop = '';
    $content[0].style.paddingBottom = '';
    $item[0].gktAccordion.animation = null;

    cb();
  });

  $item[0].gktAccordion.animation = animation;

  $item.removeClass('ghostkit-accordion-item-active');
}

/**
 * Toggle accordion item
 *
 * @param {jQuery} $heading - heading element
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
  const isActive = $item.hasClass('ghostkit-accordion-item-active');
  const collapseOne = !skipCollapse && $accordion.hasClass('ghostkit-accordion-collapse-one');

  if (!$item[0]?.gktAccordion) {
    $item[0].gktAccordion = {
      animation: null,
    };
  }

  if ($item[0].gktAccordion.animation) {
    $item[0].gktAccordion.animation.stop();
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
      const $collapseItems = $accordion.find('.ghostkit-accordion-item-active').not($item);

      $collapseItems.each(function () {
        toggleAccordionItem($(this), animationSpeed, self, true);
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

  $('.ghostkit-accordion:not(.ghostkit-accordion-ready)').each(function () {
    const $this = $(this);

    $this.addClass('ghostkit-accordion-ready');

    // activate by page hash
    if (pageHash) {
      const pageHashEncoded = maybeDecode(pageHash);
      const $activeAccordion = $this.find(
        `> :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="${pageHashEncoded}"]`
      );

      if ($activeAccordion.length) {
        toggleAccordionItem($activeAccordion, 0, self);
      }
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareAccordions', self);
});

/**
 * Click Accordions.
 */
$doc.on('click', '.ghostkit-accordion-item .ghostkit-accordion-item-heading', function (evt) {
  evt.preventDefault();
  toggleAccordionItem($(this), ANIMATION_SPEED, GHOSTKIT.classObject);
});

/*
 * Activate tab on hash change.
 */
$wnd.on('hashchange', () => {
  if (window.location.hash === pageHash) {
    return;
  }

  pageHash = window.location.hash;

  if (!pageHash) {
    return;
  }

  const pageHashEncoded = maybeDecode(pageHash);

  // Activate accordion item.
  $(
    `.ghostkit-accordion-ready > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading >[href="${pageHashEncoded}"]`
  ).each(function () {
    toggleAccordionItem($(this), ANIMATION_SPEED, GHOSTKIT.classObject);
  });
});
