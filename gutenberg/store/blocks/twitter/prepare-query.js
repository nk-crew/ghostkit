import qs from 'qs';

export default function prepareQuery(type, data) {
	const additionalData = qs.stringify(data, { encode: false });
	const query = `/ghostkit/v1/get_twitter_${type}/${
		additionalData ? `?${additionalData}` : ''
	}`;

	return query;
}
