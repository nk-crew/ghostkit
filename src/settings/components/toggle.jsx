import { Component } from 'react';

import './toggle.scss';

const WPToggleControl = wp.components.ToggleControl;

export default class Toggle extends Component {
    render() {
        return <WPToggleControl { ...this.props } />;
    }
}
