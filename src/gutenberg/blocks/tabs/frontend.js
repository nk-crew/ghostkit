/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';
import siblings from '../../utils/siblings';

/**
 * Block Tabs
 */
const { location, GHOSTKIT, jQuery: $ } = window;

const $doc = $(document);

let pageHash = location.hash;

/**
 * Activate tab
 *
 * @param {Element} $tabs - tabs block element
 * @param {String} tabName - tab name
 * @param {Object} self - ghostkit class object
 *
 * @return {Boolean} is tab activated.
 */
function activateTab($tabs, tabName, self) {
  const isLegacy = !/^#/g.test(tabName);
  let $activeBtn = false;
  const tabNameEncoded = maybeDecode(tabName);
  const $activeTab = $tabs.querySelector(
    `:scope > .ghostkit-tabs-content > [data-tab="${tabNameEncoded.replace(/^#/, '')}"]`
  );

  if (isLegacy) {
    $activeBtn = $tabs.querySelector(
      `:scope > .ghostkit-tabs-buttons > [href="#tab-${tabNameEncoded}"]`
    );
  } else {
    $activeBtn = $tabs.querySelector(
      `:scope > .ghostkit-tabs-buttons > [href="${tabNameEncoded}"]`
    );
  }

  if (!$activeBtn || !$activeTab) {
    return false;
  }

  $activeBtn.classList.add('ghostkit-tabs-buttons-item-active');
  siblings($activeBtn).forEach(($this) => {
    if ($this.classList.contains('ghostkit-tabs-buttons-item-active')) {
      $this.classList.remove('ghostkit-tabs-buttons-item-active');
    }
  });

  $activeTab.classList.add('ghostkit-tab-active');
  siblings($activeTab).forEach(($this) => {
    if ($this.classList.contains('ghostkit-tab-active')) {
      $this.classList.remove('ghostkit-tab-active');
    }
  });

  GHOSTKIT.triggerEvent('activateTab', self, $tabs, tabNameEncoded);

  return true;
}

/**
 * Prepare Tabs.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  GHOSTKIT.triggerEvent('beforePrepareTabs', self);

  document.querySelectorAll('.ghostkit-tabs:not(.ghostkit-tabs-ready)').forEach(($this) => {
    const tabsActive = $this.getAttribute('data-tab-active');

    $this.classList.add('ghostkit-tabs-ready');

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
document.querySelectorAll('.ghostkit-tabs-buttons-item').forEach(($this) => {
  const handler = (evt) => {
    evt.preventDefault();

    const $tab = $this.closest('.ghostkit-tabs');
    const tabName = $this.getAttribute('data-tab') || $this.hash;

    activateTab($tab, tabName, GHOSTKIT.classObject);
  };

  $this.addEventListener('click', handler);
});

/**
 * Hover Tabs.
 */
document
  .querySelectorAll(
    '.ghostkit-tabs-buttons-trigger-hover > .ghostkit-tabs-buttons .ghostkit-tabs-buttons-item'
  )
  .forEach(($this) => {
    const handler = () => {
      const $tab = $this.closest('.ghostkit-tabs');
      const tabName = $this.getAttribute('data-tab') || $this.hash;

      activateTab($tab, tabName, GHOSTKIT.classObject);
    };

    $this.addEventListener('mouseenter', handler);
  });

/*
 * Activate tab on hash change.
 */
const handlerHashChange = () => {
  if (window.location.hash === pageHash) {
    return;
  }

  pageHash = window.location.hash;

  if (!pageHash) {
    return;
  }

  // Activate tab.
  document.querySelectorAll('.ghostkit-tabs-ready').forEach(($this) => {
    activateTab($this, pageHash, GHOSTKIT.classObject);
  });
};
window.addEventListener('hashchange', handlerHashChange);
