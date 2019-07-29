/**
 * Import CSS
 */
import './tooltip.scss';

/**
 * External dependencies
 */
import { Component } from 'react';

/**
 * WordPress dependencies
 */
const WPTooltip = wp.components.Tooltip;

export default class Tooltip extends Component {
    render() {
        return <WPTooltip { ...this.props } />;
    }
}
