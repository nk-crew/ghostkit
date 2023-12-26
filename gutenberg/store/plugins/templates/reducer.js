function reducer(state = { templates: false, templatesData: {} }, action = {}) {
	switch (action.type) {
		case 'SET_TEMPLATES':
			if (!state.templates && action.templates) {
				state.templates = action.templates;
			}
			break;
		case 'SET_TEMPLATE_DATA':
			if (
				action.templatesData &&
				action.templatesData.id &&
				!state.templatesData[action.templatesData.id]
			) {
				state.templatesData[action.templatesData.id] =
					action.templatesData;
			}
			break;
		// no default
	}

	return state;
}

export default reducer;
