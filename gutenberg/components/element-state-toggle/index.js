import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import ActiveIndicator from '../active-indicator';

/**
 * Component Class
 *
 * @param props
 */
export default function ElementStateToggle(props) {
	const {
		isHover,
		onChange,
		checkActive = () => {
			return false;
		},
	} = props;

	return (
		<Button
			className="ghostkit-control-element-state-toggle"
			onClick={() => {
				onChange(!isHover);
			}}
		>
			{getIcon('icon-pointer')}
			{checkActive() && <ActiveIndicator />}
			{isHover && <span>{__(':hover', 'ghostkit')}</span>}
		</Button>
	);
}
