import qs from 'qs';

export default function prepareQuery(data) {
	/**
	 * We should encode it, because request may not work correctly with special characters.
	 * For example there was a problem with `#` character in the heading text.
	 *
	 * @link https://github.com/nk-crew/ghostkit/issues/162
	 */
	const additionalData = qs.stringify(data, { encode: true });
	const query = `/ghostkit/v1/get_table_of_contents/${
		additionalData ? `?${additionalData}` : ''
	}`;

	return query;
}
