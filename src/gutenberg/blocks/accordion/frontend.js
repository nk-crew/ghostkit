/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';

/**
 * Block Accordion
 */
const { location, GHOSTKIT, jQuery: $ } = window;

const $doc = $(document);
const $wnd = $(window);

let pageHash = location.hash;

/**
 * Activate accordion item
 *
 * @param {jQuery} $heading - heading element
 * @param {Int} animationSpeed - animation speed
 * @param {Object} self - ghostkit class object
 */
function activateAccordionItem($heading, animationSpeed = 150, self = {}) {
  const $accordion = $heading.closest('.ghostkit-accordion');
  const $item = $heading.closest('.ghostkit-accordion-item');
  const $content = $item.find('.ghostkit-accordion-item-content');
  const isActive = $item.hasClass('ghostkit-accordion-item-active');
  const collapseOne = $accordion.hasClass('ghostkit-accordion-collapse-one');

  if (isActive) {
    $content
      .stop()
      .css('display', 'block')
      .slideUp(animationSpeed, () => {
        GHOSTKIT.triggerEvent('afterActivateAccordionItem', self, $heading);
      });
    $item.removeClass('ghostkit-accordion-item-active');
  } else {
    $content
      .stop()
      .css('display', 'none')
      .slideDown(animationSpeed, () => {
        GHOSTKIT.triggerEvent('afterActivateAccordionItem', self, $heading);
      });
    $item.addClass('ghostkit-accordion-item-active');
  }

  if (collapseOne) {
    const $collapseItems = $accordion.find('.ghostkit-accordion-item-active').not($item);
    if ($collapseItems.length) {
      $collapseItems
        .find('.ghostkit-accordion-item-content')
        .stop()
        .css('display', 'block')
        .slideUp(animationSpeed);
      $collapseItems.removeClass('ghostkit-accordion-item-active');
    }
  }

  GHOSTKIT.triggerEvent('activateAccordionItem', self, $heading);
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
        `> :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading[href="${pageHashEncoded}"]`
      );

      if ($activeAccordion.length) {
        activateAccordionItem($activeAccordion, 0, self);
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
  activateAccordionItem($(this), 150, GHOSTKIT.classObject);
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
    `.ghostkit-accordion-ready > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading[href="${pageHashEncoded}"]`
  ).each(function () {
    activateAccordionItem($(this), 150, GHOSTKIT.classObject);
  });
});
