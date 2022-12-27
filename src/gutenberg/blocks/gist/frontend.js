/**
 * Block Gist
 */
const { GHOSTKIT, jQuery: $ } = window;
const $doc = $(document);

/**
 * Prepare Gists.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  if (typeof $.fn.gistsimple === 'undefined') {
    return;
  }

  GHOSTKIT.triggerEvent('beforePrepareGist', self);

  $('.ghostkit-gist:not(.ghostkit-gist-ready)').each(function () {
    const $this = $(this);
    $this.addClass('ghostkit-gist-ready');

    const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec($this.attr('data-url'));

    if (match && typeof match[1] !== 'undefined') {
      $this.gistsimple({
        id: match[1],
        file: $this.attr('data-file'),
        caption: $this.attr('data-caption'),
        showFooter: $this.attr('data-show-footer') === 'true',
        showLineNumbers: $this.attr('data-show-line-numbers') === 'true',
      });
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareGist', self);
});
