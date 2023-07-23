/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Notice: WPNotice } = wp.components;

/**
 * Component Class
 */
export default function Notice(props) {
  const { className, ...allProps } = props;

  return <WPNotice className={classnames('ghostkit-component-notice', className)} {...allProps} />;
}
