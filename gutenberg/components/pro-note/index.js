import { __ } from '@wordpress/i18n';

/**
 * One line of help text with a link to the Pro docs.
 *
 * @param {Object} props
 * @param {string} props.href     docs URL.
 * @param {*}      props.children help text.
 */
export default function ProNote({ href, children }) {
	return (
		<p className="ghostkit-pro-component-note">
			{children}{' '}
			<a href={href} target="_blank" rel="noopener noreferrer">
				<span>{__('Read More', 'ghostkit')}</span>
				<span aria-hidden="true"> →</span>
			</a>
		</p>
	);
}
