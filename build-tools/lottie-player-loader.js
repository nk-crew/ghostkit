const engineStart = 'var lottie$1={exports:{}};';
const engineEnd = 'var lottie=lottie$1.exports,';

module.exports = function loadLottiePlayer(source) {
	const start = source.indexOf(engineStart);
	const end = source.indexOf(engineEnd);

	if (
		start === -1 ||
		end <= start ||
		start !== source.lastIndexOf(engineStart) ||
		end !== source.lastIndexOf(engineEnd)
	) {
		throw new Error('The Lottie Player bundle has an unexpected layout.');
	}

	// LottieFiles ships a prebundled engine, so a module alias cannot replace it.
	return [
		"import ghostkitLottie from 'lottie-web/player/js/modules/svg.js';",
		source.slice(0, start),
		'var lottie$1={exports:ghostkitLottie};',
		source.slice(end),
	].join('');
};
