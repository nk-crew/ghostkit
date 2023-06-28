/**
 * Block Button
 */
const $ = window.jQuery;
const $doc = $(document);

/**
 * Prepare Button Fallback for v2.9 and higher.
 * Since v2.9 added inner block inside main wrapper to prevent bugs in TwentyTwenty theme.
 */
$doc.on('initBlocks.ghostkit', () => {
  document
    .querySelectorAll('.ghostkit-button-wrapper > .ghostkit-button:first-child')
    .forEach(($buttonFirst) => {
      const $wrap = $buttonFirst.parentElement;
      const $buttons = $wrap.querySelectorAll(':scope > .ghostkit-button');

      // Create wrapper.
      const $wrapInner = document.createElement('div');
      $wrapInner.classList.add('ghostkit-button-wrapper-inner');

      // Append buttons to the wrapper.
      $buttons.forEach(($button) => {
        $wrapInner.append($button);
      });

      // Append wrapper.
      $wrap.append($wrapInner);
    });
});
