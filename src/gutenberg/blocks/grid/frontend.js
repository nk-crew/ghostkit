/**
 * Block Grid
 */
const $ = window.jQuery;
const $doc = $(document);

/**
 * Prepare Grid Fallback for v2.9 and higher.
 * Since v2.9 added inner block inside main wrapper to prevent bugs in TwentyTwenty theme.
 */
$doc.on('initBlocks.ghostkit', () => {
  document
    .querySelectorAll('.ghostkit-grid > .ghostkit-col:first-child')
    .forEach(($columnFirst) => {
      const $grid = $columnFirst.parentElement;
      const $columns = $grid.querySelectorAll(':scope > .ghostkit-col');

      // Create wrapper.
      const $gridInner = document.createElement('div');
      $gridInner.classList.add('ghostkit-grid-inner');

      // Append columns to the wrapper.
      $columns.forEach(($column) => {
        $gridInner.append($column);
      });

      // Append wrapper.
      $grid.append($gridInner);
    });
});
