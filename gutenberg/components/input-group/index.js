import classnames from 'classnames/dedupe';

import { BaseControl } from '@wordpress/components';

/**
 * Component
 *
 * @param props
 */
export default function InputGroup(props) {
	const { className, children, ...restProps } = props;

	return (
		<BaseControl
			className={classnames('ghostkit-component-input-group', className)}
			{...restProps}
		>
			<div className="ghostkit-component-input-group-wrapper">
				{children}
			</div>
		</BaseControl>
	);
}
