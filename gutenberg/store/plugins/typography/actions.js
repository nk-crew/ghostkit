export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setCustomTypography(data) {
	return {
		type: 'SET_CUSTOM_TYPOGRAPHY',
		data,
	};
}

export function updateCustomTypography(data) {
	return {
		type: 'UPDATE_CUSTOM_TYPOGRAPHY',
		data,
	};
}
