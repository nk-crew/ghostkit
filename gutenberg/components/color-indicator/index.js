import classnames from 'classnames/dedupe';

import { ColorIndicator as WPColorIndicator } from '@wordpress/components';

/**
 * Component Class
 *
 * @param props
 */
export default function ColorIndicator(props) {
	const { className } = props;

	return (
		<WPColorIndicator
			{...props}
			className={classnames('ghostkit-color-indicator', className)}
		/>
	);
}
