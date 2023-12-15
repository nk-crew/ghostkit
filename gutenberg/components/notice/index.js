/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { Notice as WPNotice } from '@wordpress/components';

/**
 * Component Class
 *
 * @param props
 */
export default function Notice( props ) {
	const { className, ...allProps } = props;

	return <WPNotice className={ classnames( 'ghostkit-component-notice', className ) } { ...allProps } />;
}
