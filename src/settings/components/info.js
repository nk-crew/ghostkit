/**
 * Import CSS
 */
import './info.scss';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

export default class Info extends Component {
    render() {
        return (
            <div className="ghostkit-settings-info">
                { this.props.children }
            </div>
        );
    }
}
