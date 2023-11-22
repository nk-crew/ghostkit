/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { ColorIndicator as WPColorIndicator } from '@wordpress/components';

/**
 * Component Class
 */
export default function ColorIndicator(props) {
  const { className } = props;

  return (
    <WPColorIndicator {...props} className={classnames('ghostkit-color-indicator', className)} />
  );
}