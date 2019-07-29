/**
 * Import CSS
 */
import './spinner.scss';

/**
 * External dependencies
 */
import { Component } from 'react';

/**
 * WordPress dependencies
 */
const WPSpinner = wp.components.Spinner;

export default class Spinner extends Component {
    render() {
        return <WPSpinner { ...this.props } />;
    }
}
