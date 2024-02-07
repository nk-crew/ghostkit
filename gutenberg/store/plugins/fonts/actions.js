export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setCustomFonts(data) {
	return {
		type: 'SET_CUSTOM_FONTS',
		data,
	};
}

export function updateCustomFonts(data) {
	return {
		type: 'UPDATE_CUSTOM_FONTS',
		data,
	};
}
