import qs from 'qs';

export default function prepareQuery({ id, ...data }) {
	const additionalData = qs.stringify(data, { encode: false });
	const query = `/ghostkit/v1/get_attachment_image/${id}${
		additionalData ? `?${additionalData}` : ''
	}`;

	return query;
}
