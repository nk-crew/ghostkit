/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { RichText } = wp.blockEditor;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { url, srcset, alt, width, height, caption } = this.props.attributes;

    let { className } = this.props.attributes;

    className = classnames('ghostkit-gif', className);

    return (
      <figure className={className}>
        <img src={url} srcSet={srcset} alt={alt} width={width} height={height} />
        {!RichText.isEmpty(caption) ? (
          <RichText.Content className="ghostkit-gif-caption" tagName="figcaption" value={caption} />
        ) : (
          ''
        )}
      </figure>
    );
  }
}

export default BlockSave;
