function syncChildren(source, target) {
	for (const attribute of Array.from(target.attributes)) {
		if (!source.hasAttribute(attribute.name))
			target.removeAttribute(attribute.name);
	}
	for (const attribute of Array.from(source.attributes)) {
		if (target.getAttribute(attribute.name) !== attribute.value)
			target.setAttribute(attribute.name, attribute.value);
	}
	const fileInput = source.nodeName === 'INPUT' && source.type === 'file';
	if (fileInput) target.files = source.files;
	for (const property of ['value', 'checked', 'selectedIndex']) {
		if (
			!(fileInput && property === 'value') &&
			property in source &&
			property in target &&
			target[property] !== source[property]
		)
			target[property] = source[property];
	}
	syncContent(source, target);
}

function syncContent(source, target) {
	Array.from(source.childNodes).forEach((child, index) => {
		const current = target.childNodes[index];
		if (
			!current ||
			current.nodeType !== child.nodeType ||
			current.nodeName !== child.nodeName
		) {
			const copy = child.cloneNode(true);
			if (child.nodeType === 1) syncChildren(child, copy);
			if (current) target.replaceChild(copy, current);
			else target.append(copy);
		} else if (child.nodeType === 1) syncChildren(child, current);
		else if (current.nodeValue !== child.nodeValue)
			current.nodeValue = child.nodeValue;
	});
	while (target.childNodes.length > source.childNodes.length)
		target.lastChild.remove();
}

// Swiper needs spare DOM slides for loop. Remove when upstream supports undersized galleries.
export default function repeatingLoop(scopeClass) {
	return ({ swiper, on }) => {
		let count = 0;
		const copyAttribute = 'data-swiper-loop-copy';
		const slides = () =>
			Array.from(swiper.slidesEl.children).filter((el) =>
				el.classList.contains(swiper.params.slideClass)
			);
		const sync = (element) => {
			let slide = element.closest(`.${swiper.params.slideClass}`);
			while (slide && slide.parentElement !== swiper.slidesEl)
				slide = slide.parentElement.closest(
					`.${swiper.params.slideClass}`
				);
			if (!slide) return;
			const index = slide.getAttribute('data-swiper-slide-index');
			for (const sibling of slides()) {
				if (
					sibling === slide ||
					sibling.getAttribute('data-swiper-slide-index') !== index
				)
					continue;
				syncContent(slide, sibling);
			}
		};
		const syncInput = (event) => sync(event.target);
		on('beforeInit', () => {
			swiper.el.classList.add(scopeClass);
			if (!swiper.params.loop) return;
			const nativeDestroy = swiper.loopDestroy;
			count = slides().length;
			const renderBullet = swiper.params.pagination?.renderBullet;
			if (swiper.params.pagination) {
				const render = function (index, className) {
					if (index >= count) return '';
					return renderBullet
						? renderBullet.call(this, index, className)
						: `<span class="${className}"></span>`;
				};
				swiper.params.pagination.renderBullet = render;
				swiper.originalParams.pagination.renderBullet = render;
			}
			const slideLabel = swiper.params.a11y?.slideLabelMessage;
			swiper.loopCreate = function (slideRealIndex, initial) {
				if (slides().some((slide) => slide.hasAttribute(copyAttribute)))
					this.loopDestroy();
				const selected = slideRealIndex ?? this.realIndex;
				const originals = slides().filter(
					(el) => !el.hasAttribute(copyAttribute)
				);
				count = originals.length;
				if (!count) return;
				const view =
					this.params.slidesPerView === 'auto'
						? Math.max(count, this.slidesPerViewDynamic())
						: Math.ceil(Number(this.params.slidesPerView));
				const group = this.params.slidesPerGroup || 1;
				const minimum =
					2 * view + 2 + 2 * this.params.loopAdditionalSlides;
				originals.forEach((slide, index) => {
					slide.setAttribute('data-swiper-slide-index', index);
				});
				let physical = count;
				while (physical < minimum || physical % group) {
					originals.forEach((slide, index) => {
						const copy = slide.cloneNode(true);
						copy.setAttribute(copyAttribute, '');
						copy.classList.add('swiper-slide-duplicate');
						copy.setAttribute('data-swiper-slide-index', index);
						syncContent(slide, copy);
						this.slidesEl.append(copy);
					});
					physical += count;
				}
				if (slideLabel)
					this.params.a11y.slideLabelMessage = slideLabel.replaceAll(
						'{{slidesLength}}',
						String(count)
					);
				this.recalcSlides();
				this.updateSlides();
				this.slideTo(
					Math.max(0, Math.min(selected, count - 1)),
					0,
					false,
					true
				);
				this.loopFix({
					slideRealIndex,
					initial,
					direction: this.params.centeredSlides ? undefined : 'next',
				});
				this.slideTo(this.activeIndex, 0, false, true);
			};
			swiper.loopDestroy = function () {
				slides()
					.filter((el) => el.hasAttribute(copyAttribute))
					.forEach((el) => {
						el.remove();
					});
				nativeDestroy.call(this);
			};
			swiper.removeAllSlides = function () {
				this.loopDestroy();
				for (const slide of slides()) slide.remove();
				count = 0;
				this.recalcSlides();
				this.updateActiveIndex(0);
				this.update();
				this.updateSlidesClasses();
			};
			swiper.el.addEventListener('input', syncInput);
			swiper.el.addEventListener('change', syncInput);
		});
		on('_loopContentChanged', (_instance, element) => sync(element));
		on('beforeDestroy', () => {
			swiper.el.classList.remove(scopeClass);
			swiper.el.removeEventListener('input', syncInput);
			swiper.el.removeEventListener('change', syncInput);
		});
	};
}
