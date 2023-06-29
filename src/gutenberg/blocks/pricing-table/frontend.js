/**
 * Block Pricing Table
 */
const $ = window.jQuery;
const $doc = $(document);

/**
 * Prepare Pricing Table Fallback for v2.9 and higher.
 * Since v2.9 added inner block inside main wrapper to prevent bugs in TwentyTwenty theme.
 */
$doc.on('initBlocks.ghostkit', () => {
  document
    .querySelectorAll('.ghostkit-pricing-table > .ghostkit-pricing-table-item-wrap:first-child')
    .forEach(($pricingFirst) => {
      const $wrap = $pricingFirst.parentElement;
      const $items = $wrap.querySelectorAll(':scope > .ghostkit-pricing-table-item-wrap');

      // Create wrapper.
      const $wrapInner = document.createElement('div');
      $wrapInner.classList.add('ghostkit-pricing-table-inner');

      // Append buttons to the wrapper.
      $items.forEach(($button) => {
        $wrapInner.append($button);
      });

      // Append wrapper.
      $wrap.append($wrapInner);
    });
});
