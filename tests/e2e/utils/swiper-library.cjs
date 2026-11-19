const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

module.exports = async function verifyLibrary(
	page,
	directory,
	globalName,
	scopeClass
) {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.setContent(
		`<div class="foreign swiper"><div class="swiper-wrapper"><div class="swiper-slide">External</div></div></div><div class="${scopeClass}" style="width:600px"><div class="foreign swiper"><div class="swiper-wrapper"><div class="swiper-slide">Nested external</div></div></div></div><div id="fixtures"></div>`
	);
	const snapshot = () =>
		Array.from(
			document.querySelectorAll(
				'.foreign, .foreign .swiper-wrapper, .foreign .swiper-slide'
			)
		).map((el) => {
			const style = getComputedStyle(el);
			return Object.fromEntries(
				Array.from(style)
					.filter((key) => !key.startsWith('--'))
					.map((key) => [key, style.getPropertyValue(key)])
			);
		});
	const before = await page.evaluate(snapshot);
	await page.evaluate(() => {
		window.Swiper = class ExternalSwiper {};
		window.externalSwiper = window.Swiper;
	});
	await page.addStyleTag({
		content: fs.readFileSync(
			path.join(directory, 'build/assets/js/swiper.css'),
			'utf8'
		),
	});
	await page.addScriptTag({
		content: fs.readFileSync(
			path.join(directory, 'build/assets/js/swiper.js'),
			'utf8'
		),
	});
	assert.deepEqual(await page.evaluate(snapshot), before);
	assert.equal(
		await page.evaluate(() => window.Swiper === window.externalSwiper),
		true
	);

	return page.evaluate(
		async ({ name, scope }) => {
			const Constructor = window[name];
			if (typeof Constructor !== 'function')
				throw new Error('Private constructor missing');
			const ensure = (condition, message) => {
				if (!condition) throw new Error(message);
			};
			function markup(count) {
				return `<div class="swiper-wrapper">${Array.from({ length: count }, (_, index) => `<div class="swiper-slide"><p>Item ${index}</p><input value="initial"><input type="file"></div>`).join('')}</div><button class="next">Next</button><button class="prev">Previous</button><div class="bullets"></div>`;
			}
			function create(count, centeredSlides) {
				const element = document.createElement('div');
				element.className = 'swiper';
				element.style.cssText = 'width:600px;height:120px';
				element.innerHTML = markup(count);
				document.querySelector('#fixtures').append(element);
				const instance = new Constructor(element, {
					loop: true,
					slidesPerView: 3,
					centeredSlides,
					speed: 0,
					navigation: {
						nextEl: element.querySelector('.next'),
						prevEl: element.querySelector('.prev'),
					},
					pagination: {
						el: element.querySelector('.bullets'),
						clickable: true,
					},
				});
				return { element, instance };
			}
			let matrix = 0;
			for (const centered of [false, true]) {
				for (const count of [1, 2, 3, 4, 5]) {
					const { element, instance } = create(count, centered);
					ensure(
						element.classList.contains(scope),
						'Missing CSS scope'
					);
					ensure(
						getComputedStyle(instance.wrapperEl).display === 'flex',
						'Private CSS did not style the wrapper'
					);
					ensure(
						instance.realIndex === 0,
						`Wrong initial index for ${count}/${centered}`
					);
					ensure(
						instance.pagination.bullets.length === count,
						'Repeated items leaked into bullet count'
					);
					const original = instance.slides.find(
						(slide) => !slide.hasAttribute('data-swiper-loop-copy')
					);
					const field = original.querySelector('input');
					field.value = 'kept';
					field.dispatchEvent(new Event('input', { bubbles: true }));
					const upload = original.querySelector('input[type="file"]');
					const transfer = new DataTransfer();
					transfer.items.add(
						new File(['sample'], 'fixture.txt', {
							type: 'text/plain',
						})
					);
					upload.files = transfer.files;
					upload.dispatchEvent(
						new Event('change', { bubbles: true })
					);
					ensure(
						instance.slides
							.filter(
								(slide) =>
									slide.getAttribute(
										'data-swiper-slide-index'
									) === '0'
							)
							.every(
								(slide) =>
									slide.querySelector('input[type="file"]')
										.files[0]?.name === 'fixture.txt'
							),
						'File input state differs across logical copies'
					);
					for (let index = 1; index <= count * 3; index += 1) {
						element.querySelector('.next').click();
						ensure(
							instance.realIndex === index % count,
							`Next index ${instance.realIndex}, expected ${index % count} for ${count}/${centered}`
						);
						ensure(
							element.querySelectorAll('.swiper-slide-active')
								.length === 1,
							'Multiple active physical slides'
						);
						ensure(
							instance.pagination.bullets.length === count,
							'Bullet count changed'
						);
					}
					ensure(
						original.querySelector('input') === field &&
							field.value === 'kept',
						'Original input lost its node or value'
					);
					ensure(
						instance.slides
							.filter(
								(slide) =>
									slide.getAttribute(
										'data-swiper-slide-index'
									) === '0'
							)
							.every(
								(slide) =>
									slide.querySelector('input').value ===
									'kept'
							),
						'Repeated input state differs'
					);
					element.querySelector('.prev').click();
					ensure(
						instance.realIndex === (count - 1) % count,
						'Previous navigation differs'
					);
					instance.destroy();
					ensure(
						element.querySelectorAll('[data-swiper-loop-copy]')
							.length === 0,
						'Copies survived destruction'
					);
					ensure(
						element.querySelectorAll('.swiper-slide').length ===
							count,
						'Original slide count changed'
					);
					element.remove();
					matrix += 1;
				}
			}
			const { element, instance } = create(3, true);
			instance.removeAllSlides();
			ensure(
				instance.realIndex === 0 &&
					instance.pagination.bullets.length === 0,
				'Empty track retained a physical loop offset'
			);
			instance.appendSlide(
				Array.from(
					{ length: 4 },
					(_, index) =>
						`<div class="swiper-slide"><p>New ${index}</p></div>`
				)
			);
			ensure(
				instance.slides.filter(
					(slide) => !slide.hasAttribute('data-swiper-loop-copy')
				).length === 4,
				'AJAX replacement lost items'
			);
			ensure(
				instance.pagination.bullets.length === 4,
				'AJAX replacement left stale bullets'
			);
			for (let index = 1; index <= 8; index += 1) {
				instance.slideNext(0);
				ensure(
					instance.realIndex === index % 4,
					`AJAX index ${instance.realIndex} at step ${index}; active ${instance.activeIndex}; data ${instance.slides.map((slide) => slide.getAttribute('data-swiper-slide-index')).join(',')}`
				);
			}
			instance.destroy();
			element.remove();
			ensure(
				window.Swiper === window.externalSwiper,
				'Private initialization replaced the shared constructor'
			);

			const motionWorld = create(3, true);
			const moving = motionWorld.instance;
			await new Promise(requestAnimationFrame);
			await new Promise(requestAnimationFrame);
			for (const direction of ['next', 'previous', 'next', 'previous']) {
				if (direction === 'next') moving.slideNext(200);
				else moving.slidePrev(200);
				getComputedStyle(moving.wrapperEl).transform;
				const transition = moving.wrapperEl
					.getAnimations()
					.find(
						(animation) =>
							animation.transitionProperty === 'transform'
					);
				ensure(
					transition,
					'Normal carousel motion did not create a transform transition'
				);
				transition.pause();
				await transition.ready;
				transition.currentTime = 100;
				const viewport = motionWorld.element.getBoundingClientRect();
				const intervals = moving.slides
					.map((slide) => slide.getBoundingClientRect())
					.filter(
						(rect) =>
							rect.right > viewport.left &&
							rect.left < viewport.right
					)
					.sort((a, b) => a.left - b.left);
				let covered = viewport.left;
				for (const interval of intervals) {
					ensure(
						interval.left <= covered + 0.75,
						'Loop left empty space during motion'
					);
					covered = Math.max(covered, interval.right);
				}
				ensure(
					covered >= viewport.right - 0.75,
					'Loop left an empty track edge'
				);
				const ended = new Promise((resolve) =>
					moving.once('transitionEnd', resolve)
				);
				transition.play();
				await ended;
				ensure(
					moving.realIndex === (direction === 'next' ? 1 : 0),
					'Normal motion selected wrong logical item'
				);
			}
			moving.destroy();
			motionWorld.element.remove();
			const paths = [[]];
			for (let depth = 1; depth <= 3; depth += 1) {
				for (const prefix of paths.filter(
					(entry) => entry.length === depth - 1
				)) {
					for (const action of [
						'next',
						'previous',
						'refresh',
						'recreate',
					])
						paths.push([...prefix, action]);
				}
			}
			for (const actions of paths) {
				const world = create(3, true);
				let current = world.instance;
				let selected = 0;
				const physicalCount = current.slides.length;
				for (const action of actions) {
					if (action === 'next') {
						current.slideNext(0);
						selected = (selected + 1) % 3;
					}
					if (action === 'previous') {
						current.slidePrev(0);
						selected = (selected + 2) % 3;
					}
					if (action === 'refresh') current.loopCreate();
					if (action === 'recreate') {
						current.destroy();
						current = new Constructor(world.element, {
							loop: true,
							slidesPerView: 3,
							centeredSlides: true,
							speed: 0,
							pagination: {
								el: world.element.querySelector('.bullets'),
								clickable: true,
							},
						});
						selected = 0;
					}
					ensure(
						current.realIndex === selected,
						'Model path ' +
							actions.join(' > ') +
							' selected wrong logical item'
					);
					ensure(
						current.pagination.bullets.length === 3,
						'Model path leaked physical copies into bullets'
					);
					ensure(
						current.slides.filter(
							(slide) =>
								!slide.hasAttribute('data-swiper-loop-copy')
						).length === 3,
						'Model path lost original nodes'
					);
					ensure(
						current.slides.length === physicalCount,
						'Model path accumulated copies'
					);
				}
				current.destroy();
				world.element.remove();
			}
			return {
				matrix,
				modelPaths: paths.length,
				motion: 'pass',
				externalStyles: 'unchanged',
				logicalBullets: 'pass',
				inputState: 'pass',
				destruction: 'pass',
				replacement: 'pass',
			};
		},
		{ name: globalName, scope: scopeClass }
	);
};
