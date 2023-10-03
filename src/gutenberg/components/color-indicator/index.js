/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { ColorIndicator: WPColorIndicator } = wp.components;

/**
 * Component Class
 */
export default function ColorIndicator(props) {
  const { className } = props;

  return (
    <WPColorIndicator {...props} className={classnames('ghostkit-color-indicator', className)} />
  );
}
