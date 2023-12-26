/**
 * Block Changelog
 */
const {
	GHOSTKIT: { events },
} = window;

/**
 * Prepare Changelogs.
 */
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('.ghostkit-changelog:not(.ghostkit-changelog-ready)')
		.forEach(($this) => {
			events.trigger($this, 'prepare.changelog.gkt');

			$this.classList.add('ghostkit-changelog-ready');

			// Add badges.
			$this
				.querySelector(':scope > .ghostkit-changelog-more')
				.querySelectorAll(':scope > ul li, :scope > ol li')
				.forEach(($li) => {
					const text = $li.innerHTML.trim();
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

						$li.innerHTML = `<span class="${className}">${changeType}</span> ${changeDescription}`;
					}
				});

			events.trigger($this, 'prepared.changelog.gkt');
		});
});
