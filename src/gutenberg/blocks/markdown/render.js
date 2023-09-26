/**
 * External dependencies
 */
import MarkdownIt from 'markdown-it';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { RawHTML } = wp.element;

/**
 * Module variables
 */
const markdownConverter = new MarkdownIt();

/**
 * MDRender Class.
 */
export default function MDRender(props) {
  const { content, ...restProps } = props;

  return (
    <RawHTML
      onClick={(e) => {
        if (e.target.nodeName === 'A') {
          // eslint-disable-next-line no-alert
          if (!window.confirm(__('Are you sure you wish to leave this page?', '@@text_domain'))) {
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
