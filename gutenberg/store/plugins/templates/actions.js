export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setTemplates(templates) {
	return {
		type: 'SET_TEMPLATES',
		templates,
	};
}

export function setTemplateData(data) {
	return {
		type: 'SET_TEMPLATE_DATA',
		data,
	};
}
