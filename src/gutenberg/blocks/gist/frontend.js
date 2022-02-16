/**
 * Block Gist
 */
const { GHOSTKIT, jQuery: $ } = window;
const $doc = $(document);

/**
 * Prepare Gists.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  if ('undefined' === typeof $.fn.gistsimple) {
    return;
  }

  GHOSTKIT.triggerEvent('beforePrepareGist', self);

  $('.ghostkit-gist:not(.ghostkit-gist-ready)').each(function () {
    const $this = $(this);
    $this.addClass('ghostkit-gist-ready');

    const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec($this.attr('data-url'));

    if (match && 'undefined' !== typeof match[1]) {
      $this.gistsimple({
        id: match[1],
        file: $this.attr('data-file'),
        caption: $this.attr('data-caption'),
        showFooter: 'true' === $this.attr('data-show-footer'),
        showLineNumbers: 'true' === $this.attr('data-show-line-numbers'),
      });
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareGist', self);
});
