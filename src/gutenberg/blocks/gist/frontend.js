/**
 * Block Gist
 */
const { GHOSTKIT, jQuery: $, gistSimple } = window;
const $doc = $(document);

/**
 * Prepare Gists.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  if (typeof gistSimple === 'undefined') {
    return;
  }

  GHOSTKIT.triggerEvent('beforePrepareGist', self);

  document.querySelectorAll('.ghostkit-gist:not(.ghostkit-gist-ready)').forEach(($this) => {
    $this.classList.add('ghostkit-gist-ready');

    const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec($this.getAttribute('data-url'));

    if (match && typeof match[1] !== 'undefined') {
      gistSimple($this, {
        id: match[1],
        file: $this.getAttribute('data-file'),
        caption: $this.getAttribute('data-caption'),
        showFooter: $this.getAttribute('data-show-footer') === 'true',
        showLineNumbers: $this.getAttribute('data-show-line-numbers') === 'true',
      });
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareGist', self);
});
