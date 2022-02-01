/**
 * Block Changelog
 */
const { GHOSTKIT, jQuery: $ } = window;
const $doc = $(document);

/**
 * Prepare Changelogs.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  GHOSTKIT.triggerEvent('beforePrepareChangelog', self);

  $('.ghostkit-changelog:not(.ghostkit-changelog-ready)').each(function () {
    const $this = $(this);
    $this.addClass('ghostkit-changelog-ready');

    // add badges.
    $this
      .children('.ghostkit-changelog-more')
      .find('> ul li, > ol li')
      .each(function () {
        const $li = $(this);
        const text = $.trim($li.html());
        const typeMatches = text.match(
          /^\[(new|added|fixed|improved|updated|removed|changed)\]\s(.*)/i
        );

        if (typeMatches) {
          const changeType = typeMatches[1];
          const changeDescription = typeMatches[2];

          let className = 'ghostkit-badge';

          switch (changeType.toLowerCase()) {
            case 'added':
            case 'new':
              className += ' ghostkit-badge-success';
              break;
            case 'fixed':
            case 'improved':
            case 'updated':
              className += ' ghostkit-badge-primary';
              break;
            case 'removed':
              className += ' ghostkit-badge-danger';
              break;
            // no default
          }

          $li.html(`<span class="${className}">${changeType}</span> ${changeDescription}`);
        }
      });
  });

  GHOSTKIT.triggerEvent('afterPrepareChangelog', self);
});
