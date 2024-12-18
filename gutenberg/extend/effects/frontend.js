import round from '../../utils/round';
import DEFAULTS from './reveal/defaults';

const {
	GHOSTKIT: { events, instance },
	Motion: { animate, spring, inView },
} = window;

const isReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;

/**
 * Effects Reveal.
 */
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('[data-gkt-effects]')
		.forEach(function ($element) {
			if (isReducedMotion) {
				$element.removeAttribute('data-gkt-effects');
				return;
			}

			const dataString = $element.getAttribute('data-gkt-effects');
			let data;

			try {
				data = JSON.parse(dataString);
			} catch (e) {
				data = false;
			}

			$element.removeAttribute('data-gkt-effects');

			if (!data) {
				return;
			}

			events.trigger($element, 'prepare.effects.gkt', { data });

			instance.set($element, 'effects', data);

			if (!data?.reveal) {
				return;
			}

			const config = {
				...DEFAULTS,
				...data.reveal,
			};

			events.trigger($element, 'prepare.effects.reveal.gkt', { config });

			const stopInView = inView($element, () => {
				$element.classList.remove('ghostkit-effects-reveal');

				const options = {};

				// Easing with Cubic Bezier.
				if (config?.transition?.type === 'easing') {
					options.type = 'tween';
					options.duration = config.transition.duration;
					options.delay = config.transition.delay;
					options.ease = config.transition.easing;

					// Easing with Spring.
				} else if (config?.transition?.type === 'spring') {
					options.type = spring;
					options.delay = config.transition.delay;
					options.stiffness = config.transition.stiffness;
					options.damping = config.transition.damping;
					options.mass = config.transition.mass;
				}

				const keyframes = {};

				if (config.opacity !== 1) {
					keyframes.opacity = [config.opacity, 1];
				}
				if (config.x !== 0) {
					keyframes.x = [config.x, 0];
				}
				if (config.y !== 0) {
					keyframes.y = [config.y, 0];
				}
				if (config.scale !== 1) {
					keyframes.scale = [config.scale, 1];
				}
				if (config.rotate !== 0) {
					keyframes.rotate = [config.rotate, 0];
				}

				const eventData = {
					config,
					keyframes,
					options,
					stopInView,
					leaveCallback: () => {},
				};

				events.trigger($element, 'show.effects.reveal.gkt', eventData);

				// Stop inView listener.
				eventData.stopInView();

				const animation = animate($element, keyframes, options);

				animation.then(() => {
					events.trigger(
						$element,
						'showed.effects.reveal.gkt',
						eventData
					);
				});

				// This will fire when the element leaves the viewport
				return eventData.leaveCallback;
			});

			events.trigger($element, 'prepared.effects.reveal.gkt', { config });
		});
});

/**
 * Counters (Number Box, Progress Bar).
 */
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('.ghostkit-count-up:not(.ghostkit-count-up-ready)')
		.forEach(($counter) => {
			$counter.classList.add('ghostkit-count-up-ready');

			if (isReducedMotion) {
				return;
			}

			const isProgress = $counter.classList.contains(
				'ghostkit-progress-bar'
			);
			const from =
				parseFloat($counter.getAttribute('data-count-from')) || 0;
			const to =
				parseFloat(
					isProgress
						? $counter.getAttribute('aria-valuenow')
						: $counter.textContent
				) || 0;
			let $progressCountBadgeWrap;
			let $progressCountBadge;
			let digits = 0;

			// prepare mask.
			let mask = '';
			if (!isProgress) {
				mask = $counter.textContent.replace(to, '${val}');
			}
			if (!/\${val}/.test(mask)) {
				mask = '${val}';
			}

			if (isProgress) {
				$progressCountBadgeWrap = $counter
					.closest('.ghostkit-progress')
					.querySelector('.ghostkit-progress-bar-count');

				if ($progressCountBadgeWrap) {
					$progressCountBadge = $progressCountBadgeWrap.querySelector(
						':scope > div > span:nth-child(2)'
					);

					$progressCountBadgeWrap.style.width = '0%';
					$progressCountBadge.textContent = '0';
				}

				$counter.style.width = '0%';
			} else {
				$counter.textContent = mask.replace('${val}', from);

				// Calculate digits after the decimal point.
				digits = Math.max(
					(`${from}`.split('.')?.[1] || '').length,
					(`${to}`.split('.')?.[1] || '').length
				);
			}

			const config = {
				from,
				to,
				duration: 1,
				easing: [0.6, 0, 0.3, 1],
				cb(progress) {
					const position = (to - from) * progress + from;

					if (isProgress) {
						if ($progressCountBadge) {
							$progressCountBadge.textContent =
								Math.ceil(position);
						}
					} else {
						$counter.textContent = mask.replace(
							'${val}',
							round(position, digits)
						);
					}
				},
			};

			events.trigger($counter, 'prepare.counter.gkt', { config });

			// Animate counter.
			const stopInView = inView(
				$counter,
				() => {
					stopInView();

					events.trigger($counter, 'count.counter.gkt', { config });

					if (isProgress) {
						[$counter, $progressCountBadgeWrap].forEach((el) => {
							if (el) {
								animate(
									el,
									{
										width: `${to}%`,
									},
									{
										duration: config.duration,
										ease: config.easing,
									}
								);
							}
						});
					}

					animate(0, 1, {
						duration: config.duration,
						ease: config.easing,
						onUpdate: (progress) => {
							config.cb(progress);
						},
					}).then(() => {
						events.trigger($counter, 'counted.counter.gkt', {
							config,
						});
					});
				},
				{ margin: '-50px' }
			);
		});
});
