export function getTemplates( state ) {
	return state.templates;
}

export function getTemplateData( state, id ) {
	return state.templatesData[ id ];
}
