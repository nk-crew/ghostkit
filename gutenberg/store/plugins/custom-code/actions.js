export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setCustomCode(data) {
	return {
		type: 'SET_CUSTOM_CODE',
		data,
	};
}

export function updateCustomCode(data) {
	return {
		type: 'UPDATE_CUSTOM_CODE',
		data,
	};
}
