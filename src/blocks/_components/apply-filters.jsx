const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

export default class ApplyFilters extends Component {
    render() {
        const {
            name,
            children,
        } = this.props;

        return (
            applyFilters(
                name,
                children,
                this.props,
            )
        );
    }
}
