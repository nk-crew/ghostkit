/**
 * Component Class
 *
 * @param props
 */
export default function ProNote( props ) {
	const { title, children, contentBefore = '', contentAfter = '' } = props;

	return (
		<div className="ghostkit-pro-component-note">
			{ contentBefore }
			<div className="ghostkit-pro-component-note-inner">
				{ title ? <h3>{ title }</h3> : '' }
				{ children ? <div>{ children }</div> : '' }
			</div>
			{ contentAfter }
		</div>
	);
}

/**
 * Button Component Class
 *
 * @param props
 */
ProNote.Button = function ProNoteButton( props ) {
	const { children } = props;

	return (
		<a className="ghostkit-pro-component-note-button" { ...props }>
			{ children }
		</a>
	);
};
