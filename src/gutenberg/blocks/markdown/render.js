/**
 * External dependencies
 */
import MarkdownIt from 'markdown-it';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { RawHTML, Component } = wp.element;

/**
 * Module variables
 */
const markdownConverter = new MarkdownIt();

/**
 * MDRender Class.
 */
export default class MDRender extends Component {
  render() {
    const { className, content } = this.props;

    return (
      <RawHTML
        className={className}
        onClick={(e) => {
          if ('A' === e.target.nodeName) {
            // eslint-disable-next-line no-alert
            if (!window.confirm(__('Are you sure you wish to leave this page?', '@@text_domain'))) {
              e.preventDefault();
            }
          }
        }}
      >
        {content && content.length ? markdownConverter.render(content) : ''}
      </RawHTML>
    );
  }
}
