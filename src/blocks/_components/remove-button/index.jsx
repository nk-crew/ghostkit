// Import CSS
import './editor.scss';

import getIcon from '../../_utils/get-icon';

const {
    Component,
} = wp.element;

const { __ } = wp.i18n;

const {
    Button,
    Popover,
} = wp.components;

export default class RemoveButton extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            confirmed: -1,
        };
    }

    render() {
        const {
            onRemove,
            show,
            style,
            tooltipText = __( 'Remove block?' ),
            tooltipRemoveText = __( 'Remove' ),
            tooltipCancelText = __( 'Cancel' ),
        } = this.props;

        const {
            confirmed,
        } = this.state;

        if ( ! show ) {
            return '';
        }

        return (
            <Button
                className="ghostkit-component-remove-button"
                onClick={ () => {
                    if ( confirmed === -1 ) {
                        this.setState( {
                            confirmed: 0,
                        } );
                    }
                } }
                style={ style }
            >
                { confirmed === 0 ? (
                    <Popover
                        className="ghostkit-component-remove-button-confirm"
                        onClose={ () => {
                            this.setState( {
                                confirmed: -1,
                            } );
                        } }
                        onClickOutside={ () => {
                            this.setState( {
                                confirmed: -1,
                            } );
                        } }
                    >
                        { tooltipText }
                        <Button
                            className="ghostkit-component-remove-button-confirm-yep"
                            onClick={ onRemove }
                        >
                            { tooltipRemoveText }
                        </Button>
                        <Button
                            className="ghostkit-component-remove-button-confirm-nope"
                            onClick={ () => {
                                this.setState( {
                                    confirmed: -1,
                                } );
                            } }
                        >
                            { tooltipCancelText }
                        </Button>
                    </Popover>
                ) : '' }
                { getIcon( 'icon-trash', true ) }
            </Button>
        );
    }
}
