import { Component } from 'react';

import './spinner.scss';

const WPSpinner = wp.components.Spinner;

export default class Spinner extends Component {
    render() {
        return <WPSpinner { ...this.props } />;
    }
}
