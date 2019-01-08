import { Component } from 'react';

import './tooltip.scss';

const WPTooltip = wp.components.Tooltip;

export default class Tooltip extends Component {
    render() {
        return <WPTooltip { ...this.props } />;
    }
}
