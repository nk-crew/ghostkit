/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { Modal } from '@wordpress/components';

/**
 * Component Class
 *
 * @param props
 */
export default function ModalComponent( props ) {
	let className = 'ghostkit-component-modal';

	if ( props.position ) {
		className = classnames( className, `ghostkit-component-modal-position-${ props.position }` );
	}

	if ( props.size ) {
		className = classnames( className, `ghostkit-component-modal-size-${ props.size }` );
	}

	className = classnames( className, props.className );

	return (
		<Modal { ...props } className={ className }>
			{ props.children }
		</Modal>
	);
}
