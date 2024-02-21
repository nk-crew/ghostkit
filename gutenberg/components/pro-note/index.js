import classnames from 'classnames/dedupe';

import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

import getIcon from '../../utils/get-icon';

export default function ProNote(props) {
	const { title, children } = props;

	const [collapsed, setCollapsed] = useState(props.collapsed);

	return (
		<div
			className={classnames(
				'ghostkit-pro-component-note',
				collapsed && 'ghostkit-pro-component-note-collapsed'
			)}
		>
			<div className="ghostkit-pro-component-note-inner">
				{title && <h3>{title}</h3>}
				{collapsed && (
					<Button
						onClick={() => {
							setCollapsed(!collapsed);
						}}
					>
						{getIcon('icon-arrow-right')}
					</Button>
				)}
				{!collapsed && children && <div>{children}</div>}
			</div>
		</div>
	);
}

/**
 * Button for ProNote
 * @param props
 */
ProNote.Button = function ProNoteButton(props) {
	const { children } = props;

	return (
		<a className="ghostkit-pro-component-note-button" {...props}>
			{children}
		</a>
	);
};
