/**
 * Block Image Compare
 */
const {
	GHOSTKIT: { events },
} = window;

let $currentImageCompare = false;
let $currentImageCompareWrapper = false;
let blockOrientation = '';
let disabledTransition = false;
let clientX = 0;
let clientY = 0;

function movePosition() {
	if ($currentImageCompare && $currentImageCompareWrapper) {
		const rect = $currentImageCompareWrapper.getBoundingClientRect();

		let move = 0;

		if (blockOrientation === 'vertical') {
			move = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
		} else {
			move = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		}

		const result = Math.round(10000 * move) / 100;

		$currentImageCompare.style.setProperty(
			'--gkt-image-compare__position',
			`${result}%`
		);

		events.trigger($currentImageCompare, 'move.imageCompare.gkt', {
			originalEvent: { clientX, clientY },
		});
	}
}

function init($block) {
	$currentImageCompare = $block;
	$currentImageCompareWrapper = $block.querySelector(
		'.ghostkit-image-compare-images'
	);

	blockOrientation = $block.classList.contains(
		'ghostkit-image-compare-vertical'
	)
		? 'vertical'
		: 'horizontal';
}

function destroy() {
	movePosition();

	$currentImageCompare.style.removeProperty(
		'--gkt-image-compare__transition-duration'
	);

	$currentImageCompare = false;
	$currentImageCompareWrapper = false;
	disabledTransition = false;
}

// Trigger - Click.
events.on(
	document,
	'mousedown touchstart',
	'.ghostkit-image-compare:not(.ghostkit-image-compare-trigger-hover)',
	(e) => {
		if (
			e.targetTouches &&
			!e.target.classList.contains(
				'ghostkit-image-compare-images-divider'
			)
		) {
			return;
		}
		if (!e.targetTouches) {
			e.preventDefault();
		}

		init(e.delegateTarget);
	}
);

// Trigger - Hover.
events.on(
	document,
	'mouseover touchstart',
	'.ghostkit-image-compare-trigger-hover',
	(e) => {
		if ($currentImageCompare) {
			return;
		}
		if (
			e.targetTouches &&
			!e.target.classList.contains(
				'ghostkit-image-compare-images-divider'
			)
		) {
			return;
		}
		if (!e.targetTouches) {
			e.preventDefault();
		}

		init(e.delegateTarget);
	}
);
events.on(
	document,
	'mouseout touchend',
	'.ghostkit-image-compare-trigger-hover',
	(e) => {
		if (!$currentImageCompare) {
			return;
		}

		if (!e.targetTouches) {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		destroy();
	}
);

events.on(document, 'mouseup touchend', (e) => {
	if (!$currentImageCompare) {
		return;
	}

	if (!e.targetTouches) {
		clientX = e.clientX;
		clientY = e.clientY;
	}

	destroy();
});

events.on(document, 'mousemove touchmove', (e) => {
	if (!$currentImageCompare) {
		return;
	}
	if (!e.targetTouches) {
		e.preventDefault();
	}

	clientX = e.targetTouches?.[0].clientX || e.clientX;
	clientY = e.targetTouches?.[0].clientY || e.clientY;

	if (!disabledTransition) {
		$currentImageCompare.style.setProperty(
			'--gkt-image-compare__transition-duration',
			'0s'
		);

		disabledTransition = true;
	}

	movePosition();
});

// Disable scroll mobile when touching the block.
window.addEventListener(
	'touchstart',
	function (e) {
		if (!$currentImageCompare) {
			return;
		}
		if (
			!e.target.classList.contains(
				'ghostkit-image-compare-images-divider'
			)
		) {
			return;
		}

		e.preventDefault();
	},
	{ passive: false }
);
