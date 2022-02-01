/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __ } = wp.i18n;

const { Button, Popover } = wp.components;

/**
 * Component Class
 */
export default class RemoveButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmed: -1,
    };
  }

  render() {
    const {
      onRemove,
      show,
      style,
      tooltipText = __('Remove Block?', '@@text_domain'),
      tooltipRemoveText = __('Remove', '@@text_domain'),
      tooltipCancelText = __('Cancel', '@@text_domain'),
    } = this.props;

    const { confirmed } = this.state;

    if (!show) {
      return null;
    }

    return (
      <Button
        className="ghostkit-component-remove-button"
        onClick={() => {
          if (confirmed === -1) {
            this.setState({
              confirmed: 0,
            });
          }
        }}
        style={style}
      >
        {confirmed === 0 ? (
          <Popover
            className="ghostkit-component-remove-button-confirm"
            onClose={() => {
              this.setState({
                confirmed: -1,
              });
            }}
            onClickOutside={() => {
              this.setState({
                confirmed: -1,
              });
            }}
          >
            {tooltipText}
            <Button className="ghostkit-component-remove-button-confirm-yep" onClick={onRemove}>
              {tooltipRemoveText}
            </Button>
            <Button
              className="ghostkit-component-remove-button-confirm-nope"
              onClick={() => {
                this.setState({
                  confirmed: -1,
                });
              }}
            >
              {tooltipCancelText}
            </Button>
          </Popover>
        ) : (
          ''
        )}
        {getIcon('icon-trash')}
      </Button>
    );
  }
}
