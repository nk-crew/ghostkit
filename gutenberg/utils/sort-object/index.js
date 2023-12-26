export default function sortObject(object) {
	return Object.keys(object)
		.sort()
		.reduce((obj, key) => {
			obj[key] = object[key];
			return obj;
		}, {});
}
