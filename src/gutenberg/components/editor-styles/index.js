/**
 * External dependencies
 */
const { compact, map } = window.lodash;

/**
 * WordPress dependencies
 */
const { Component, createRef } = wp.element;

const { transformStyles } = wp.blockEditor;

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

    if (styles !== prevStyles) {
      this.updateStyles();
    }
  }

  componentWillUnmount() {
    this.removeStyleTag();
  }

  createStyleTag() {
    const { ownerDocument } = this.styleRef.current;
    const { body } = ownerDocument;

    this.$styleTag = ownerDocument.createElement('style');
    body.appendChild(this.$styleTag);
  }

  removeStyleTag() {
    const { ownerDocument } = this.styleRef.current;
    const { body } = ownerDocument;

    body.removeChild(this.$styleTag);
  }

  updateStyles() {
    const { styles } = this.props;

    const transformedStyles = transformStyles(
      [
        {
          css: styles,
        },
      ],
      '.editor-styles-wrapper'
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
