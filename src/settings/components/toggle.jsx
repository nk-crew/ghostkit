/**
 * Import CSS
 */
import './toggle.scss';

/**
 * External dependencies
 */
import { Component } from 'react';

/**
 * WordPress dependencies
 */
const WPToggleControl = wp.components.ToggleControl;

export default class Toggle extends Component {
    render() {
        return <WPToggleControl { ...this.props } />;
    }
}
