export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setCustomizerData(query, data) {
	return {
		type: 'SET_CUSTOMIZER_DATA',
		query,
		data,
	};
}
