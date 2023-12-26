export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setImageTagData(query, image) {
	return {
		type: 'SET_IMAGE_TAG_DATA',
		query,
		image,
	};
}
