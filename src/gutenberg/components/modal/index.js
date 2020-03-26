/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    Component,
} = wp.element;

const {
    Modal,
} = wp.components;

/**
 * Component Class
 */
export default class ModalComponent extends Component {
    render() {
        let className = 'ghostkit-component-modal';

        if ( this.props.position ) {
            className = classnames( className, `ghostkit-component-modal-position-${ this.props.position }` );
        }

        if ( this.props.size ) {
            className = classnames( className, `ghostkit-component-modal-size-${ this.props.size }` );
        }

        className = classnames( className, this.props.className );

        return (
            <Modal
                { ...this.props }
                className={ className }
            >
                { this.props.children }
            </Modal>
        );
    }
}
