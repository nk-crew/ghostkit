export default function round(num, precision = 1) {
	const modifier = 10 ** precision;
	return Math.round(num * modifier) / modifier;
}
