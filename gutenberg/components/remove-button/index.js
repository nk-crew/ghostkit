import { Button, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';

/**
 * Component Class
 *
 * @param props
 */
export default function RemoveButton(props) {
	const [confirmed, setConfirmed] = useState(-1);

	const {
		onRemove,
		show,
		style,
		tooltipText = __('Remove Block?', 'ghostkit'),
		tooltipRemoveText = __('Remove', 'ghostkit'),
		tooltipCancelText = __('Cancel', 'ghostkit'),
	} = props;

	if (!show) {
		return null;
	}

	return (
		<Button
			className="ghostkit-component-remove-button"
			onClick={() => {
				if (confirmed === -1) {
					setConfirmed(0);
				}
			}}
			style={style}
		>
			{confirmed === 0 ? (
				<Popover
					className="ghostkit-component-remove-button-confirm"
					onClose={() => {
						setConfirmed(-1);
					}}
					onFocusOutside={() => {
						setConfirmed(-1);
					}}
				>
					{tooltipText}
					<Button
						className="ghostkit-component-remove-button-confirm-yep"
						onClick={onRemove}
					>
						{tooltipRemoveText}
					</Button>
					<Button
						className="ghostkit-component-remove-button-confirm-nope"
						onClick={() => {
							setConfirmed(-1);
						}}
					>
						{tooltipCancelText}
					</Button>
				</Popover>
			) : null}
			{getIcon('icon-trash')}
		</Button>
	);
}
