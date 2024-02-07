const MILLISECONDS_MULTIPLIER = 1000;

function getTransitionDurationFromElement(element) {
	if (!element) {
		return 0;
	}

	// Get transition-duration of the element
	let { transitionDuration, transitionDelay } =
		window.getComputedStyle(element);

	const floatTransitionDuration = Number.parseFloat(transitionDuration);
	const floatTransitionDelay = Number.parseFloat(transitionDelay);

	// Return 0 if element or transition duration is not found
	if (!floatTransitionDuration && !floatTransitionDelay) {
		return 0;
	}

	// If multiple durations are defined, take the first
	[transitionDuration] = transitionDuration.split(',');
	[transitionDelay] = transitionDelay.split(',');

	return (
		(Number.parseFloat(transitionDuration) +
			Number.parseFloat(transitionDelay)) *
		MILLISECONDS_MULTIPLIER
	);
}

function execute(possibleCallback, args = [], defaultValue = possibleCallback) {
	return typeof possibleCallback === 'function'
		? possibleCallback(...args)
		: defaultValue;
}

export default function transitionCallback(
	callback,
	transitionElement,
	waitForTransition = true
) {
	if (!waitForTransition) {
		execute(callback);
		return;
	}

	const durationPadding = 5;
	const emulatedDuration =
		getTransitionDurationFromElement(transitionElement) + durationPadding;

	let called = false;

	const handler = ({ target }) => {
		if (target !== transitionElement) {
			return;
		}

		called = true;
		transitionElement.removeEventListener('transitionend', handler);
		execute(callback);
	};

	transitionElement.addEventListener('transitionend', handler);
	setTimeout(() => {
		if (!called) {
			transitionElement.dispatchEvent(new Event('transitionend'));
		}
	}, emulatedDuration);
}
