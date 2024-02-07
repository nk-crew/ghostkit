export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setTOC(query, toc) {
	return {
		type: 'SET_TOC',
		query,
		toc,
	};
}
