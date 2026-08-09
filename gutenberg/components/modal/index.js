import { Modal } from '@wordpress/components';
import classnames from 'classnames/dedupe';

/**
 * Component Class
 *
 * @param props
 */
export default function ModalComponent(props) {
	let className = 'ghostkit-component-modal';

	if (props.position) {
		className = classnames(
			className,
			`ghostkit-component-modal-position-${props.position}`
		);
	}

	if (props.size) {
		className = classnames(
			className,
			`ghostkit-component-modal-size-${props.size}`
		);
	}

	className = classnames(className, props.className);

	return (
		<Modal {...props} className={className}>
			{props.children}
		</Modal>
	);
}
