/**
 * WordPress dependencies
 */
const { Component } = wp.element;

/**
 * Component Class
 */
export default class ProNote extends Component {
    render() {
        const {
            title,
            children,
            contentBefore = '',
            contentAfter = '',
        } = this.props;

        return (
            <div className="ghostkit-pro-component-note">
                { contentBefore }
                <div className="ghostkit-pro-component-note-inner">
                    { title ? (
                        <h3>{ title }</h3>
                    ) : '' }
                    { children ? (
                        <div>{ children }</div>
                    ) : '' }
                </div>
                { contentAfter }
            </div>
        );
    }
}

/**
 * Button Component Class
 */
ProNote.Button = class ProNoteButton extends Component {
    render() {
        const {
            children,
        } = this.props;

        return (
            <a className="ghostkit-pro-component-note-button" { ...this.props }>
                { children }
            </a>
        );
    }
};
