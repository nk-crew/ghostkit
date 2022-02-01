/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import MDRender from './render';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { content } = this.props.attributes;

    let { className } = this.props.attributes;

    className = classnames('ghostkit-markdown', className);

    return <MDRender className={className} content={content} />;
  }
}

export default BlockSave;
