/**
 * Block Gist
 */
const {
	GHOSTKIT: { events },
} = window;

/**
 * Prepare Gists.
 */
events.on(document, 'init.blocks.gkt', () => {
	const gistSimple = window.gistSimple;

	if (typeof gistSimple === 'undefined') {
		return;
	}

	document
		.querySelectorAll('.ghostkit-gist:not(.ghostkit-gist-ready)')
		.forEach(($this) => {
			$this.classList.add('ghostkit-gist-ready');

			const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec(
				$this.getAttribute('data-url')
			);

			if (match && typeof match[1] !== 'undefined') {
				const options = {
					id: match[1],
					file: $this.getAttribute('data-file'),
					caption: $this.getAttribute('data-caption'),
					showFooter:
						$this.getAttribute('data-show-footer') === 'true',
					showLineNumbers:
						$this.getAttribute('data-show-line-numbers') === 'true',
				};

				events.trigger($this, 'prepare.gist.gkt', { options });

				gistSimple($this, options);

				events.trigger($this, 'prepared.gist.gkt', { options });
			}
		});
});
