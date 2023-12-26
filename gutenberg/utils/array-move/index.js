/**
 * Move array element from one index to another.
 *
 * @param {Array} arr       - array.
 * @param {Int}   fromIndex - from index.
 * @param {Int}   toIndex   - to index.
 *
 * @return {Array}
 */
export default function arrayMove(arr, fromIndex, toIndex) {
	const element = arr[fromIndex];

	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);

	return arr;
}
