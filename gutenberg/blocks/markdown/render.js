import MarkdownIt from 'markdown-it';

import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Module variables
 */
const markdownConverter = new MarkdownIt();

/**
 * MDRender Class.
 *
 * @param props
 */
export default function MDRender(props) {
	const { content, ...restProps } = props;

	return (
		<RawHTML
			onClick={(e) => {
				if (e.target.nodeName === 'A') {
					if (
						// eslint-disable-next-line no-alert
						!window.confirm(
							__(
								'Are you sure you wish to leave this page?',
								'ghostkit'
							)
						)
					) {
						e.preventDefault();
					}
				}
			}}
			{...restProps}
		>
			{content && content.length ? markdownConverter.render(content) : ''}
		</RawHTML>
	);
}
