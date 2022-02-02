/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { ColorIndicator: WPColorIndicator } = wp.components;

/**
 * Component Class
 */
export default class ColorIndicator extends Component {
  render() {
    const { className } = this.props;

    return (
      <WPColorIndicator
        {...this.props}
        className={classnames('ghostkit-color-indicator', className)}
      />
    );
  }
}
