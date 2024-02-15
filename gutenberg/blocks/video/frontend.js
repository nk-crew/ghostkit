/**
 * Block Video
 */

const {
	GHOSTKIT: { events },
	Motion: { animate },
} = window;

const animationDuration = 0.2;

function animationFullscreenOpen(element) {
	animate(
		element,
		{
			opacity: [0, 1],
			display: 'flex',
		},
		{
			duration: animationDuration,
			display: { duration: 0 },
		}
	);
}

/**
 * Prepare Videos.
 */
events.on(document, 'init.blocks.gkt', () => {
	if (typeof window.VideoWorker === 'undefined') {
		return;
	}

	document
		.querySelectorAll('.ghostkit-video:not(.ghostkit-video-ready)')
		.forEach(($this) => {
			$this.classList.add('ghostkit-video-ready');

			events.trigger($this, 'prepare.video.gkt');

			const url = $this.getAttribute('data-video');
			const clickAction = $this.getAttribute('data-click-action');

			const videoAutoplay =
				$this.getAttribute('data-video-autoplay') === 'true';
			const videoAutopause =
				$this.getAttribute('data-video-autopause') === 'true';
			const videoLoop = $this.getAttribute('data-video-loop') === 'true';

			const fullscreenCloseIcon =
				$this.querySelector('.ghostkit-video-fullscreen-close-icon')
					?.innerHTML || '';

			const fullscreenVideoBackgroundColor = $this.getAttribute(
				'data-fullscreen-video-background-color'
			);
			const fullscreenVideoBackgroundGradient = $this.getAttribute(
				'data-fullscreen-video-background-gradient'
			);
			const fullscreenBackgroundColor = $this.getAttribute(
				'data-fullscreen-background-color'
			);
			const fullscreenBackgroundGradient = $this.getAttribute(
				'data-fullscreen-background-gradient'
			);

			let $poster = $this.querySelector('.ghostkit-video-poster');
			let $fullscreenWrapper = false;
			let mute = 0;

			let aspectRatio = $this.getAttribute('data-video-aspect-ratio');
			const aspectRatioWidth = aspectRatio.split(':')[0];
			const aspectRatioHeight = aspectRatio.split(':')[1];
			if (aspectRatio && aspectRatioWidth && aspectRatioHeight) {
				aspectRatio = aspectRatioWidth / aspectRatioHeight;
			} else {
				aspectRatio = 16 / 9;
			}

			// Mute if volume 0.
			if (!parseFloat($this.getAttribute('data-video-volume'))) {
				mute = 1;
			}

			// Mute if autoplay.
			if (videoAutoplay) {
				mute = 1;
			}

			const options = {
				autoplay: 0,
				loop: videoLoop,
				mute,
				volume:
					parseFloat($this.getAttribute('data-video-volume')) || 0,
				showContols: 1,
			};

			events.trigger($this, 'prepare.videoWorker.gkt', { options });

			const api = new window.VideoWorker(url, options);

			events.trigger($this, 'prepared.videoWorker.gkt', { api });

			if (api && api.isValid()) {
				let loaded = 0;
				let clicked = 0;
				let isPlaying = false;

				// Add play event.
				const handlerOpen = () => {
					if (clicked) {
						return;
					}
					clicked = 1;

					// Fullscreen video.
					if (clickAction === 'fullscreen') {
						// Add loading button.
						if (!loaded) {
							$this.classList.add('ghostkit-video-loading');

							api.getVideo(($iframe) => {
								// Add iframe.
								const $parent = $iframe.parentNode;

								// Create fullscreen frame wrapper.
								const $fullscreenFrameWrapper =
									document.createElement('div');
								$fullscreenFrameWrapper.classList.add(
									'ghostkit-video-fullscreen-frame'
								);
								$fullscreenFrameWrapper.append($iframe);

								// Create close wrapper.
								const $fullscreenClose =
									document.createElement('div');
								$fullscreenClose.classList.add(
									'ghostkit-video-fullscreen-close'
								);
								$fullscreenClose.innerHTML =
									fullscreenCloseIcon;

								// Create fullscreen wrapper.
								$fullscreenWrapper =
									document.createElement('div');
								$fullscreenWrapper.classList.add(
									'ghostkit-video-fullscreen'
								);
								$fullscreenWrapper.style.backgroundColor =
									fullscreenBackgroundColor;
								$fullscreenWrapper.style.backgroundImage =
									fullscreenBackgroundGradient;
								$fullscreenWrapper.style.setProperty(
									'--gkt-fullscreen-video--video__background',
									fullscreenVideoBackgroundColor ||
										fullscreenVideoBackgroundGradient
								);
								$fullscreenWrapper.style.setProperty(
									'--gkt-fullscreen-video__aspect-ratio-width',
									aspectRatioWidth
								);
								$fullscreenWrapper.style.setProperty(
									'--gkt-fullscreen-video__aspect-ratio-height',
									aspectRatioHeight
								);

								// Add close and frame in the fullscreen wrapper.
								$fullscreenWrapper.append($fullscreenClose);
								$fullscreenWrapper.append(
									$fullscreenFrameWrapper
								);

								// Add fullscreen in the body.
								document.body.append($fullscreenWrapper);

								$parent.remove();

								animationFullscreenOpen($fullscreenWrapper);

								events.on($fullscreenWrapper, 'click', (e) => {
									const $target = e.target;

									if (
										$target.classList.contains(
											'ghostkit-video-fullscreen'
										) ||
										$target.classList.contains(
											'ghostkit-video-fullscreen-close'
										) ||
										$target.closest(
											'.ghostkit-video-fullscreen-close'
										)
									) {
										api.pause();
										$this.classList.add(
											'ghostkit-video-fullscreen-closed'
										);
										animate(
											$fullscreenWrapper,
											{
												opacity: [1, 0],
												display: 'none',
											},
											{ duration: animationDuration }
										);
									}
								});
							});

							loaded = 1;
						} else if ($fullscreenWrapper) {
							$this.classList.remove(
								'ghostkit-video-fullscreen-closed'
							);

							animationFullscreenOpen($fullscreenWrapper);
							api.play();
						}

						// Plain video.
					} else if (!loaded) {
						$this.classList.add('ghostkit-video-loading');

						api.getVideo(($iframe) => {
							const $parent = $iframe.parentNode;

							// Add iframe.
							const $wrapper = document.createElement('div');
							$wrapper.classList.add('ghostkit-video-frame');
							$wrapper.append($iframe);

							$this.append($wrapper);

							$parent.remove();
						});

						loaded = 1;
					} else {
						api.play();
					}
				};
				events.on($this, 'click', handlerOpen);

				// Set thumb.
				if (
					!$poster &&
					!$this.classList.contains('is-style-icon-only')
				) {
					api.getImageURL((imgSrc) => {
						const $image = document.createElement('img');
						$image.setAttribute('src', imgSrc);
						$image.setAttribute('alt', '');

						$poster = document.createElement('div');
						$poster.classList.add('ghostkit-video-poster');
						$poster.append($image);

						$this.append($poster);
					});
				}

				let autoplayOnce = false;

				api.on('ready', () => {
					$this.classList.remove('ghostkit-video-loading');

					if (clickAction === 'fullscreen') {
						if (
							!$this.classList.contains(
								'ghostkit-video-fullscreen-closed'
							)
						) {
							api.play();
						}
					} else {
						$this.classList.add('ghostkit-video-playing');
						api.play();
					}
				});
				api.on('play', () => {
					isPlaying = true;
				});
				api.on('pause', () => {
					isPlaying = false;
					autoplayOnce = true;
					if (clickAction === 'fullscreen') {
						clicked = 0;
					}
				});

				if (
					clickAction !== 'fullscreen' &&
					(videoAutoplay || videoAutopause)
				) {
					if (!('IntersectionObserver' in window)) {
						return;
					}

					const videoObserverData = {
						callback: (entries) => {
							entries.forEach((entry) => {
								if ($this !== entry.target) {
									return;
								}

								// Autoplay.
								if (
									!autoplayOnce &&
									!isPlaying &&
									videoAutoplay &&
									entry.isIntersecting
								) {
									if (clicked) {
										api.play();
									} else {
										$this.click();
									}
								}

								// Autopause.
								if (
									isPlaying &&
									videoAutopause &&
									!entry.isIntersecting
								) {
									api.pause();
								}
							});
						},
						options: {
							threshold: 0.6,
						},
					};

					events.trigger($this, 'prepare.videoObserver.gkt', {
						config: videoObserverData,
					});

					const videoObserver = new window.IntersectionObserver(
						videoObserverData.callback,
						videoObserverData.options
					);

					videoObserver.observe($this);
				}
			}

			events.trigger($this, 'prepared.video.gkt');
		});
});
