/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';

/**
 * Block Tabs
 */
const { location, GHOSTKIT, jQuery: $ } = window;

const $doc = $(document);
const $wnd = $(window);

let pageHash = location.hash;

/**
 * Activate tab
 *
 * @param {jQuery} $tabs - tabs block element
 * @param {String} tabName - tab name
 * @param {Object} self - ghostkit class object
 *
 * @return {Boolean} is tab activated.
 */
function activateTab($tabs, tabName, self) {
  const isLegacy = !/^#/g.test(tabName);
  let $activeBtn = false;
  const tabNameEncoded = maybeDecode(tabName);
  const $activeTab = $tabs
    .children('.ghostkit-tabs-content')
    .children(`[data-tab="${tabNameEncoded.replace(/^#/, '')}"]`);

  if (isLegacy) {
    $activeBtn = $tabs.find('.ghostkit-tabs-buttons').find(`[href="#tab-${tabNameEncoded}"]`);
  } else {
    $activeBtn = $tabs.find('.ghostkit-tabs-buttons').find(`[href="${tabNameEncoded}"]`);
  }

  if (!$activeBtn || !$activeBtn.length || !$activeTab.length) {
    return false;
  }

  $activeBtn
    .addClass('ghostkit-tabs-buttons-item-active')
    .siblings()
    .removeClass('ghostkit-tabs-buttons-item-active');

  $activeTab.addClass('ghostkit-tab-active').siblings().removeClass('ghostkit-tab-active');

  GHOSTKIT.triggerEvent('activateTab', self, $tabs, tabNameEncoded);

  return true;
}

/**
 * Prepare Tabs.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  GHOSTKIT.triggerEvent('beforePrepareTabs', self);

  $('.ghostkit-tabs:not(.ghostkit-tabs-ready)').each(function () {
    const $this = $(this);
    const tabsActive = $this.attr('data-tab-active');

    $this.addClass('ghostkit-tabs-ready');

    // activate by page hash
    let tabActivated = false;
    if (pageHash) {
      tabActivated = activateTab($this, pageHash, self);
    }

    if (!tabActivated && tabsActive) {
      tabActivated = activateTab($this, `#${tabsActive}`, self);
    }

    // legacy
    if (!tabActivated && tabsActive) {
      tabActivated = activateTab($this, tabsActive, self);
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareTabs', self);
});

/**
 * Click Tabs.
 */
$doc.on('click', '.ghostkit-tabs-buttons-item', function (evt) {
  evt.preventDefault();

  const $thisBtn = $(this);
  const $tab = $thisBtn.closest('.ghostkit-tabs');
  const tabName = $thisBtn.attr('data-tab') || this.hash;

  activateTab($tab, tabName, GHOSTKIT.classObject);
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

  // Activate tab.
  $('.ghostkit-tabs-ready').each(function () {
    activateTab($(this), pageHash, GHOSTKIT.classObject);
  });
});
