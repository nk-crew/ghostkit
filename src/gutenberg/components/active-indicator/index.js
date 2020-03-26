/**
 * WordPress dependencies
 */
const { Component } = wp.element;

/**
 * Component Class
 */
export default class ActiveIndicator extends Component {
    render() {
        return (
            <span className="ghostkit-component-active-indicator" />
        );
    }
}
