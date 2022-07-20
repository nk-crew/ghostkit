/**
 * External dependencies
 */
const { compact, map } = window.lodash;

/**
 * WordPress dependencies
 */
const { Component, createRef } = wp.element;

const { transformStyles } = wp.blockEditor;

const EDITOR_WRAPPER = '.block-editor-block-list__layout';
const EDITOR_STYLES_SELECTOR = '.editor-styles-wrapper';

export default class EditorStyles extends Component {
  constructor(props) {
    super(props);

    this.styleRef = createRef();
    this.$styleTag = null;
  }

  componentDidMount() {
    this.createStyleTag();
    this.updateStyles();
  }

  componentDidUpdate(prevProps) {
    const { styles } = this.props;

    const { styles: prevStyles } = prevProps;

    let force = false;

    if (!this.$styleTag) {
      this.createStyleTag();
      force = !!this.$styleTag;
    }

    if (force || styles !== prevStyles) {
      this.updateStyles();
    }
  }

  componentWillUnmount() {
    this.removeStyleTag();
  }

  createStyleTag() {
    const { ownerDocument } = this.styleRef.current;
    const $body = ownerDocument.querySelector(EDITOR_WRAPPER);

    // We should check if the editor wrapper exists,
    // since in the FSE editor there is a small delay before block preview rendering.
    if ($body) {
      this.$styleTag = ownerDocument.createElement('style');
      $body.appendChild(this.$styleTag);
    }
  }

  removeStyleTag() {
    if (!this.$styleTag) {
      return;
    }

    const { ownerDocument } = this.styleRef.current;
    const $body = ownerDocument.querySelector(EDITOR_WRAPPER);

    if ($body && this.$styleTag) {
      $body.removeChild(this.$styleTag);
    }
  }

  updateStyles() {
    if (!this.$styleTag) {
      return;
    }

    const { styles } = this.props;

    const transformedStyles = transformStyles(
      [
        {
          css: styles,
        },
      ],
      EDITOR_STYLES_SELECTOR
    );

    let resultStyles = '';

    map(compact(transformedStyles), (updatedCSS) => {
      resultStyles += updatedCSS;
    });

    this.$styleTag.innerHTML = resultStyles;
  }

  render() {
    // Use an empty style element to have a document reference, but this could be any element.
    // This is important for FSE templates editor, which use iframe.
    return <style ref={this.styleRef} />;
  }
}
