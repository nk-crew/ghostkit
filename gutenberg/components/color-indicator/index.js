import { ColorIndicator as WPColorIndicator } from '@wordpress/components';
import classnames from 'classnames/dedupe';

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
