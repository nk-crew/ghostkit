/**
 * Import CSS
 */
import './info.scss';

/**
 * External dependencies
 */
import { Component } from 'react';

export default class Info extends Component {
    render() {
        return (
            <div className="ghostkit-settings-info">
                { this.props.children }
            </div>
        );
    }
}
