import classnames from 'classnames/dedupe';

import { Button, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Component Class
 *
 * @param props
 */
export default function ImportantToggle(props) {
	const { onClick, isActive } = props;

	return (
		<Tooltip text={__('!important', 'ghostkit')}>
			<Button
				className={classnames(
					'ghostkit-control-important-toggle',
					isActive && 'is-active'
				)}
				onClick={() => {
					onClick(!isActive);
				}}
			>
				!
			</Button>
		</Tooltip>
	);
}
